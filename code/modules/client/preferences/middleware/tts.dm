/// Middleware to handle quirks
/datum/preference_middleware/tts
	/// Cooldown on requesting a TTS preview.
	COOLDOWN_DECLARE(tts_test_cooldown)

	action_delegations = list(
		"play_voice" = PROC_REF(play_voice),
		"play_voice_robot" = PROC_REF(play_voice_robot),
		"play_blips" = PROC_REF(play_blips),
	)

/datum/preference_middleware/tts/proc/preview_text(speaker, message)
	var/russian_voice = findtext(speaker, "RU-") == 1 || findtext(speaker, "UA-") == 1 || text2ascii(speaker, 1) > 127
	return loc_expand(message, russian_voice ? "ru" : LOC_CODE_ENGLISH)

/datum/preference_middleware/tts/proc/play_voice(list/params, mob/user)
	if(!COOLDOWN_FINISHED(src, tts_test_cooldown))
		return TRUE
	var/speaker = preferences.read_preference(/datum/preference/choiced/voice)
	var/pitch = preferences.read_preference(/datum/preference/numeric/tts_voice_pitch)
	var/blip_base = preferences.read_preference(/datum/preference/choiced/gender) == FEMALE ? "female" : "male"
	var/blip_number = preferences.read_preference(/datum/preference/numeric/tts_blip_number)
	COOLDOWN_START(src, tts_test_cooldown, 0.5 SECONDS)
	INVOKE_ASYNC(SStts, TYPE_PROC_REF(/datum/controller/subsystem/tts, queue_tts_message), user.client, preview_text(speaker, LOC_KEY("tts-preview-voice")), speaker = speaker, pitch = pitch, local = TRUE, blip_base = blip_base, blip_number = blip_number)
	return TRUE

/datum/preference_middleware/tts/proc/play_voice_robot(list/params, mob/user)
	if(!COOLDOWN_FINISHED(src, tts_test_cooldown))
		return TRUE
	var/speaker = preferences.read_preference(/datum/preference/choiced/voice)
	var/pitch = preferences.read_preference(/datum/preference/numeric/tts_voice_pitch)
	var/blip_base = preferences.read_preference(/datum/preference/choiced/gender) == FEMALE ? "female" : "male"
	var/blip_number = preferences.read_preference(/datum/preference/numeric/tts_blip_number)
	COOLDOWN_START(src, tts_test_cooldown, 0.5 SECONDS)
	INVOKE_ASYNC(SStts, TYPE_PROC_REF(/datum/controller/subsystem/tts, queue_tts_message), user.client, preview_text(speaker, LOC_KEY("tts-preview-robot")), speaker = speaker, pitch = pitch, special_filters = TTS_FILTER_SILICON, local = TRUE, blip_base = blip_base, blip_number = blip_number)
	return TRUE

/datum/preference_middleware/tts/proc/play_blips(list/params, mob/user)
	if(!COOLDOWN_FINISHED(src, tts_test_cooldown))
		return TRUE
	var/speaker = preferences.read_preference(/datum/preference/choiced/voice)
	var/pitch = preferences.read_preference(/datum/preference/numeric/tts_voice_pitch)
	var/blip_base = preferences.read_preference(/datum/preference/choiced/gender) == FEMALE ? "female" : "male"
	var/blip_number = preferences.read_preference(/datum/preference/numeric/tts_blip_number)
	COOLDOWN_START(src, tts_test_cooldown, 0.5 SECONDS)
	INVOKE_ASYNC(SStts, TYPE_PROC_REF(/datum/controller/subsystem/tts, queue_tts_message), user.client, preview_text(speaker, LOC_KEY("tts-preview-blips")), speaker = speaker, pitch = pitch, local = TRUE, force_blips = TRUE, blip_base = blip_base, blip_number = blip_number)
	return TRUE
