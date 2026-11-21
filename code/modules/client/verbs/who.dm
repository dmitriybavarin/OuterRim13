#define DEFAULT_WHO_CELLS_PER_ROW 4

GAME_VERB(/client, who, "Who", "OOC")

	var/msg = ""

	var/list/Lines = list()
	var/columns_per_row = DEFAULT_WHO_CELLS_PER_ROW

	if(holder)
		if (check_rights(R_ADMIN,0) && isobserver(src.mob))//If they have +ADMIN and are a ghost they can see players IC names and statuses.
			columns_per_row = 1
			var/mob/dead/observer/G = src.mob
			if(!G.started_as_observer)//If you aghost to do this, KorPhaeron will deadmin you in your sleep.
				log_admin("[key_name(usr)] checked advanced who in-round")
			for(var/client/client in GLOB.clients)
				var/entry = "\t[client.key]"
				if(client.holder && client.holder.fakekey)
					entry += " <i>(as [client.holder.fakekey])</i>"
				if (isnewplayer(client.mob))
					entry += " - <font color='darkgray'><b>In Lobby</b></font>"
				else
					entry += " - Playing as [client.mob.real_name]"
					switch(client.mob.stat)
						if(HARD_CRIT)
							entry += " - <font color='darkgray'><b>Unconscious</b></font>"
						if(DEAD)
							if(isobserver(client.mob))
								var/mob/dead/observer/O = client.mob
								if(O.started_as_observer)
									entry += " - <font color='gray'>Observing</font>"
								else
									entry += " - <font color='black'><b>DEAD</b></font>"
							else
								entry += " - <font color='black'><b>DEAD</b></font>"
					if(client.mob.is_antag())
						entry += " - <b><font color='red'>Antagonist</font></b>"
				entry += " [ADMIN_QUE(client.mob)]"
				entry += " ([round(client.avgping, 1)]ms)"
				Lines += entry
		else//If they don't have +ADMIN, only show hidden admins
			for(var/client/client in GLOB.clients)
				var/entry = "[client.key]"
				if(client.holder && client.holder.fakekey)
					entry += " <i>(as [client.holder.fakekey])</i>"
				entry += " ([round(client.avgping, 1)]ms)"
				Lines += entry
	else
		for(var/client/client in GLOB.clients)
			if(client.holder && client.holder.fakekey)
				Lines += "[client.holder.fakekey] ([round(client.avgping, 1)]ms)"
			else
				Lines += "[client.key] ([round(client.avgping, 1)]ms)"

	var/num_lines = 0
	msg += "<table style='width: 100%; table-layout: fixed'><tr>"
	for(var/line in sort_list(Lines))
		msg += "<td>[line]</td>"

		num_lines += 1
		if (num_lines == columns_per_row)
			num_lines = 0
			msg += "</tr><tr>"
	msg += "</tr></table>"

	msg += "<b>Total Players: [length(Lines)]</b>"
	to_chat(src, fieldset_block(span_bold("Current Players"), span_infoplain(msg), "boxed_message"), type = MESSAGE_TYPE_INFO)

GAME_VERB(/client, adminwho, "Adminwho", "Admin")

	GLOB.admin_who_panel.ui_interact(mob)

GLOBAL_DATUM_INIT(admin_who_panel, /datum/admin_who_panel, new)

/datum/admin_who_panel

/datum/admin_who_panel/ui_state(mob/user)
	return GLOB.always_state

/datum/admin_who_panel/ui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "AdminWho")
		ui.open()

/datum/admin_who_panel/ui_data(mob/user)
	var/list/data = list()
	var/is_admin = !!user.client?.holder
	data["is_admin"] = is_admin
	var/list/admins = list()
	for(var/client/admin as anything in GLOB.admins)
		if(!admin?.holder)
			continue
		var/afk = admin.is_afk()
		if(!is_admin && (afk || !isnull(admin.holder.fakekey)))
			continue
		var/list/entry = list("key" = admin.key)
		if(is_admin)
			entry["rank"] = admin.holder.rank_names()
			entry["fakekey"] = admin.holder.fakekey
			entry["afk"] = afk
			entry["feedback"] = !isnull(admin.holder.feedback_link())
			entry["ref"] = REF(admin)
			if(isobserver(admin.mob))
				entry["status"] = "observing"
			else if(isnewplayer(admin.mob))
				if(SSticker.current_state <= GAME_STATE_PREGAME)
					var/mob/dead/new_player/lobbied_admin = admin.mob
					entry["status"] = lobbied_admin.ready == PLAYER_READY_TO_PLAY ? "lobby_ready" : "lobby_unready"
				else
					entry["status"] = "lobby"
			else
				entry["status"] = "playing"
		admins += list(entry)
	data["admins"] = admins
	return data

/datum/admin_who_panel/ui_act(action, list/params, datum/tgui/ui, datum/ui_state/state)
	. = ..()
	if(.)
		return
	var/mob/user = ui.user
	if(action != "open_feedback" || !user.client?.holder)
		return TRUE
	var/client/target = locate("[params["ref"]]") in GLOB.admins
	var/feedback_link = target?.holder?.feedback_link()
	if(feedback_link)
		user << link(feedback_link)
	return TRUE

#undef DEFAULT_WHO_CELLS_PER_ROW
