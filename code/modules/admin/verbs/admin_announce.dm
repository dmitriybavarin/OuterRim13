#define ADMIN_ANNOUNCE_HISTORY_MAX 15
#define ADMIN_ANNOUNCE_MAX_LENGTH 2000
#define ADMIN_ANNOUNCE_KINDS list("server", "command", "captain", "syndicate", "custom")
#define ADMIN_ANNOUNCE_AUDIENCES list("all", "station")

GLOBAL_LIST_EMPTY(admin_announce_history)

ADMIN_VERB(announce, R_ADMIN, "Announce", "Announce your desires to the world.", ADMIN_CATEGORY_MAIN)
	var/datum/admin_announce_panel/panel = new
	panel.ui_interact(user.mob)
	BLACKBOX_LOG_ADMIN_VERB("Announce")

/datum/admin_announce_panel

/datum/admin_announce_panel/ui_state(mob/user)
	return ADMIN_STATE(R_ADMIN)

/datum/admin_announce_panel/ui_close(mob/user)
	qdel(src)

/datum/admin_announce_panel/ui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "AdminAnnounce")
		ui.open()

/datum/admin_announce_panel/ui_static_data(mob/user)
	var/list/data = list()
	data["sounds"] = GLOB.announcer_keys.Copy()
	data["colors"] = ANNOUNCEMENT_COLORS
	data["max_length"] = ADMIN_ANNOUNCE_MAX_LENGTH
	return data

/datum/admin_announce_panel/ui_data(mob/user)
	var/list/data = list()
	data["sender_default"] = user.client?.holder?.fakekey ? "Administrator" : user.key
	data["command_name"] = command_name()
	var/client/viewer = user.client
	data["header_command"] = localize_for(viewer, loc_key("announcement-header-update", list(sender = command_name_loc())))
	data["header_captain"] = localize_for(viewer, LOC_KEY("announcement-header-captain"))
	data["header_syndicate"] = localize_for(viewer, LOC_KEY("announcement-header-syndicate"))
	data["history"] = GLOB.admin_announce_history
	data["players_all"] = length(GLOB.player_list)
	data["players_station"] = length(station_players())
	return data

/datum/admin_announce_panel/proc/station_players()
	var/list/result = list()
	for(var/mob/player as anything in GLOB.player_list)
		var/turf/player_turf = get_turf(player)
		if(player_turf && is_station_level(player_turf.z))
			result += player
	return result

/datum/admin_announce_panel/ui_act(action, list/params, datum/tgui/ui, datum/ui_state/state)
	. = ..()
	if(.)
		return
	var/mob/user = ui.user
	switch(action)
		if("send")
			send(user, params)
			return TRUE

/datum/admin_announce_panel/proc/send(mob/user, list/params)
	var/kind = params["kind"]
	var/audience = params["audience"]
	if(!(kind in ADMIN_ANNOUNCE_KINDS) || !(audience in ADMIN_ANNOUNCE_AUDIENCES))
		return
	var/message = trim(copytext("[params["text"]]", 1, ADMIN_ANNOUNCE_MAX_LENGTH + 1))
	var/title = trim(copytext("[params["title"]]", 1, 201))
	var/sender = trim(copytext("[params["sender"]]", 1, 101))
	var/sound_choice = params["sound"]
	var/color_choice = params["color"]
	if(!length(message))
		return
	if(kind == "custom" && !length(sender))
		return

	var/list/players
	if(audience == "station")
		players = station_players()

	var/sound_text = "default"
	if(kind == "server")
		if(!user.client?.holder?.check_for_rights(R_SERVER))
			message = adminscrub(message, 500)
		var/play_sound = sound_choice != "none"
		sound_text = play_sound ? "default" : "none"
		send_ooc_announcement(message, title, players, play_sound, sender_override = "From [user.client?.holder?.fakekey ? "Administrator" : user.key]")
	else
		var/announce_sound
		if(sound_choice in GLOB.announcer_keys)
			announce_sound = sound_choice
			sound_text = sound_choice
		var/announce_color = (color_choice in ANNOUNCEMENT_COLORS) && color_choice != "default" ? color_choice : null
		var/announce_type
		var/sender_override
		switch(kind)
			if("captain")
				announce_type = ANNOUNCEMENT_TYPE_CAPTAIN
			if("syndicate")
				announce_type = ANNOUNCEMENT_TYPE_SYNDICATE
			if("custom")
				sender_override = html_encode(sender)
		priority_announce(message, title, announce_sound, announce_type, sender_override, has_important_message = TRUE, players = isnull(players) ? GLOB.player_list : players, color_override = announce_color)

	GLOB.admin_announce_history.Insert(1, list(list(
		"time" = time2text(world.timeofday, "hh:mm:ss"),
		"admin" = user.client?.holder?.fakekey ? "Administrator" : user.key,
		"kind" = kind,
		"audience" = audience,
		"sender" = sender,
		"title" = title,
		"text" = message,
		"sound" = sound_choice,
		"color" = color_choice,
	)))
	if(length(GLOB.admin_announce_history) > ADMIN_ANNOUNCE_HISTORY_MAX)
		GLOB.admin_announce_history.Cut(ADMIN_ANNOUNCE_HISTORY_MAX + 1)

	log_admin("Announce: [key_name(user)] : kind [kind], audience [audience], sender \"[sender]\", title \"[title]\", sound [sound_text], color [color_choice || "default"], text: [message]")
	message_admins("[key_name_admin(user)] sent an announcement ([kind], [audience]): [title ? "[title] - " : ""][message]")
	SStgui.update_uis(src)

#undef ADMIN_ANNOUNCE_HISTORY_MAX
#undef ADMIN_ANNOUNCE_MAX_LENGTH
#undef ADMIN_ANNOUNCE_KINDS
#undef ADMIN_ANNOUNCE_AUDIENCES
