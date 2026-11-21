#define CINEMATIC_PATH_PREFIX "/datum/cinematic/"
#define CINEMATIC_PREVIEW_ICON 'icons/effects/station_explosion.dmi'

ADMIN_VERB(cinematic, R_FUN, "Cinematic", "Show a cinematic to all players.", ADMIN_CATEGORY_FUN)
	var/datum/cinematic_panel/panel = new
	panel.ui_interact(user.mob)

/datum/cinematic_panel
	var/list/entries
	var/list/types_by_id

/datum/cinematic_panel/New()
	. = ..()
	entries = list()
	types_by_id = list()
	var/list/states = icon_states(CINEMATIC_PREVIEW_ICON)
	for(var/datum/cinematic/entry_type as anything in sort_list(subtypesof(/datum/cinematic), GLOBAL_PROC_REF(cmp_typepaths_asc)))
		var/id = cinematic_id(entry_type)
		var/preview_state = cinematic_preview_state(entry_type)
		if(!(preview_state in states))
			preview_state = "station_intact"
		types_by_id[id] = entry_type
		entries += list(list(
			"id" = id,
			"category" = cinematic_category(entry_type),
			"preview" = icon2base64(icon(CINEMATIC_PREVIEW_ICON, preview_state, SOUTH, 1)),
		))

/datum/cinematic_panel/proc/cinematic_id(datum/cinematic/cinematic_type)
	return replacetext(copytext("[cinematic_type]", length(CINEMATIC_PATH_PREFIX) + 1), "/", "_")

/datum/cinematic_panel/proc/cinematic_category(datum/cinematic/cinematic_type)
	if(ispath(cinematic_type, /datum/cinematic/cult_arm) || ispath(cinematic_type, /datum/cinematic/cult_fail) || ispath(cinematic_type, /datum/cinematic/nuke/cult))
		return "cult"
	if(ispath(cinematic_type, /datum/cinematic/malf))
		return "ai"
	if(ispath(cinematic_type, /datum/cinematic/nuke/fake) || ispath(cinematic_type, /datum/cinematic/nuke/clown) || ispath(cinematic_type, /datum/cinematic/nuke/no_core))
		return "fake"
	if(ispath(cinematic_type, /datum/cinematic/nuke))
		return "nuke"
	return "other"

/datum/cinematic_panel/proc/cinematic_preview_state(datum/cinematic/cinematic_type)
	if(ispath(cinematic_type, /datum/cinematic/malf))
		return "summary_malf"
	if(ispath(cinematic_type, /datum/cinematic/cult_arm))
		return "station_corrupted"
	if(ispath(cinematic_type, /datum/cinematic/nuke))
		var/datum/cinematic/nuke/nuke_type = cinematic_type
		return initial(nuke_type.after_nuke_summary_state) || "station_intact"
	return "station_intact"

/datum/cinematic_panel/ui_state(mob/user)
	return ADMIN_STATE(R_FUN)

/datum/cinematic_panel/ui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "Cinematic")
		ui.open()

/datum/cinematic_panel/ui_static_data(mob/user)
	return list("entries" = entries)

/datum/cinematic_panel/ui_data(mob/user)
	var/list/data = list()
	var/list/players = list()
	for(var/client/player as anything in GLOB.clients)
		players += list(list(
			"ckey" = player.ckey,
			"name" = player.mob ? player.mob.real_name || player.mob.name : "",
			"living" = isliving(player.mob),
		))
	data["players"] = players
	var/list/active = list()
	for(var/datum/cinematic/playing as anything in GLOB.active_cinematics)
		active += list(list(
			"ref" = REF(playing),
			"id" = cinematic_id(playing.type),
			"global" = playing.is_global,
			"watchers" = length(playing.watching),
		))
	data["active"] = active
	return data

/datum/cinematic_panel/proc/collect_watchers(mob/user, mode, ckeys_text)
	switch(mode)
		if("all")
			return world
		if("self")
			return list(user)
		if("living")
			var/list/result = list()
			for(var/mob/living/living_mob in GLOB.player_list)
				result += living_mob
			return result
		if("observers")
			var/list/result = list()
			for(var/mob/dead/observer/ghost in GLOB.player_list)
				result += ghost
			return result
		if("admins")
			var/list/result = list()
			for(var/client/admin as anything in GLOB.admins)
				if(admin.mob)
					result += admin.mob
			return result
		if("players")
			var/list/result = list()
			for(var/ckey_entry in splittext("[ckeys_text]", ","))
				var/client/player = GLOB.directory[ckey(ckey_entry)]
				if(player?.mob)
					result += player.mob
			return result
	return null

/datum/cinematic_panel/ui_act(action, list/params, datum/tgui/ui, datum/ui_state/state)
	. = ..()
	if(.)
		return
	var/mob/user = ui.user
	switch(action)
		if("play")
			var/datum/cinematic/play_type = types_by_id[params["id"]]
			if(!play_type)
				return TRUE
			var/mode = params["mode"]
			var/watchers = collect_watchers(user, mode, params["ckeys"])
			if(isnull(watchers) || (islist(watchers) && !length(watchers)))
				to_chat(user, span_warning("No viewers selected for the cinematic."))
				return TRUE
			var/lock = !!params["lock"]
			var/target_text = mode == "players" ? "players ([params["ckeys"]])" : mode
			log_admin("[key_name(user)] played cinematic [play_type] (viewers: [target_text], lock controls: [lock]).")
			message_admins("[key_name_admin(user)] played cinematic [play_type] (viewers: [target_text], lock controls: [lock]).")
			BLACKBOX_LOG_ADMIN_VERB("Cinematic")
			INVOKE_ASYNC(GLOBAL_PROC, GLOBAL_PROC_REF(play_cinematic), play_type, watchers, null, lock)
			return TRUE
		if("stop")
			var/datum/cinematic/playing = locate(params["ref"]) in GLOB.active_cinematics
			if(!playing)
				return TRUE
			log_admin("[key_name(user)] stopped cinematic [playing.type].")
			message_admins("[key_name_admin(user)] stopped cinematic [playing.type].")
			playing.stop_cinematic()
			return TRUE
		if("stop_all")
			if(!length(GLOB.active_cinematics))
				return TRUE
			log_admin("[key_name(user)] stopped all active cinematics.")
			message_admins("[key_name_admin(user)] stopped all active cinematics.")
			for(var/datum/cinematic/playing as anything in GLOB.active_cinematics.Copy())
				playing.stop_cinematic()
			return TRUE

#undef CINEMATIC_PATH_PREFIX
#undef CINEMATIC_PREVIEW_ICON
