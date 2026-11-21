GLOBAL_LIST_INIT(stat_ids, list(
	STAT_STRENGTH,
	STAT_PERCEPTION,
	STAT_ENDURANCE,
	STAT_CHARISMA,
	STAT_INTELLIGENCE,
	STAT_AGILITY,
	STAT_LUCK,
))

/proc/create_default_stats()
	var/list/stats = list()
	for(var/stat_id in GLOB.stat_ids)
		stats[stat_id] = STAT_DEFAULT
	return stats

/proc/sanitize_stats(input)
	var/list/stats = create_default_stats()
	if(!islist(input))
		return stats
	var/total = 0
	for(var/stat_id in GLOB.stat_ids)
		var/value = input[stat_id]
		if(!isnum(value))
			value = STAT_DEFAULT
		value = clamp(round(value), STAT_MIN, STAT_MAX)
		stats[stat_id] = value
		total += value
	if(total > STAT_POOL_TOTAL)
		return create_default_stats()
	return stats

/proc/stats_meet_requirements(list/stats, list/requirements)
	for(var/stat_id in requirements)
		var/have = STAT_DEFAULT
		if(islist(stats) && isnum(stats[stat_id]))
			have = stats[stat_id]
		if(have < requirements[stat_id])
			return FALSE
	return TRUE

/mob/living
	var/list/stats

/mob/living/proc/get_stat(stat_id)
	if(islist(stats) && isnum(stats[stat_id]))
		return stats[stat_id]
	return STAT_DEFAULT

/datum/preference/stats
	savefile_key = "stats"
	savefile_identifier = PREFERENCE_CHARACTER
	can_randomize = FALSE
	randomize_by_default = FALSE
	should_update_preview = FALSE

/datum/preference/stats/apply_to_human(mob/living/carbon/human/target, value, datum/preferences/preferences)
	if(isdummy(target))
		return
	target.stats = sanitize_stats(value)

/datum/preference/stats/is_valid(value, datum/preferences/preferences)
	return islist(value)

/datum/preference/stats/deserialize(input, datum/preferences/preferences)
	return sanitize_stats(input)

/datum/preference/stats/create_default_value()
	return create_default_stats()
