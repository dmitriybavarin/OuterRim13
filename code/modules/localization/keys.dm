/proc/loc_key(key, list/arguments)
	if(!length(arguments))
		return LOC_BEGIN + key + LOC_END
	var/list/pieces = list(LOC_BEGIN, key)
	for(var/name in arguments)
		var/value = arguments[name]
		if(isnull(value))
			continue
		pieces += LOC_SEPARATOR
		pieces += name
		pieces += LOC_SEPARATOR
		pieces += isatom(value) ? loc_entity(value) : "[value]"
	pieces += LOC_END
	return pieces.Join("")

/proc/loc_entity(atom/entity, shown)
	if(isnull(shown))
		shown = "[entity]"
		if(copytext(shown, 1, 5) == "The ")
			shown = "the [copytext(shown, 5)]"
	if(!length(shown) || entity.name != initial(entity.name))
		return shown
	return LOC_BEGIN + "ent" + replacetext("[loc_resolve_type(entity.type, FALSE)]", "/", "-") + LOC_SEPARATOR + "name" + LOC_SEPARATOR + shown + LOC_END

/proc/loc_desc(atom/entity)
	if(entity.desc != initial(entity.desc))
		return entity.desc
	return LOC_BEGIN + "ent" + replacetext("[loc_resolve_type(entity.type, TRUE)]", "/", "-") + ".desc" + LOC_SEPARATOR + "name" + LOC_SEPARATOR + entity.desc + LOC_END

/proc/loc_type_has_entry(type)
	var/key = "ent" + replacetext("[type]", "/", "-")
	for(var/language in GLOB.localization_language_codes)
		var/code = GLOB.localization_language_codes[language]
		if(code == LOC_CODE_ENGLISH)
			continue
		if(load_localization(code)["keys"][key])
			return TRUE
	return FALSE

/proc/loc_resolve_type(type, for_desc = FALSE)
	var/static/list/name_cache = list()
	var/static/list/desc_cache = list()
	var/list/cache = for_desc ? desc_cache : name_cache
	var/cached = cache[type]
	if(cached)
		return cached
	var/result = type
	if(!loc_type_has_entry(type))
		var/atom/own = type
		var/own_value = for_desc ? initial(own.desc) : initial(own.name)
		var/atom/cursor = type
		var/parent = initial(cursor.parent_type)
		while(parent && ispath(parent, /atom))
			if(loc_type_has_entry(parent))
				var/atom/ancestor = parent
				var/ancestor_value = for_desc ? initial(ancestor.desc) : initial(ancestor.name)
				if(ancestor_value == own_value)
					result = parent
				break
			cursor = parent
			parent = initial(cursor.parent_type)
	cache[type] = result
	return result

/proc/loc_english(text)
	if(!istext(text) || !findtext(text, LOC_BEGIN))
		return text
	return loc_expand(text, LOC_CODE_ENGLISH)

/proc/loc_zone(zone)
	var/key = "bodypart-zone-[replacetext(lowertext(zone), " ", "-")]"
	if(!loc_has_key(key))
		return zone
	return loc_key(key)

/proc/loc_has_key(key)
	var/list/keys = load_localization(LOC_CODE_ENGLISH)["keys"]
	return !isnull(keys[key])

/proc/loc_find_end(text, begin)
	var/depth = 1
	var/position = begin + 1
	while(depth)
		var/next_end = findtext(text, LOC_END, position)
		if(!next_end)
			return 0
		var/next_begin = findtext(text, LOC_BEGIN, position)
		if(next_begin && next_begin < next_end)
			depth++
			position = next_begin + 1
			continue
		depth--
		position = next_end + 1
		if(!depth)
			return next_end
	return 0

/proc/loc_split_fields(body)
	var/list/fields = list()
	var/position = 1
	while(TRUE)
		var/scan = position
		var/separator = 0
		while(TRUE)
			separator = findtext(body, LOC_SEPARATOR, scan)
			var/nested = findtext(body, LOC_BEGIN, scan)
			if(nested && (!separator || nested < separator))
				var/nested_end = loc_find_end(body, nested)
				if(!nested_end)
					separator = 0
					break
				scan = nested_end + 1
				continue
			break
		if(!separator)
			fields += copytext(body, position)
			break
		fields += copytext(body, position, separator)
		position = separator + 1
	return fields

/proc/loc_expand(text, code)
	var/begin = findtext(text, LOC_BEGIN)
	if(!begin)
		return text
	var/list/result = list()
	var/position = 1
	while(begin)
		var/end = loc_find_end(text, begin)
		if(!end)
			break
		if(begin > position)
			result += copytext(text, position, begin)
		var/list/rendered = loc_render_span(copytext(text, begin + 1, end), code, TRUE)
		result += rendered["text"]
		position = end + 1
		begin = findtext(text, LOC_BEGIN, position)
	if(position <= length(text))
		result += copytext(text, position)
	return result.Join("")

/proc/loc_render_span(body, code, first = FALSE)
	var/list/fields = loc_split_fields(body)
	var/key = fields[1]
	var/list/arguments = list()
	for(var/index in 2 to length(fields) - 1 step 2)
		arguments[fields[index]] = loc_make_argument(fields[index + 1], code)
	var/attribute = null
	var/dot = findtext(key, ".")
	if(dot)
		attribute = copytext(key, dot + 1)
		key = copytext(key, 1, dot)
	var/list/entry = loc_find_entry(key, code)
	var/is_entity = copytext(key, 1, 4) == "ent"
	if(!entry)
		var/fallback_text = loc_fallback_text(arguments, key)
		if(is_entity && code != LOC_CODE_ENGLISH)
			fallback_text = loc_strip_article(fallback_text)
		return list("text" = fallback_text, "forms" = list(), "entity" = is_entity)
	if(attribute)
		return list("text" = entry["attributes"][attribute] || loc_fallback_text(arguments, key), "forms" = list(), "entity" = FALSE)
	var/result = loc_render_parts(entry["parts"], arguments, code, first)
	var/list/name = arguments["name"]
	if(name && copytext(key, 1, 4) == "ent")
		var/initial_letter = copytext(name["text"], 1, 2)
		if(length(initial_letter) && initial_letter != lowertext(initial_letter))
			result = localization_capitalize(result)
	return list("text" = result, "forms" = entry["attributes"], "entity" = is_entity)

/proc/loc_strip_article(text)
	if(!istext(text))
		return text
	for(var/article in list("a pair of ", "pair of ", "an ", "a ", "the ", "some "))
		if(lowertext(copytext(text, 1, length(article) + 1)) == article)
			return copytext(text, length(article) + 1)
	return text

/proc/loc_fallback_text(list/arguments, key)
	var/list/name = arguments["name"]
	return name ? name["text"] : key

/proc/loc_find_entry(key, code)
	var/list/keys = load_localization(code)["keys"]
	var/list/entry = keys[key]
	if(!entry && code != LOC_CODE_ENGLISH)
		var/list/english_keys = load_localization(LOC_CODE_ENGLISH)["keys"]
		entry = english_keys[key]
	return entry

/proc/loc_make_argument(value, code)
	if(copytext(value, 1, 2) == LOC_BEGIN && loc_find_end(value, 1) == length(value))
		var/list/rendered = loc_render_span(copytext(value, 2, -1), code)
		return list("text" = rendered["text"], "forms" = rendered["forms"], "plain" = FALSE, "entity" = rendered["entity"])
	if(findtext(value, LOC_BEGIN))
		return list("text" = loc_expand(value, code), "forms" = list(), "plain" = FALSE)
	return list("text" = value, "forms" = list(), "plain" = TRUE)

/proc/loc_argument_text(list/argument, case, code, sentence_start)
	if(!argument)
		return ""
	var/text = argument["text"]
	if(!argument["plain"])
		var/list/forms = argument["forms"]
		var/result = (case && forms[case]) || text
		return (sentence_start && argument["entity"]) ? localization_capitalize(result) : result
	return text

/proc/loc_render_parts(list/parts, list/arguments, code, first)
	var/list/result = list()
	for(var/index in 1 to length(parts))
		var/part = parts[index]
		if(istext(part))
			result += part
			continue
		var/list/node = part
		var/at_start = first && index == 1
		switch(node[1])
			if("var")
				result += loc_argument_text(arguments[node[2]], node[3], code, at_start)
			if("select")
				result += loc_render_select(node, arguments, code, at_start)
	return result.Join("")

/proc/loc_render_select(list/node, list/arguments, code, first)
	var/list/argument = arguments[node[2]]
	var/selector = argument ? lowertext("[argument["text"]]") : ""
	var/list/variants = node[3]
	var/list/chosen = variants[selector]
	if(!chosen && isnum(text2num(selector)))
		chosen = variants[loc_plural_category(code, text2num(selector))]
	if(!chosen)
		chosen = variants[node[4]]
	if(!chosen)
		return ""
	return loc_render_parts(chosen, arguments, code, first)

/proc/loc_plural_category(code, number)
	var/whole = round(number) == number
	if(code == "ru")
		if(!whole)
			return "other"
		var/last = number % 10
		var/last_two = number % 100
		if(last == 1 && last_two != 11)
			return "one"
		if(last >= 2 && last <= 4 && (last_two < 12 || last_two > 14))
			return "few"
		return "many"
	return number == 1 ? "one" : "other"

/proc/loc_load_keys(code, list/dictionary)
	var/list/keys = list()
	dictionary["keys"] = keys
	var/root = "[LOCALIZATION_DIR][code]/"
	for(var/path in localization_collect_files(root))
		if(copytext(path, length(root) + 1, length(root) + 6) == "tgui/")
			continue
		loc_parse_key_file(path, keys)

/proc/loc_parse_key_file(path, list/keys)
	var/identifier = null
	var/list/lines = list()
	var/list/attributes = list()
	for(var/line in splittext(file2text(path), "\n"))
		if(copytext(line, -1) == ascii2text(13))
			line = copytext(line, 1, -1)
		if(!length(trimtext(line)))
			continue
		var/first = copytext(line, 1, 2)
		if(first == "#")
			continue
		if(first == " " || first == "\t")
			if(isnull(identifier))
				continue
			var/trimmed = trimtext(line)
			if(copytext(trimmed, 1, 2) == ".")
				var/equals = findtext(trimmed, " = ")
				if(equals)
					attributes[copytext(trimmed, 2, equals)] = loc_parse_attribute(copytext(trimmed, equals + 3))
					continue
			lines += trimmed
			continue
		var/separator = findtext(line, " = ")
		if(!separator)
			continue
		loc_store_key(identifier, lines, attributes, keys)
		identifier = copytext(line, 1, separator)
		lines = list()
		attributes = list()
		var/value = copytext(line, separator + 3)
		if(length(value))
			lines += value
	loc_store_key(identifier, lines, attributes, keys)

/proc/loc_store_key(identifier, list/lines, list/attributes, list/keys)
	if(isnull(identifier) || !length(lines))
		return
	keys[identifier] = list("parts" = loc_parse_pattern(lines.Join("\n")), "attributes" = attributes)

/proc/loc_parse_attribute(value)
	return loc_render_parts(loc_parse_pattern(value), list(), LOC_CODE_ENGLISH, FALSE)

/proc/loc_find_close(text, open)
	var/depth = 0
	var/quoted = FALSE
	for(var/position in open to length(text))
		var/character = copytext(text, position, position + 1)
		if(quoted)
			if(character == "\"")
				quoted = FALSE
			continue
		if(character == "\"")
			quoted = TRUE
		else if(character == "{")
			depth++
		else if(character == "}")
			depth--
			if(!depth)
				return position
	return 0

/proc/loc_parse_pattern(text)
	var/list/parts = list()
	var/position = 1
	var/text_length = length(text)
	while(position <= text_length)
		var/open = findtext(text, "{", position)
		if(!open)
			parts += copytext(text, position)
			break
		if(open > position)
			parts += copytext(text, position, open)
		var/close = loc_find_close(text, open)
		if(!close)
			parts += copytext(text, open)
			break
		var/expression = loc_parse_expression(trimtext(copytext(text, open + 1, close)))
		if(istext(expression))
			parts += expression
		else if(expression)
			parts += list(expression)
		position = close + 1
	return parts

/proc/loc_parse_expression(expression)
	if(copytext(expression, 1, 2) == "\"" && copytext(expression, -1) == "\"")
		return copytext(expression, 2, -1)
	var/arrow = findtext(expression, "->")
	if(arrow)
		return loc_parse_select(trimtext(copytext(expression, 1, arrow)), copytext(expression, arrow + 2))
	if(copytext(expression, 1, 2) == "$")
		return list("var", copytext(expression, 2), null)
	var/paren = findtext(expression, "($")
	if(paren && copytext(expression, -1) == ")")
		return list("var", copytext(expression, paren + 2, -1), lowertext(copytext(expression, 1, paren)))
	return null

/proc/loc_parse_select(selector, variants_text)
	var/list/variants = list()
	var/default_key = null
	for(var/line in splittext(variants_text, "\n"))
		var/trimmed = trimtext(line)
		var/is_default = FALSE
		if(copytext(trimmed, 1, 2) == "*")
			is_default = TRUE
			trimmed = copytext(trimmed, 2)
		if(copytext(trimmed, 1, 2) != "\[")
			continue
		var/bracket_end = findtext(trimmed, "]")
		if(!bracket_end)
			continue
		var/variant_key = lowertext(copytext(trimmed, 2, bracket_end))
		variants[variant_key] = loc_parse_pattern(trimtext(copytext(trimmed, bracket_end + 1)))
		if(is_default)
			default_key = variant_key
	return list("select", copytext(selector, 2), variants, default_key)

/proc/loc_duration(time_value, round_seconds_to = 0.1)
	var/second = FLOOR(time_value * 0.1, round_seconds_to)
	if(!second)
		return LOC_KEY("duration-now")
	if(second < 60)
		return loc_key("duration-second", list(count = second))
	var/list/parts = list()
	var/minute = FLOOR(second / 60, 1)
	second = FLOOR(MODULUS(second, 60), round_seconds_to)
	if(minute < 60)
		parts += loc_key("duration-minute", list(count = minute))
	else
		var/hour = FLOOR(minute / 60, 1)
		minute = MODULUS(minute, 60)
		if(hour < 24)
			parts += loc_key("duration-hour", list(count = hour))
		else
			var/day = FLOOR(hour / 24, 1)
			hour = MODULUS(hour, 24)
			parts += loc_key("duration-day", list(count = day))
			if(hour)
				parts += loc_key("duration-hour", list(count = hour))
		if(minute)
			parts += loc_key("duration-minute", list(count = minute))
	if(second)
		parts += loc_key("duration-second", list(count = second))
	var/result = parts[length(parts)]
	for(var/index in length(parts) - 1 to 1 step -1)
		result = loc_key("duration-join", list(head = parts[index], tail = result))
	return result

/proc/loc_list(list/items)
	var/count = length(items)
	if(!count)
		return ""
	var/result = items[count]
	if(count == 1)
		return result
	result = loc_key("list-join-and", list(head = items[count - 1], tail = result))
	for(var/index in count - 2 to 1 step -1)
		result = loc_key("list-join-comma", list(head = items[index], tail = result))
	return result

/proc/loc_add_type_text(list/target, type)
	var/name_key = "ent" + replacetext("[loc_resolve_type(type, FALSE)]", "/", "-")
	var/desc_key = "ent" + replacetext("[loc_resolve_type(type, TRUE)]", "/", "-")
	for(var/language in GLOB.localization_language_codes)
		var/code = GLOB.localization_language_codes[language]
		if(code == LOC_CODE_ENGLISH)
			continue
		var/list/keys = load_localization(code)["keys"]
		var/list/entry = keys[name_key]
		if(entry)
			target["name_[code]"] = loc_render_parts(entry["parts"], list(), code, FALSE)
		var/list/desc_entry = keys[desc_key]
		var/description = desc_entry?["attributes"]["desc"]
		if(description)
			target["description_[code]"] = description

/proc/loc_material_name(datum/material/material)
	var/static/regex/non_alphanumeric = regex(@"[^a-z0-9]+", "g")
	var/static/regex/edge_dashes = regex(@"^-+|-+$", "g")
	var/slug = edge_dashes.Replace(non_alphanumeric.Replace(lowertext(material.name), "-"), "")
	var/key = "material-[slug]-name"
	if(!length(slug) || !loc_has_key(key))
		return material.name
	return LOC_KEY(key)

/proc/loc_lookup(prefix, text, fallback)
	if(isnull(fallback))
		fallback = text
	if(!istext(text) || !length(text))
		return fallback
	var/static/regex/non_alphanumeric = regex(@"[^a-z0-9]+", "g")
	var/static/regex/edge_underscores = regex(@"^_+|_+$", "g")
	var/slug = edge_underscores.Replace(non_alphanumeric.Replace(lowertext(text), "_"), "")
	var/key = "[prefix]-[slug]"
	if(!loc_has_key(key))
		return fallback
	return LOC_KEY(key)
