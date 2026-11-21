import re

import pymorphy3

CASES = {"gen": "gent", "dat": "datv", "acc": "accs", "ins": "ablt", "pre": "loct"}
ANALYZER = pymorphy3.MorphAnalyzer()
CYRILLIC = re.compile(r"[а-яА-ЯёЁ]")


def restore_case(original, word):
    if original.isupper() and len(original) > 1:
        return word.upper()
    if original[:1].isupper():
        return word[:1].upper() + word[1:]
    return word


def parse_noun(word):
    best = None
    for parse in ANALYZER.parse(word):
        if "NOUN" in parse.tag and (parse.tag.case in ("nomn", "accs") or parse.tag.case is None):
            if best is None or parse.score > best.score:
                best = parse
    return best


def inflect_word(word, grammemes):
    parse = ANALYZER.parse(word)[0]
    form = parse.inflect(grammemes)
    return restore_case(word, form.word) if form else word


def inflect_phrase(phrase, case):
    target = CASES[case]
    tokens = phrase.split(" ")
    head_index = None
    head = None
    for index, token in enumerate(tokens):
        if not CYRILLIC.search(token):
            continue
        core = token.split("-")[-1] if "-" in token else token
        parse = parse_noun(core.lower())
        if parse is None:
            continue
        adjective_capable = any(("ADJF" in p.tag or "PRTF" in p.tag) for p in ANALYZER.parse(core.lower()))
        if adjective_capable and index + 1 < len(tokens):
            following = tokens[index + 1]
            following_core = following.split("-")[-1] if "-" in following else following
            if CYRILLIC.search(following) and parse_noun(following_core.lower()) is not None:
                continue
        head_index, head = index, parse
        break
    if head is None:
        return phrase
    number = "plur" if "plur" in head.tag else "sing"
    animacy = "anim" if "anim" in head.tag else "inan"
    gender = head.tag.gender
    result = list(tokens)
    for index in range(head_index):
        token = tokens[index]
        parse = ANALYZER.parse(token.lower())[0]
        if "ADJF" in parse.tag or "PRTF" in parse.tag:
            grammemes = {target, number}
            if number == "sing" and gender:
                grammemes.add(gender)
            if target == "accs" and (number == "plur" or gender == "masc"):
                grammemes.add(animacy)
            form = parse.inflect(grammemes)
            if form:
                result[index] = restore_case(token, form.word)
    token = tokens[head_index]
    if "-" in token:
        prefix, _, core = token.rpartition("-")
        prefix += "-"
    else:
        prefix, core = "", token
    grammemes = {target, number}
    if target == "accs" and animacy == "inan" and (number == "plur" or gender in ("masc", "neut")):
        result[head_index] = token
    else:
        form = ANALYZER.parse(core.lower())
        chosen = next((p for p in form if "NOUN" in p.tag), form[0])
        inflected = chosen.inflect(grammemes)
        if inflected:
            result[head_index] = prefix + restore_case(core, inflected.word)
    return " ".join(result)


def forms(phrase):
    result = {}
    for key in CASES:
        value = inflect_phrase(phrase, key)
        if value != phrase:
            result[key] = value
    return result


if __name__ == "__main__":
    for sample in ["пожарный шлюз", "ящик для инструментов", "комната отдыха торгового аванпоста", "красная пластина",
                   "МОД-шлем", "гаечный ключ", "аварийный ящик для инструментов", "кот", "перчатки", "левая нога",
                   "Охранный офицер", "апокрифический блок управления МОД"]:
        print(sample, forms(sample))
