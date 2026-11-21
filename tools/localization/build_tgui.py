import json
import os
import re
import sys

KEY_LINE = re.compile(r"^([a-z][a-z0-9_-]*) = ?(.*)$")


def parse_file(path):
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


def build(root, code):
    entries = {}
    base = os.path.join(root, code, "tgui")
    for directory, _, files in os.walk(base):
        for name in sorted(files):
            if name.endswith(".ftl"):
                entries.update(parse_file(os.path.join(directory, name)))
    return dict(sorted(entries.items()))


def main(root="strings/localization", output="tgui/packages/tgui/localization", languages=("en", "ru")):
    os.makedirs(output, exist_ok=True)
    for code in languages:
        entries = build(root, code)
        path = os.path.join(output, f"{code}.json")
        with open(path, "w", encoding="utf-8", newline="\n") as handle:
            json.dump(entries, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
        print(code, len(entries), "keys ->", path)


if __name__ == "__main__":
    main(*sys.argv[1:2])
