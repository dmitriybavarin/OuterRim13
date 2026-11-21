import argparse
import json
import os
import re
import sys

IDENTIFIER_PATH = re.compile(r"^[A-Za-z_]\w*(\.[A-Za-z_]\w*)*$")
SPAN_CALL = re.compile(r"\bspan_[a-z_]+\(")
BALLOON_CALL = re.compile(r"\b(balloon_alert|balloon_alert_to_viewers|balloon_alert_to_hearers)\(")
MESSAGE_CALL = re.compile(r"\b(visible_message|audible_message)\(")
TO_CHAT_CALL = re.compile(r"\bto_chat\(")
RESERVED = {
    "src": "source",
    "usr": "actor",
    "type": "kind",
    "loc": "location",
    "in": "in_value",
    "as": "as_value",
    "to": "to_value",
    "if": "if_value",
    "else": "else_value",
    "for": "for_value",
    "while": "while_value",
    "do": "do_value",
    "var": "var_value",
    "proc": "proc_value",
    "new": "new_value",
    "del": "del_value",
    "set": "set_value",
    "return": "return_value",
    "null": "null_value",
    "global": "global_value",
    "list": "list_value",
    "step": "step_value",
    "switch": "switch_value",
    "spawn": "spawn_value",
    "sleep": "sleep_value",
    "call": "call_value",
    "verb": "verb_value",
    "break": "break_value",
    "continue": "continue_value",
    "goto": "goto_value",
}
SKIP_PATH_PARTS = ("code/modules/localization", "code/modules/unit_tests", "code/modules/admin/", "code/__DEFINES", "code/__HELPERS/priority_announce.dm")


class Complex(Exception):
    pass


def scan_string(text, start):
    parts = []
    literal = []
    index = start + 1
    length = len(text)
    while index < length:
        character = text[index]
        if character == "\\":
            following = text[index + 1] if index + 1 < length else ""
            if following == '"':
                literal.append('"')
                index += 2
            elif following == "\\":
                literal.append("\\")
                index += 2
            elif following == "[":
                literal.append("[")
                index += 2
            elif following == "\n":
                index += 2
                while index < length and text[index] in " \t":
                    index += 1
            else:
                raise Complex()
        elif character == "\n":
            raise Complex()
        elif character == "[":
            depth = 1
            cursor = index + 1
            while depth and cursor < length:
                inner = text[cursor]
                if inner == '"':
                    cursor, _ = scan_string(text, cursor)
                    cursor += 1
                    continue
                if inner == "[":
                    depth += 1
                elif inner == "]":
                    depth -= 1
                cursor += 1
            if depth:
                raise Complex()
            if literal:
                parts.append(("lit", "".join(literal)))
                literal = []
            parts.append(("expr", text[index + 1:cursor - 1].strip()))
            index = cursor
        elif character == '"':
            if literal:
                parts.append(("lit", "".join(literal)))
            return index, parts
        else:
            literal.append(character)
            index += 1
    raise Complex()


def split_arguments(text, open_index):
    arguments = []
    depth = 0
    start = open_index + 1
    index = open_index
    length = len(text)
    while index < length:
        character = text[index]
        if character == '"':
            try:
                index, _ = scan_string(text, index)
            except Complex:
                return None
        elif character in "([":
            depth += 1
        elif character in ")]":
            depth -= 1
            if depth == 0:
                arguments.append((start, index))
                return arguments
        elif character == "," and depth == 1:
            arguments.append((start, index))
            start = index + 1
        index += 1
    return None


def slugify_words(text, limit=6):
    words = re.findall(r"[a-z0-9]+", text.lower())
    return "_".join(words[:limit]) or "text"


def group_and_stem(path):
    normalized = path.replace("\\", "/")
    parts = normalized.split("/")
    if parts[0] != "code":
        return None, None
    tail = parts[1:]
    if tail[0] == "modules" and len(tail) > 2:
        group = tail[1]
    elif len(tail) > 2:
        group = tail[1]
    else:
        group = tail[0]
    group = re.sub(r"[^a-z0-9]", "", group.lower()) or "misc"
    stem = re.sub(r"[^a-z0-9_]", "_", os.path.splitext(parts[-1])[0].lower()).strip("_") or "file"
    return group, stem


def argument_name(expression, taken):
    base = re.match(r"[A-Za-z_]\w*", expression).group(0).lower()
    base = RESERVED.get(base, base)
    name = base
    counter = 2
    while name in taken:
        name = f"{base}_{counter}"
        counter += 1
    taken.add(name)
    return name


def ftl_text(parts, names):
    pieces = []
    for kind, value in parts:
        if kind == "lit":
            pieces.append(value.replace("{", '{ "{" }').replace("}", '{ "}" }'))
        else:
            pieces.append("{ $%s }" % names[value])
    return "".join(pieces)


def qualifies(parts):
    text = "".join(value for kind, value in parts if kind == "lit")
    if not re.search(r"[A-Za-z]", text):
        return False
    if any(kind == "expr" and not IDENTIFIER_PATH.match(value) for kind, value in parts):
        return False
    first = parts[0]
    last = parts[-1]
    if first[0] == "lit" and first[1][:1].isspace():
        return False
    if last[0] == "lit" and last[1][-1:].isspace():
        return False
    if "href=" in text or "\n" in text:
        return False
    for index, (kind, value) in enumerate(parts):
        if kind != "expr":
            continue
        if index > 0 and parts[index - 1][0] == "lit" and parts[index - 1][1][-1:].isalnum():
            return False
        if index + 1 < len(parts) and parts[index + 1][0] == "lit" and parts[index + 1][1][:1].isalnum():
            return False
    return True


class Registry:
    def __init__(self, existing):
        self.keys = {}
        self.by_text = {}
        self.existing = set(existing)

    def key_for(self, group, stem, parts, names):
        value = ftl_text(parts, names)
        cache_key = (group, stem, value)
        if cache_key in self.by_text:
            return self.by_text[cache_key]
        plain = "".join(v if kind == "lit" else " %s " % names[v] for kind, v in parts)
        base = f"{group}-{stem}-{slugify_words(plain)}"
        key = base
        counter = 2
        while key in self.keys or key in self.existing:
            key = f"{base}_{counter}"
            counter += 1
        self.keys[key] = (group, value)
        self.by_text[cache_key] = key
        return key


def build_call(key, parts, names):
    expressions = []
    for kind, value in parts:
        if kind == "expr" and value not in [e for e, _ in expressions]:
            expressions.append((value, names[value]))
    if not expressions:
        return f'LOC_KEY("{key}")'
    inner = ", ".join(f"{name} = {expression}" for expression, name in expressions)
    return f'loc_key("{key}", list({inner}))'


def literal_targets(text):
    targets = []
    for match in SPAN_CALL.finditer(text):
        if match.group(0).startswith("span_admin"):
            continue
        open_index = match.end() - 1
        arguments = split_arguments(text, open_index)
        if arguments and len(arguments) == 1:
            targets.append(arguments[0])
    for match in BALLOON_CALL.finditer(text):
        arguments = split_arguments(text, match.end() - 1)
        if not arguments:
            continue
        position = 0 if match.group(1) != "balloon_alert" else 1
        for slot in range(position, min(len(arguments), position + (1 if match.group(1) == "balloon_alert" else 2))):
            targets.append(arguments[slot])
    for match in MESSAGE_CALL.finditer(text):
        arguments = split_arguments(text, match.end() - 1)
        if arguments:
            targets.extend(arguments[:3])
    for match in TO_CHAT_CALL.finditer(text):
        arguments = split_arguments(text, match.end() - 1)
        if arguments and len(arguments) >= 2:
            targets.append(arguments[1])
    return targets


def process_text(text, registry, group, stem, stats):
    replacements = []
    seen = set()
    for start, end in literal_targets(text):
        segment = text[start:end]
        stripped = segment.strip()
        offset = start + (len(segment) - len(segment.lstrip()))
        if not stripped.startswith('"') or (offset in seen):
            continue
        seen.add(offset)
        try:
            close, parts = scan_string(text, offset)
        except Complex:
            stats["complex"] += 1
            continue
        if close + 1 != offset + len(stripped) or not parts:
            stats["complex"] += 1
            continue
        line_start = text.rfind("\n", 0, offset) + 1
        if text[line_start:offset].lstrip().startswith(("#", "//", "///")):
            continue
        if not qualifies(parts):
            stats["complex"] += 1
            continue
        names = {}
        taken = set()
        for kind, value in parts:
            if kind == "expr" and value not in names:
                names[value] = argument_name(value, taken)
        key = registry.key_for(group, stem, parts, names)
        replacements.append((offset, close + 1, build_call(key, parts, names)))
        stats["replaced"] += 1
    replacements.sort(reverse=True)
    for start, end, new in replacements:
        text = text[:start] + new + text[end:]
    return text


def collect_existing(strings_root):
    existing = set()
    key_line = re.compile(r"^([a-z][a-z0-9_-]*) =", re.M)
    for directory, _, files in os.walk(strings_root):
        for name in files:
            if name.endswith(".ftl"):
                with open(os.path.join(directory, name), encoding="utf-8") as handle:
                    existing.update(key_line.findall(handle.read()))
    return existing


def write_ftl(registry, strings_root, apply):
    by_group = {}
    for key, (group, value) in registry.keys.items():
        by_group.setdefault(group, []).append((key, value))
    for group, entries in by_group.items():
        path = os.path.join(strings_root, "en", "auto", f"{group}.ftl")
        if not apply:
            continue
        os.makedirs(os.path.dirname(path), exist_ok=True)
        previous = ""
        if os.path.exists(path):
            with open(path, encoding="utf-8") as handle:
                previous = handle.read().rstrip("\n") + "\n\n"
        with open(path, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(previous + "\n\n".join(f"{key} = {value}" for key, value in entries) + "\n")


def main(argv=None):
    parser = argparse.ArgumentParser(description="Перенос литералов сообщений DM на ключи локализации")
    parser.add_argument("paths", nargs="+", help="файлы или папки внутри code/")
    parser.add_argument("--apply", action="store_true", help="записать изменения (без флага только отчет)")
    parser.add_argument("--root", default=".")
    arguments = parser.parse_args(argv)
    root = os.path.abspath(arguments.root)
    strings_root = os.path.join(root, "strings", "localization")
    registry = Registry(collect_existing(strings_root))
    stats = {"replaced": 0, "complex": 0, "files": 0}
    files = []
    for path in arguments.paths:
        full = os.path.join(root, path)
        if os.path.isdir(full):
            for directory, _, names in os.walk(full):
                files.extend(os.path.join(directory, name) for name in names if name.endswith(".dm"))
        elif full.endswith(".dm"):
            files.append(full)
    for full in sorted(files):
        relative = os.path.relpath(full, root).replace("\\", "/")
        if any(part in relative for part in SKIP_PATH_PARTS):
            continue
        group, stem = group_and_stem(relative)
        if not group:
            continue
        with open(full, encoding="utf-8", newline="") as handle:
            original = handle.read()
        updated = process_text(original, registry, group, stem, stats)
        if updated != original:
            stats["files"] += 1
            if arguments.apply:
                with open(full, "w", encoding="utf-8", newline="") as handle:
                    handle.write(updated)
    write_ftl(registry, strings_root, arguments.apply)
    print(json.dumps({**stats, "keys": len(registry.keys), "applied": arguments.apply}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
