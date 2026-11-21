import argparse
import os
import sys
import traceback

from PIL import Image
from PIL.PngImagePlugin import PngInfo

DMI_HEADER = "# BEGIN DMI"
DMI_FOOTER = "# END DMI"
DEFAULT_TILE = (32, 32)
TEXT_SUFFIX = ".dmi.txt"


def read_description(image):
    description = image.info.get("Description")
    if description is None or DMI_HEADER not in description:
        raise ValueError("В файле нет метаданных DMI")
    return description


def parse_description(description):
    width = DEFAULT_TILE[0]
    height = DEFAULT_TILE[1]
    states = []
    current = None
    for raw in description.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip()
        if key == "width":
            width = int(value)
        elif key == "height":
            height = int(value)
        elif key == "state":
            current = {"name": value.strip('"'), "dirs": 1, "frames": 1}
            states.append(current)
        elif current is not None and key == "dirs":
            current["dirs"] = int(value)
        elif current is not None and key == "frames":
            current["frames"] = int(value)
    return width, height, states


def build_description(width, height, states):
    lines = [DMI_HEADER, "version = 4.0", f"\twidth = {width}", f"\theight = {height}"]
    for name in states:
        lines.append(f'state = "{name}"')
        lines.append("\tdirs = 1")
        lines.append("\tframes = 1")
    lines.append(DMI_FOOTER)
    return "\n".join(lines) + "\n"


def tile_count(states):
    return sum(state["dirs"] * state["frames"] for state in states)


def dmi_to_png(source, output_directory=None):
    base = os.path.splitext(os.path.basename(source))[0]
    directory = output_directory or os.path.dirname(os.path.abspath(source))
    os.makedirs(directory, exist_ok=True)
    with Image.open(source) as image:
        description = read_description(image)
        sheet = image.convert("RGBA")
    png_path = os.path.join(directory, base + ".png")
    text_path = os.path.join(directory, base + TEXT_SUFFIX)
    sheet.save(png_path, format="PNG")
    with open(text_path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(description if description.endswith("\n") else description + "\n")
    width, height, states = parse_description(description)
    return png_path, text_path, f"{len(states)} состояний, {width}x{height}, листов {sheet.width}x{sheet.height}"


def split_tile_size(text):
    parts = text.lower().replace("х", "x").split("x")
    if len(parts) != 2:
        raise ValueError("Размер тайла должен быть вида 32x32")
    return int(parts[0]), int(parts[1])


def png_to_dmi(source, output_directory=None, tile_size=None):
    base = os.path.splitext(os.path.basename(source))[0]
    directory = output_directory or os.path.dirname(os.path.abspath(source))
    os.makedirs(directory, exist_ok=True)
    text_path = os.path.splitext(os.path.abspath(source))[0] + TEXT_SUFFIX
    with Image.open(source) as image:
        sheet = image.convert("RGBA")
    if os.path.exists(text_path):
        with open(text_path, encoding="utf-8") as handle:
            description = handle.read()
        width, height, states = parse_description(description)
        note = "метаданные взяты из " + os.path.basename(text_path)
    else:
        width, height = tile_size or DEFAULT_TILE
        columns = max(sheet.width // width, 1)
        rows = max(sheet.height // height, 1)
        names = [base if columns * rows == 1 else f"{base}_{index}" for index in range(columns * rows)]
        description = build_description(width, height, names)
        width, height, states = parse_description(description)
        note = f"метаданных нет, нарезка {width}x{height}, одно состояние на тайл"
    columns = max(sheet.width // width, 1)
    rows = max(sheet.height // height, 1)
    if tile_count(states) > columns * rows:
        raise ValueError(
            f"В метаданных {tile_count(states)} тайлов, а в картинке помещается только {columns * rows}"
        )
    info = PngInfo()
    info.add_text("Description", description, zip=True)
    dmi_path = os.path.join(directory, base + ".dmi")
    sheet.save(dmi_path, format="PNG", pnginfo=info)
    return dmi_path, f"{len(states)} состояний, {note}"


def convert(path, output_directory=None, tile_size=None):
    suffix = os.path.splitext(path)[1].lower()
    if suffix == ".dmi":
        png_path, text_path, note = dmi_to_png(path, output_directory)
        return f"{os.path.basename(path)} -> {os.path.basename(png_path)} и {os.path.basename(text_path)} ({note})"
    if suffix == ".png":
        dmi_path, note = png_to_dmi(path, output_directory, tile_size)
        return f"{os.path.basename(path)} -> {os.path.basename(dmi_path)} ({note})"
    raise ValueError(f"Неподдерживаемый тип файла: {suffix}")


def run_cli(paths, output_directory, tile_size):
    status = 0
    for path in paths:
        try:
            print(convert(path, output_directory, tile_size))
        except Exception as error:
            status = 1
            print(f"Ошибка {path}: {error}")
    return status


def run_gui(initial_paths):
    import tkinter as tk
    from tkinter import filedialog, scrolledtext

    try:
        from tkinterdnd2 import DND_FILES, TkinterDnD

        root = TkinterDnD.Tk()
        drag_enabled = True
    except Exception:
        root = tk.Tk()
        drag_enabled = False

    root.title("DMI <-> PNG")
    root.geometry("640x420")

    size_variable = tk.StringVar(value="32x32")
    output_variable = tk.StringVar(value="")

    top = tk.Frame(root)
    top.pack(fill="x", padx=8, pady=6)
    tk.Label(top, text="Размер тайла для PNG без метаданных:").pack(side="left")
    tk.Entry(top, textvariable=size_variable, width=9).pack(side="left", padx=4)
    tk.Label(top, text="Папка вывода (пусто = рядом с файлом):").pack(side="left", padx=(12, 0))
    tk.Entry(top, textvariable=output_variable, width=24).pack(side="left", padx=4)

    hint = "Перетащите сюда файлы .dmi или .png" if drag_enabled else "Нажмите «Открыть» (для перетаскивания в окно: pip install tkinterdnd2)"
    zone = tk.Label(root, text=hint, relief="groove", height=5, bg="#eef3fb")
    zone.pack(fill="x", padx=8, pady=4)

    log = scrolledtext.ScrolledText(root, height=12)
    log.pack(fill="both", expand=True, padx=8, pady=6)

    def write(message):
        log.insert("end", message + "\n")
        log.see("end")

    def process(paths):
        try:
            tile = split_tile_size(size_variable.get())
        except Exception as error:
            write(f"Ошибка размера тайла: {error}")
            return
        output = output_variable.get().strip() or None
        for path in paths:
            try:
                write(convert(path, output, tile))
            except Exception:
                write(f"Ошибка {path}: {traceback.format_exc(limit=1).strip().splitlines()[-1]}")

    def choose():
        paths = filedialog.askopenfilenames(filetypes=[("DMI и PNG", "*.dmi *.png"), ("Все файлы", "*.*")])
        process(list(paths))

    tk.Button(root, text="Открыть...", command=choose).pack(pady=(0, 6))

    if drag_enabled:
        def on_drop(event):
            process(list(root.tk.splitlist(event.data)))

        zone.drop_target_register(DND_FILES)
        zone.dnd_bind("<<Drop>>", on_drop)
        root.drop_target_register(DND_FILES)
        root.dnd_bind("<<Drop>>", on_drop)

    if initial_paths:
        root.after(100, lambda: process(initial_paths))
    root.mainloop()
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(description="Конвертер DMI <-> PNG")
    parser.add_argument("files", nargs="*", help="файлы .dmi или .png (можно перетащить на этот скрипт)")
    parser.add_argument("-o", "--output", help="папка вывода")
    parser.add_argument("-s", "--size", default="32x32", help="размер тайла для PNG без метаданных, например 32x32")
    parser.add_argument("--gui", action="store_true", help="открыть окно")
    arguments = parser.parse_args(argv)
    tile_size = split_tile_size(arguments.size)
    if arguments.gui or not arguments.files:
        return run_gui(arguments.files)
    return run_cli(arguments.files, arguments.output, tile_size)


if __name__ == "__main__":
    sys.exit(main())
