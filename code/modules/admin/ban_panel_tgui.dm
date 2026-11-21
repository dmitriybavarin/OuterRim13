/datum/ban_panel_ui
	var/player_key
	var/player_ip
	var/player_cid
	var/role
	var/duration
	var/applies_to_admins
	var/reason
	var/edit_id
	var/page
	var/admin_key
	var/list/categories = list()
	var/list/valid_roles = list()
	var/list/banned_from = list()

/datum/ban_panel_ui/New(player_key, player_ip, player_cid, role, duration, applies_to_admins, reason, edit_id, page, admin_key)
	. = ..()
	src.player_key = player_key
	src.player_ip = player_ip
	src.player_cid = player_cid
	src.role = role
	src.duration = duration
	src.applies_to_admins = applies_to_admins
	src.reason = reason
	src.edit_id = edit_id
	src.page = page
	src.admin_key = admin_key

/datum/ban_panel_ui/proc/prepare()
	if(edit_id)
		return TRUE
	if(player_key && SSdbcore.Connect())
		var/datum/db_query/query_get_banned_roles = SSdbcore.NewQuery({"
			SELECT role
			FROM [format_table_name("ban")]
			WHERE
				ckey = :player_ckey AND
				role <> 'server'
				AND unbanned_datetime IS NULL
				AND (expiration_time IS NULL OR expiration_time > NOW())
		"}, list("player_ckey" = ckey(player_key)))
		if(!query_get_banned_roles.warn_execute())
			qdel(query_get_banned_roles)
			return FALSE
		while(query_get_banned_roles.NextRow())
			banned_from += query_get_banned_roles.item[1]
		qdel(query_get_banned_roles)
	build_categories()
	return TRUE

/datum/ban_panel_ui/proc/add_category(id, label, color, kind, list/role_names)
	categories += list(list(
		"id" = id,
		"label" = label,
		"color" = color,
		"kind" = kind,
		"roles" = role_names,
	))
	for(var/role_name in role_names)
		valid_roles |= role_name

/datum/ban_panel_ui/proc/build_categories()
	for(var/datum/job_department/department as anything in SSjob.joinable_departments)
		var/list/job_names = list()
		for(var/datum/job/job_datum as anything in department.get_jobban_jobs())
			job_names += job_datum.title
		add_category(department.get_label_class(), department.department_name, department.ui_color, "department", job_names)
	add_category("abstract", "Abstract", null, "abstract", list("Appearance", "Emote", "Deadchat", "OOC", "Urgent Adminhelp"))
	add_category("ghost", "Ghost and Other Roles", null, "ghost", list(
		ROLE_PAI,
		ROLE_BOT,
		ROLE_BRAINWASHED,
		ROLE_DEATHSQUAD,
		ROLE_DRONE,
		ROLE_LAVALAND,
		ROLE_MIND_TRANSFER,
		ROLE_POSIBRAIN,
		ROLE_SENTIENCE,
		ROLE_RECOVERED_CREW,
	))
	add_category("antagonist", "Antagonist Positions", null, "antagonist", list(
		ROLE_ABDUCTOR,
		ROLE_ALIEN,
		ROLE_BLOB,
		ROLE_BLOOD_WORM,
		ROLE_BROTHER,
		ROLE_CHANGELING,
		ROLE_CULTIST,
		ROLE_FUGITIVE,
		ROLE_FUGITIVE_HUNTER,
		ROLE_GLITCH,
		ROLE_HERETIC,
		ROLE_HIVE,
		ROLE_MALF,
		ROLE_NINJA,
		ROLE_OPERATIVE,
		ROLE_CLOWN_OPERATIVE,
		ROLE_OVERTHROW,
		ROLE_PARADOX_CLONE,
		ROLE_REV,
		ROLE_REVENANT,
		ROLE_REV_HEAD,
		ROLE_SPACE_DRAGON,
		ROLE_SPIDER,
		ROLE_SPY,
		ROLE_SYNDICATE,
		ROLE_TRAITOR,
		ROLE_VOIDWALKER,
		ROLE_WIZARD,
	))

/datum/ban_panel_ui/ui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "BanPanel")
		ui.open()

/datum/ban_panel_ui/ui_state(mob/user)
	return ADMIN_STATE(R_BAN)

/datum/ban_panel_ui/ui_data(mob/user)
	return list()

/datum/ban_panel_ui/ui_static_data(mob/user)
	var/is_permanent = !duration
	var/list/data = list()
	data["edit_id"] = edit_id
	data["edit_role"] = role
	data["server_ban"] = role == "Server"
	data["player_key"] = player_key
	data["player_ip"] = player_ip
	data["player_cid"] = player_cid
	data["key_check"] = !!player_key
	data["ip_check"] = is_permanent
	data["cid_check"] = TRUE
	data["last_connection"] = ((is_permanent && !player_ip) || !player_cid) ? TRUE : FALSE
	data["applies_to_admins"] = !!applies_to_admins
	data["permanent"] = is_permanent
	data["duration"] = duration ? duration : 1440
	data["reason"] = reason
	data["max_reason"] = MAX_REASON_LENGTH
	data["categories"] = categories
	data["banned_from"] = banned_from
	return data

/datum/ban_panel_ui/ui_act(action, params, datum/tgui/ui)
	. = ..()
	if(.)
		return
	var/client/admin_client = ui.user.client
	if(!admin_client?.holder || !check_rights_for(admin_client, R_BAN))
		return FALSE
	switch(action)
		if("submit")
			submit(admin_client.holder, params)
			return TRUE

/datum/ban_panel_ui/proc/submit(datum/admins/admin_holder, list/params)
	var/list/href_list = list()
	if(params["key_check"])
		href_list["keycheck"] = "1"
		href_list["keytext"] = trim("[params["key_text"]]")
	if(params["ip_check"])
		href_list["ipcheck"] = "1"
	if(params["cid_check"])
		href_list["cidcheck"] = "1"
	if(params["last_connection"])
		href_list["lastconn"] = "1"
	else
		href_list["iptext"] = trim("[params["ip_text"]]")
		href_list["cidtext"] = trim("[params["cid_text"]]")
	if(params["applies_to_admins"])
		href_list["applyadmins"] = "1"
	if(params["permanent"])
		href_list["radioduration"] = "permanent"
	else
		href_list["radioduration"] = "temporary"
		var/duration_text = "[params["duration"]]"
		var/duration_value = text2num(duration_text)
		if(duration_text && (isnull(duration_value) || duration_value <= 0))
			to_chat(usr, span_danger("Ban not [edit_id ? "edited" : "created"] because the following errors were present:\nThe duration must be a positive number."), confidential = TRUE)
			return
		href_list["duration"] = duration_text
		href_list["intervaltype"] = "[params["interval"]]"
	href_list["reason"] = "[params["reason"]]"
	if(edit_id)
		href_list["editid"] = "[edit_id]"
		if(params["mirror_edit"])
			href_list["mirroredit"] = "1"
		href_list["oldkey"] = "[player_key]"
		href_list["oldip"] = "[player_ip]"
		href_list["oldcid"] = "[player_cid]"
		href_list["oldapplies"] = "[applies_to_admins]"
		href_list["oldduration"] = "[duration]"
		href_list["oldreason"] = "[reason]"
		href_list["page"] = "[page]"
		href_list["adminkey"] = "[admin_key]"
		href_list["role"] = "[role]"
	else
		var/severity = params["severity"]
		if(severity in list("none", "minor", "medium", "high"))
			href_list["radioseverity"] = severity
		var/ban_type = params["ban_type"]
		if(ban_type in list("server", "role"))
			href_list["radioban"] = ban_type
		if(ban_type == "role")
			href_list["roleban_delimiter"] = "1"
			var/list/selected_roles = params["roles"]
			if(islist(selected_roles))
				for(var/selected_role in selected_roles)
					if(selected_role in valid_roles)
						href_list[selected_role] = "1"
	admin_holder.ban_parse_href(href_list)

/datum/admins/proc/ban_panel(player_key, player_ip, player_cid, role, duration = 1440, applies_to_admins, reason, edit_id, page, admin_key)
	if(!check_rights(R_BAN))
		return
	if(duration == BAN_PANEL_PERMANENT)
		duration = null
	var/datum/ban_panel_ui/panel = new(player_key, player_ip, player_cid, role, duration, applies_to_admins, reason, edit_id, page, admin_key)
	if(!panel.prepare())
		qdel(panel)
		return
	panel.ui_interact(usr)

