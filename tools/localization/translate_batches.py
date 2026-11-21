import argparse
import json
import os
import re
import sys

KEY_LINE = re.compile(r"^([a-z][a-z0-9_-]*) = ?(.*)$")


def read_entries(path):
    entries = {}
    current = None
    with open(path, encoding="utf-8") as handle:
        for line in handle.read().splitlines():
            if not line.strip() or line.startswith("#"):
                continue
            if line[0] in " \t":
                if current is not None and not line.strip().startswith("."):
                    entries[current] += "\n" + line.strip()
                continue
            match = KEY_LINE.match(line)
            if match:
                current = match.group(1)
                entries[current] = match.group(2)
    return entries


def read_language(root, code, folder):
    entries = {}
    base = os.path.join(root, code, folder)
    if not os.path.isdir(base):
        return entries
    for directory, _, files in os.walk(base):
        for name in sorted(files):
            if name.endswith(".ftl"):
                entries.update(read_entries(os.path.join(directory, name)))
    return entries


def export_batches(root, folder, output, size):
    english = read_language(root, "en", folder)
    russian = read_language(root, "ru", folder)
    missing = {key: value for key, value in english.items() if key not in russian}
    os.makedirs(output, exist_ok=True)
    keys = sorted(missing)
    count = 0
    for index in range(0, len(keys), size):
        batch = {key: missing[key] for key in keys[index:index + size]}
        count += 1
        path = os.path.join(output, f"en_{count:03d}.json")
        with open(path, "w", encoding="utf-8", newline="\n") as handle:
            json.dump(batch, handle, ensure_ascii=False, indent=1)
    print(f"{len(keys)} ключей в {count} пакетах -> {output}")


def import_batches(root, folder, source):
    english = read_language(root, "en", folder)
    by_file = {}
    base = os.path.join(root, "en", folder)
    key_files = {}
    for directory, _, files in os.walk(base):
        for name in files:
            if name.endswith(".ftl"):
                path = os.path.join(directory, name)
                for key in read_entries(path):
                    key_files[key] = os.path.relpath(path, os.path.join(root, "en"))
    translated = {}
    for name in sorted(os.listdir(source)):
        if name.startswith("ru_") and name.endswith(".json"):
            with open(os.path.join(source, name), encoding="utf-8") as handle:
                translated.update(json.load(handle))
    skipped = []
    for key, value in translated.items():
        if key not in key_files or "ё" in value or "Ё" in value:
            skipped.append(key)
            continue
        placeholders = set(re.findall(r"\$([a-z][a-z0-9_]*)", english.get(key, "")))
        if not set(re.findall(r"\$([a-z][a-z0-9_]*)", value)) <= placeholders:
            skipped.append(key)
            continue
        by_file.setdefault(key_files[key], []).append((key, value))
    for relative, entries in by_file.items():
        path = os.path.join(root, "ru", relative)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        previous = ""
        if os.path.exists(path):
            with open(path, encoding="utf-8") as handle:
                previous = handle.read().rstrip("\n") + "\n\n"
        entries.sort()
        with open(path, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(previous + "\n\n".join(f"{key} = {value}" for key, value in entries) + "\n")
    print(f"импортировано {sum(len(v) for v in by_file.values())}, пропущено {len(skipped)}")
    if skipped:
        print("пропущены:", ", ".join(skipped[:20]))


def main(argv=None):
    parser = argparse.ArgumentParser(description="Пакеты для перевода ключей")
    parser.add_argument("command", choices=("export", "import"))
    parser.add_argument("--root", default="strings/localization")
    parser.add_argument("--folder", default="auto")
    parser.add_argument("--dir", required=True)
    parser.add_argument("--size", type=int, default=300)
    arguments = parser.parse_args(argv)
    if arguments.command == "export":
        export_batches(arguments.root, arguments.folder, arguments.dir, arguments.size)
    else:
        import_batches(arguments.root, arguments.folder, arguments.dir)
    return 0


if __name__ == "__main__":
    sys.exit(main())
