GLOBAL_LIST_INIT(localization_language_codes, list(
	UI_LANGUAGE_ENGLISH = LOC_CODE_ENGLISH,
	UI_LANGUAGE_RUSSIAN = "ru",
))
GLOBAL_LIST_EMPTY(localization_dictionaries)
GLOBAL_LIST_INIT(localization_capitals, localization_build_capitals())
GLOBAL_LIST_INIT(localization_capitals_reverse, localization_reverse_capitals())

/proc/localization_reverse_capitals()
	var/list/reverse = list()
	for(var/lower in GLOB.localization_capitals)
		reverse[GLOB.localization_capitals[lower]] = lower
	return reverse

/proc/localization_build_capitals()
	var/lower = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
	var/upper = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
	var/list/capitals = list()
	for(var/i in 1 to length_char(lower))
		capitals[copytext_char(lower, i, i + 1)] = copytext_char(upper, i, i + 1)
	return capitals

/proc/localization_code_for(language)
	return GLOB.localization_language_codes[language]

/proc/load_localization(code)
	if(GLOB.localization_dictionaries[code])
		return GLOB.localization_dictionaries[code]
	var/list/dictionary = list()
	loc_load_keys(code, dictionary)
	GLOB.localization_dictionaries[code] = dictionary
	log_world("Localization: '[code]' loaded ([length(dictionary["keys"])] keys)")
	return dictionary

/proc/localization_collect_files(directory)
	var/list/files = list()
	for(var/entry in flist(directory))
		if(copytext(entry, -1) == "/")
			files += localization_collect_files("[directory][entry]")
		else if(copytext(entry, -4) == ".ftl")
			files += "[directory][entry]"
	return files

/proc/localize_for(client/target, message)
	if(!istext(message) || !findtext(message, LOC_BEGIN))
		return message
	if(!target?.prefs)
		return loc_english(message)
	return localize(message, target.prefs.read_preference(/datum/preference/choiced/interface_language))

/proc/localize(message, language)
	if(!istext(message) || !findtext(message, LOC_BEGIN))
		return message
	return loc_expand(message, localization_code_for(language) || LOC_CODE_ENGLISH)

/proc/localization_lowercase(text)
	var/first = copytext_char(text, 1, 2)
	var/second = copytext_char(text, 2, 3)
	if(second && ((second != lowertext(second)) || (second in GLOB.localization_capitals_reverse)))
		return text
	var/lower = GLOB.localization_capitals_reverse[first]
	if(lower)
		return lower + copytext_char(text, 2)
	return lowertext(first) + copytext_char(text, 2)

/proc/localization_capitalize(text)
	var/first = copytext_char(text, 1, 2)
	var/upper = GLOB.localization_capitals[first]
	if(upper)
		return upper + copytext_char(text, 2)
	return uppertext(first) + copytext_char(text, 2)
