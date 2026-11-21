import argparse
import os
import re
import sys

BLOCK = re.compile(
    r"^Name\s*=\s*(.+?)\s*\n+Include\s*=\s*([\w @]*?)\s*\n+Exclude\s*=\s*([\w @]*?)\s*\n+Edit\s*=\s*([\w @]*?)\s*(?:\n|$)",
    re.M,
)
ADMIN_LINE = re.compile(r"^(?!#)(.+?)\s+=\s+(.+)", re.M)


def quote(value):
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def keyword_array(text):
    words = text.split()
    return "[" + ", ".join(quote(word) for word in words) + "]"


def convert_ranks(source):
    with open(source, encoding="utf-8") as handle:
        text = handle.read().replace("\r\n", "\n")
    lines = []
    count = 0
    for match in BLOCK.finditer(text):
        name, include, exclude, edit = match.groups()
        lines.append("[[rank]]")
        lines.append(f"name = {quote(name)}")
        lines.append(f"include = {keyword_array(include)}")
        lines.append(f"exclude = {keyword_array(exclude)}")
        lines.append(f"edit = {keyword_array(edit)}")
        lines.append("")
        count += 1
    return "\n".join(lines), count


def convert_admins(source):
    with open(source, encoding="utf-8") as handle:
        text = handle.read().replace("\r\n", "\n")
    entries = {}
    for match in ADMIN_LINE.finditer(text):
        entries[match.group(1).strip()] = match.group(2).strip()
    lines = ["[admins]"]
    for key, rank in entries.items():
        lines.append(f"{quote(key)} = {quote(rank)}")
    return "\n".join(lines) + "\n", len(entries)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Конвертер admin_ranks.txt и admins.txt в TOML")
    parser.add_argument("--config", default="config", help="папка config")
    parser.add_argument("--force", action="store_true", help="перезаписать существующие .toml")
    arguments = parser.parse_args(argv)
    jobs = (
        ("admin_ranks.txt", "admin_ranks.toml", convert_ranks),
        ("admins.txt", "admins.toml", convert_admins),
    )
    status = 0
    for source_name, target_name, converter in jobs:
        source = os.path.join(arguments.config, source_name)
        target = os.path.join(arguments.config, target_name)
        if not os.path.exists(source):
            print(f"Нет файла {source}")
            status = 1
            continue
        if os.path.exists(target) and not arguments.force:
            print(f"{target} уже есть, пропуск (используйте --force)")
            continue
        content, count = converter(source)
        with open(target, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(content if content.endswith("\n") else content + "\n")
        print(f"{source_name} -> {target_name}: {count} записей")
    return status


if __name__ == "__main__":
    sys.exit(main())
