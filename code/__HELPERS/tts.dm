/proc/tts_speech_filter(text)
	var/static/regex/bad_chars_regex = regex(@{"[\x00-\x1F"#$%()*+/:;<=>@\[\\\]^_`{|}~]"}, "g")
	return bad_chars_regex.Replace(text, " ")

/proc/tts_gibberish_speech_filter(text)
	var/static/regex/bad_chars_regex = regex(@{"[\x00-\x1F"#$%()*+/:;<=>@\[\\\]^_`{|}~]"}, "g")
	return bad_chars_regex.Replace(text, "#")

/proc/tts_filter_encode(text, speaker, pitch, blips = FALSE)
	text = replacetext(text, "%PITCH%", SStts.pitch_enabled ? pitch : 0)
	text = replacetext(text, "%FEMALE%", !!findtext(speaker, "Woman"))
	text = replacetext(text, "%BLIPS%", blips)
	return url_encode(text)
