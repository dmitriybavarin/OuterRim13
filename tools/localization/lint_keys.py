import json
import os
import re
import sys

import build_tgui

ENTITY_PREFIX = ("ent-", "datum-")
KEY_LINE = re.compile(r"^([a-z][a-z0-9_-]*) = ?(.*)$")
VARIABLE = re.compile(r"\$([a-z][a-z0-9_]*)")
USED_STATIC = re.compile(r"(?:LOC_KEY|loc_key)\(\"([a-z][a-z0-9_-]*)\"")
USED_DYNAMIC = re.compile(r"(?:LOC_KEY|loc_key)\(\"([a-z][a-z0-9-]*-)\[")
USED_LOOKUP = re.compile(r"loc_lookup\(\"([a-z][a-z0-9-]*)\"")
USED_ZONE = re.compile(r"\"([a-z][a-z0-9-]*-)\[")
KEY_ARGUMENT = re.compile(r"[\"']([a-z][a-z0-9]*(?:-[a-z0-9]+)+)[\"']")
KEY_FORMAT = re.compile(r"^[a-z][a-z0-9]*(-[a-z0-9_]+){1,4}$")
TGUI_STATIC = re.compile(r"(?<![A-Za-z0-9_])t\(\s*'([a-z][a-z0-9_]*(?:-[a-z0-9_]+)+)'")
TGUI_LITERAL = re.compile(r"'([a-z][a-z0-9_]*(?:-[a-z0-9_]+)+)'")
TGUI_DYNAMIC = re.compile(r"`([a-z][a-z0-9_-]*-)\$\{")


def parse_file(path):
    entries = {}
    current = None
    with open(path, encoding="utf-8") as handle:
        for line in handle.read().splitlines():
            if not line.strip() or line.startswith("#"):
                continue
            if line[0] in " \t":
                if current is not None:
                    entries[current]["text"] += "\n" + line.strip()
                continue
            match = KEY_LINE.match(line)
            if match:
                current = match.group(1)
                entries[current] = {"text": match.group(2), "file": path}
    return entries


def load_language(root, code):
    entries = {}
    base = os.path.join(root, code)
    for directory, _, files in os.walk(base):
        for name in sorted(files):
            if not name.endswith(".ftl"):
                continue
            path = os.path.join(directory, name)
            for key, entry in parse_file(path).items():
                if key.startswith(ENTITY_PREFIX):
                    continue
                if key in entries:
                    entry["duplicate"] = entries[key]["file"]
                entries[key] = entry
    return entries


def used_keys(code_root):
    static = set()
    prefixes = set()
    for directory, _, files in os.walk(code_root):
        for name in files:
            if not name.endswith(".dm"):
                continue
            with open(os.path.join(directory, name), encoding="utf-8", errors="replace") as handle:
                text = handle.read()
            static.update(USED_STATIC.findall(text))
            prefixes.update(USED_DYNAMIC.findall(text))
            prefixes.update(prefix + "-" for prefix in USED_LOOKUP.findall(text))
            if name == "keys.dm":
                prefixes.update(USED_ZONE.findall(text))
    return static, prefixes


def used_tgui_keys(tgui_root):
    static = set()
    prefixes = set()
    literals = set()
    for directory, _, files in os.walk(tgui_root):
        if "node_modules" in directory or "localization" in directory:
            continue
        for name in files:
            if not name.endswith((".ts", ".tsx")):
                continue
            with open(os.path.join(directory, name), encoding="utf-8", errors="replace") as handle:
                text = handle.read()
            static.update(TGUI_STATIC.findall(text))
            literals.update(TGUI_LITERAL.findall(text))
            prefixes.update(TGUI_DYNAMIC.findall(text))
    return static, prefixes, literals


def main(root="strings/localization", code_root="code", languages=("en", "ru"), tgui_root="tgui/packages/tgui"):
    errors = []
    loaded = {code: load_language(root, code) for code in languages}
    reference = loaded[languages[0]]
    for code, entries in loaded.items():
        for key, entry in entries.items():
            if "duplicate" in entry:
                errors.append(f"{code}: duplicate key {key} in {entry['file']} and {entry['duplicate']}")
            if not KEY_FORMAT.match(key):
                errors.append(f"{code}: bad key name {key}")
            if "ё" in entry["text"] or "Ё" in entry["text"]:
                errors.append(f"{code}: letter yo in {key}")
    for code in languages[1:]:
        entries = loaded[code]
        for key in reference:
            if key not in entries:
                errors.append(f"{code}: missing key {key}")
                continue
            expected = set(VARIABLE.findall(reference[key]["text"]))
            actual = set(VARIABLE.findall(entries[key]["text"]))
            if actual - expected:
                errors.append(f"{code}: arguments of {key} differ: en {sorted(expected)}, {code} {sorted(actual)}")
        for key in entries:
            if key not in reference:
                errors.append(f"{code}: extra key {key} not present in {languages[0]}")
    static, prefixes = used_keys(code_root)
    tgui_static, tgui_prefixes, tgui_literals = used_tgui_keys(tgui_root)
    extra_root = os.path.join(os.path.dirname(os.path.normpath(tgui_root)), "tgui-escape-menu")
    if os.path.isdir(extra_root):
        extra_static, extra_prefixes, extra_literals = used_tgui_keys(extra_root)
        tgui_static |= extra_static
        tgui_prefixes |= extra_prefixes
        tgui_literals |= extra_literals
    static |= tgui_static
    prefixes |= tgui_prefixes
    marked_used = static | (tgui_literals & set(reference))
    for code in languages:
        path = os.path.join(tgui_root, "localization", f"{code}.json")
        built = build_tgui.build(root, code)
        try:
            with open(path, encoding="utf-8") as handle:
                current = json.load(handle)
        except OSError:
            current = None
        if current != built:
            errors.append(f"{path} is out of date, run build_tgui.py")
    for key in sorted(static):
        if key not in reference:
            errors.append(f"code uses undefined key {key}")
    for key in sorted(reference):
        if key not in marked_used and not any(key.startswith(prefix) for prefix in prefixes):
            errors.append(f"unused key {key}")
    for line in errors:
        print(line)
    print(f"{len(reference)} keys, {len(errors)} problems")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
