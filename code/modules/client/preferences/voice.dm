/// TTS voice preference
/datum/preference/choiced/voice
	savefile_identifier = PREFERENCE_CHARACTER
	savefile_key = "tts_voice"
	category = PREFERENCE_CATEGORY_NON_CONTEXTUAL
	priority = PREFERENCE_PRIORITY_BODY_TYPE
	should_update_preview = FALSE

/datum/preference/choiced/voice/init_possible_values()
	if(SStts.tts_enabled)
		return SStts.available_speakers
	for(var/voice_list_path in list("config/tts_voices.json", "data/cached_tts_voices.json"))
		if(!fexists(voice_list_path))
			continue
		var/list/cached_data = json_decode(rustg_file_read(voice_list_path))
		if(length(cached_data))
			return cached_data
	return list("invalid")

/datum/preference/choiced/voice/create_default_value()
	var/list/russian_voices = list()
	for(var/voice in get_choices())
		if(findtext(voice, "RU-") == 1 && !findtext(voice, "~"))
			russian_voices += voice
	if(length(russian_voices))
		return pick(russian_voices)
	return ..()

/datum/preference/choiced/voice/apply_to_human(mob/living/carbon/human/target, value, datum/preferences/preferences)
	if(SStts.tts_enabled && !(value in SStts.available_speakers))
		value = SStts.random_tts_voice(target.gender) // As a failsafe
	target.voice = value
	var/character_gender = preferences.read_preference(/datum/preference/choiced/gender)
	if(character_gender == FEMALE)
		target.blip_base = "female"
	else if(character_gender == MALE)
		target.blip_base = "male"
	else
		target.blip_base = findtext(value, "Irina") || findtext(value, "Amy") || findtext(value, "Lada") ? "female" : "male"

/datum/preference/numeric/tts_voice_pitch
	savefile_identifier = PREFERENCE_CHARACTER
	savefile_key = "tts_voice_pitch"
	category = PREFERENCE_CATEGORY_NON_CONTEXTUAL
	minimum = -12
	maximum = 12
	should_update_preview = FALSE

/datum/preference/numeric/tts_voice_pitch/is_accessible(datum/preferences/preferences)
	if(!SStts.tts_enabled || !SStts.pitch_enabled)
		return FALSE
	return ..()

/datum/preference/numeric/tts_voice_pitch/create_default_value()
	return 0

/datum/preference/numeric/tts_voice_pitch/apply_to_human(mob/living/carbon/human/target, value, datum/preferences/preferences)
	if(SStts.tts_enabled && SStts.pitch_enabled)
		target.pitch = value

/datum/preference/choiced/tts_blip_base
	savefile_identifier = PREFERENCE_CHARACTER
	savefile_key = "tts_blip_base"
	category = PREFERENCE_CATEGORY_NON_CONTEXTUAL
	should_update_preview = FALSE

/datum/preference/choiced/tts_blip_base/init_possible_values()
	return list(TTS_BLIPS_MASCULINE, TTS_BLIPS_FEMININE)

/datum/preference/choiced/tts_blip_base/is_accessible(datum/preferences/preferences)
	return FALSE

/datum/preference/choiced/tts_blip_base/apply_to_human(mob/living/carbon/human/target, value, datum/preferences/preferences)
	return

/datum/preference/choiced/tts_blip_base/create_default_value()
	return pick(list("Masculine", "Feminine"))

/datum/preference/numeric/tts_blip_number
	savefile_identifier = PREFERENCE_CHARACTER
	savefile_key = "tts_blip_number"
	category = PREFERENCE_CATEGORY_NON_CONTEXTUAL
	minimum = 1
	maximum = 4
	should_update_preview = FALSE

/datum/preference/numeric/tts_blip_number/is_accessible(datum/preferences/preferences)
	if(!SStts.tts_enabled || !SStts.pitch_enabled)
		return FALSE
	return ..()

/datum/preference/numeric/tts_blip_number/create_default_value()
	return rand(1, 4)

/datum/preference/numeric/tts_blip_number/apply_to_human(mob/living/carbon/human/target, value, datum/preferences/preferences)
	if(SStts.tts_enabled)
		target.blip_number = value
