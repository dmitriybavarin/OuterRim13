/// Middleware to handle quirks
/datum/preference_middleware/quirks
	/// Used to track whether or not we need to update changes in ui_data
	var/tainted = TRUE
	/// Remember what the last species we chose was, to avoid having to validate quirks again
	var/previous_species_value
	/// The current selected quirks, saved so we can cheaply resend them in ui_data only when necessary, without having to use expensive update_static_data() calls
	var/list/cached_selected_quirks
	/// The current species compatibility, saved so we can cheaply resend them in ui_data only when necessary, without having to use expensive update_static_data() calls
	var/list/cached_species_compatibility

	action_delegations = list(
		"give_quirk" = PROC_REF(give_quirk),
		"remove_quirk" = PROC_REF(remove_quirk),
		"set_stat" = PROC_REF(set_stat),
		"reset_stats" = PROC_REF(reset_stats),
	)
/datum/preference_middleware/quirks/pre_set_preference(mob/user, preference, value)
	if(preference != "species")
		return
	var/list/incompatible_quirks
	var/selected_species_type = GLOB.species_list[value]
	for(var/quirk_name in preferences.all_quirks)
		var/quirk_path = SSquirks.quirks[quirk_name]
		var/datum/quirk/quirk_prototype = SSquirks.quirk_prototypes[quirk_path]
		if(!quirk_prototype.is_species_appropriate(selected_species_type))
			LAZYADD(incompatible_quirks, quirk_name)
	if(!LAZYLEN(incompatible_quirks))
		return
	var/list/message = list("The following quirks are incompatible with your selected species and will be removed: [incompatible_quirks.Join(", ")].")
	if(!SSquirks.points_enabled)
		message += "Would you like to continue?"
	else
		message += "If you do not have enough points to cover the removed quirks, your quirks will be reset. Would you like to continue?"
	var/response = tgui_alert(user, message.Join(" "), "Quirks Incompatible", list("Yes", "No"))
	if(response != "Yes")
		return TRUE

/datum/preference_middleware/quirks/post_set_preference(mob/user, preference, value)
	if(preference != "species" || value == previous_species_value)
		return

	tainted = TRUE
	previous_species_value = value
	preferences.validate_quirks()

/datum/preference_middleware/quirks/proc/get_species_compatibility()
	var/list/species_blacklist = list()
	var/datum/species/mob_species = preferences.read_preference(/datum/preference/choiced/species)
	for(var/datum/quirk/quirk_type as anything in SSquirks.quirk_prototypes)
		if(!SSquirks.quirk_prototypes[quirk_type].is_species_appropriate(mob_species))
			species_blacklist += quirk_type::name
	return species_blacklist

/datum/preference_middleware/quirks/get_ui_static_data(mob/user)
	if (preferences.current_window != PREFERENCE_TAB_CHARACTER_PREFERENCES)
		return list()

	var/list/data = list()

	data["default_quirk_balance"] = SSquirks.default_quirk_points

	return data

/datum/preference_middleware/quirks/get_ui_data(mob/user)
	var/list/data = list()

	if (tainted || isnull(cached_selected_quirks)) // if one of these is null, both are null
		tainted = FALSE
		cached_selected_quirks = get_selected_quirks()
		cached_species_compatibility = get_species_compatibility()

	data["selected_quirks"] = cached_selected_quirks
	data["stats"] = preferences.read_preference(/datum/preference/stats)
	data["species_disallowed_quirks"] = cached_species_compatibility

	return data

/datum/preference_middleware/quirks/get_constant_data()
	var/list/quirk_info = list()

	var/list/quirks = SSquirks.get_quirks()

	var/max_positive_quirks = SSquirks.max_positive_quirks
	var/positive_quirks_disabled = max_positive_quirks == 0
	for (var/quirk_name in quirks)
		var/datum/quirk/quirk = quirks[quirk_name]
		if(positive_quirks_disabled && initial(quirk.value) > 0)
			continue

		var/datum/quirk_constant_data/constant_data = GLOB.all_quirk_constant_data[quirk]
		var/list/datum/preference/customization_options = constant_data?.get_customization_data()

		quirk_info[sanitize_css_class_name(quirk_name)] = list(
			"description" = initial(quirk.desc),
			"icon" = initial(quirk.icon),
			"name" = quirk_name,
			"value" = initial(quirk.value),
			"stat_requirements" = SSquirks.quirk_prototypes[quirk]?.stat_requirements || list(),
			"customizable" = constant_data?.is_customizable(),
			"customization_options" = customization_options,
		)

	return list(
		"max_positive_quirks" = max_positive_quirks,
		"quirk_info" = quirk_info,
		"quirk_blacklist" = GLOB.quirk_string_blacklist,
		"points_enabled" = SSquirks.points_enabled,
		"quirk_slots" = SSquirks.quirk_slots,
		"stat_ids" = GLOB.stat_ids,
		"stat_min" = STAT_MIN,
		"stat_max" = STAT_MAX,
		"stat_default" = STAT_DEFAULT,
		"stat_pool_total" = STAT_POOL_TOTAL,
	)

/datum/preference_middleware/quirks/on_new_character(mob/user)
	tainted = TRUE
	previous_species_value = null

/datum/preference_middleware/quirks/proc/give_quirk(list/params, mob/user)
	var/quirk_name = params["quirk"]

	preferences.validate_quirks()
	var/list/new_quirks = preferences.all_quirks | quirk_name
	if (SSquirks.filter_invalid_quirks(new_quirks, preferences.read_preference(/datum/preference/stats)) != new_quirks)
		// If the client is sending an invalid give_quirk, that means that
		// something went wrong with the client prediction, so we should
		// catch it back up to speed.
		tainted = TRUE
		preferences.update_static_data(user, always_instant = TRUE)
		return TRUE

	preferences.all_quirks = new_quirks
	tainted = TRUE
	preferences.character_preview_view?.update_body()

	return TRUE

/datum/preference_middleware/quirks/proc/remove_quirk(list/params, mob/user)
	var/quirk_name = params["quirk"]

	var/list/new_quirks = preferences.all_quirks - quirk_name
	if ( \
		!(quirk_name in preferences.all_quirks) \
		|| SSquirks.filter_invalid_quirks(new_quirks, preferences.read_preference(/datum/preference/stats)) != new_quirks \
	)
		// If the client is sending an invalid remove_quirk, that means that
		// something went wrong with the client prediction, so we should
		// catch it back up to speed.
		tainted = TRUE
		preferences.update_static_data(user, always_instant = TRUE)
		return TRUE

	preferences.all_quirks = new_quirks
	tainted = TRUE
	preferences.character_preview_view?.update_body()

	return TRUE

/datum/preference_middleware/quirks/proc/get_selected_quirks()
	var/list/selected_quirks = list()

	for (var/quirk in preferences.all_quirks)
		selected_quirks += sanitize_css_class_name(quirk)

	return selected_quirks

/datum/preference_middleware/quirks/proc/set_stat(list/params, mob/user)
	var/stat_id = params["stat"]
	if(!(stat_id in GLOB.stat_ids))
		return FALSE
	var/value = text2num(params["value"])
	if(!isnum(value))
		return FALSE
	value = clamp(round(value), STAT_MIN, STAT_MAX)

	var/list/stats = sanitize_stats(preferences.read_preference(/datum/preference/stats))
	stats[stat_id] = value
	var/total = 0
	for(var/other_id in stats)
		total += stats[other_id]
	if(total > STAT_POOL_TOTAL)
		return TRUE

	apply_stats(stats)
	return TRUE

/datum/preference_middleware/quirks/proc/reset_stats(list/params, mob/user)
	apply_stats(create_default_stats())
	return TRUE

/datum/preference_middleware/quirks/proc/apply_stats(list/stats)
	preferences.update_preference(GLOB.preference_entries[/datum/preference/stats], stats)
	preferences.validate_quirks()
	tainted = TRUE
