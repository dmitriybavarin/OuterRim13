GLOBAL_LIST_EMPTY(player_panels)

#define PLAYER_PANEL_MAX_ENTRIES 60

/client/proc/open_player_panel(mob/target)
	if(!holder || QDELETED(target))
		return
	var/panel_key = "[ckey]-[REF(target)]"
	var/datum/player_panel/panel = GLOB.player_panels[panel_key]
	if(!panel)
		panel = new(target, panel_key)
		GLOB.player_panels[panel_key] = panel
	panel.ui_interact(mob)

/datum/player_panel
	var/datum/weakref/target_ref
	var/target_ckey
	var/panel_key

/datum/player_panel/New(mob/target, panel_key)
	. = ..()
	target_ref = WEAKREF(target)
	target_ckey = target.ckey
	src.panel_key = panel_key

/datum/player_panel/Destroy()
	GLOB.player_panels -= panel_key
	target_ref = null
	return ..()

/datum/player_panel/ui_close(mob/user)
	qdel(src)

/datum/player_panel/ui_state(mob/user)
	return ADMIN_STATE(R_ADMIN)

/datum/player_panel/ui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "PlayerPanel")
		ui.open()

/datum/player_panel/proc/target_mob()
	var/mob/target = target_ref?.resolve()
	if(QDELETED(target))
		return null
	return target

/datum/player_panel/proc/verb_for(action)
	var/static/list/verbs = list(
		"pm" = /datum/admin_verb/cmd_admin_pm_context,
		"jump" = /datum/admin_verb/jump_to_mob,
		"get" = /datum/admin_verb/get_mob,
		"send" = /datum/admin_verb/send_mob,
		"narrate" = /datum/admin_verb/cmd_admin_direct_narrate,
		"subtle" = /datum/admin_verb/cmd_admin_subtle_message,
		"headset" = /datum/admin_verb/cmd_admin_headset_message,
		"rejuvenate" = /datum/admin_verb/cmd_admin_rejuvenate,
		"smite" = /datum/admin_verb/admin_smite,
		"equipment" = /datum/admin_verb/select_equipment,
		"possess" = /datum/admin_verb/cmd_assume_direct_control,
		"contents" = /datum/admin_verb/cmd_check_contents,
		"vv" = /datum/admin_verb/debug_variables,
	)
	return verbs[action]

/datum/player_panel/proc/topic_for(action)
	var/static/list/topics = list(
		"heal" = "revive",
		"kick" = "boot2",
		"traitor" = "traitor",
		"skills" = "skill",
		"follow" = "adminplayerobservefollow",
		"prison" = "sendtoprison",
		"lobby" = "sendbacktolobby",
		"playsound" = "playsoundto",
		"language" = "languagemenu",
		"rpreminder" = "rpreminder",
		"forcesay" = "forcespeech",
		"quirks" = "applyquirks",
		"tdome1" = "tdome1",
		"tdome2" = "tdome2",
		"tdomeadmin" = "tdomeadmin",
		"tdomeobserve" = "tdomeobserve",
		"commend" = "admincommend",
		"makeai" = "makeai",
		"borgpanel" = "borgpanel",
		"initmind" = "initmind",
	)
	return topics[action]

/datum/player_panel/proc/run_topic(client/admin, list/href_list)
	href_list["admin_token"] = admin.holder.href_token
	var/old_usr = usr
	usr = admin.mob
	admin.holder.Topic("", href_list)
	usr = old_usr

/datum/player_panel/ui_data(mob/user)
	var/list/data = list()
	var/client/admin = user.client
	var/mob/target = target_mob()
	data["gone"] = !target
	data["ckey"] = target ? target.ckey : target_ckey
	data["can_admin"] = !!admin?.holder?.check_for_rights(R_ADMIN)
	data["can_ban"] = !!admin?.holder?.check_for_rights(R_BAN)
	data["can_fun"] = !!admin?.holder?.check_for_rights(R_FUN)
	data["can_spawn"] = !!admin?.holder?.check_for_rights(R_SPAWN)
	if(!target)
		return data
	var/client/player = target.client
	data["key"] = target.key
	data["name"] = "[target.name]"
	data["real_name"] = "[target.real_name]"
	data["mob_type"] = "[target.type]"
	data["has_client"] = !!player
	data["is_new_player"] = isnewplayer(target)
	data["is_ghost"] = isobserver(target)
	data["is_living"] = isliving(target)
	data["is_human"] = ishuman(target)
	data["is_cyborg"] = iscyborg(target)
	data["is_ai"] = isAI(target)
	data["is_monkey"] = HAS_TRAIT(target, TRAIT_LESSER_HUMANOID)
	data["has_mind"] = !!target.mind
	data["job"] = target.mind?.assigned_role?.title
	data["old_names"] = target.persistent_client ? target.persistent_client.get_played_names() : ""
	data["rank"] = player?.holder ? player.holder.rank_names() : null
	if(player)
		data["join_date"] = player.player_join_date
		data["account_date"] = player.account_join_date
		data["account_age"] = player.account_age
		data["player_age"] = player.player_age
		data["ping"] = round(player.avgping)
		data["byond_version"] = "[player.byond_version].[player.byond_build ? player.byond_build : "xxx"]"
		data["muted"] = player.prefs.muted
		if(CONFIG_GET(flag/use_exp_tracking))
			data["playtime"] = player.get_exp_living(FALSE)
		if(data["can_ban"])
			data["ip"] = player.address
			data["cid"] = player.computer_id
		data["centcom_enabled"] = !!CONFIG_GET(string/centcom_ban_db)
	if(isliving(target))
		var/mob/living/living_target = target
		data["status"] = list(
			"stat" = living_target.stat,
			"health" = round(living_target.health),
			"max_health" = round(living_target.maxHealth),
			"brute" = round(living_target.get_brute_loss(), 0.1),
			"burn" = round(living_target.get_fire_loss(), 0.1),
			"tox" = round(living_target.get_tox_loss(), 0.1),
			"oxy" = round(living_target.get_oxy_loss(), 0.1),
			"stamina" = round(living_target.get_stamina_loss(), 0.1),
		)
	var/list/limbs = list()
	var/list/organ_list = list()
	if(iscarbon(target))
		var/mob/living/carbon/carbon_target = target
		for(var/obj/item/bodypart/limb as anything in carbon_target.bodyparts)
			if(length(limbs) >= PLAYER_PANEL_MAX_ENTRIES)
				break
			limbs += list(list(
				"name" = "[limb.name]",
				"brute" = round(limb.brute_dam),
				"burn" = round(limb.burn_dam),
				"max" = round(limb.max_damage),
			))
		for(var/obj/item/organ/organ as anything in carbon_target.organs)
			if(length(organ_list) >= PLAYER_PANEL_MAX_ENTRIES)
				break
			organ_list += list(list(
				"name" = "[organ.name]",
				"damage" = round(organ.damage),
				"max" = round(organ.maxHealth),
				"failing" = !!(organ.organ_flags & ORGAN_FAILING),
			))
	data["limbs"] = limbs
	data["organs"] = organ_list
	var/list/antags = list()
	if(target.mind)
		for(var/datum/antagonist/antag as anything in target.mind.antag_datums)
			if(length(antags) >= PLAYER_PANEL_MAX_ENTRIES)
				break
			antags += "[antag.name]"
	data["antags"] = antags
	return data

/datum/player_panel/ui_act(action, list/params, datum/tgui/ui, datum/ui_state/state)
	. = ..()
	if(.)
		return
	var/client/admin = ui.user.client
	if(!admin?.holder)
		return
	if(action == "refresh")
		var/mob/updated = get_mob_by_ckey(target_ckey)
		if(updated)
			target_ref = WEAKREF(updated)
		return TRUE
	var/mob/target = target_mob()
	if(!target)
		return
	INVOKE_ASYNC(src, PROC_REF(run_action), admin, action, target, params)
	return TRUE

/datum/player_panel/proc/run_action(client/admin, action, mob/target, list/params)
	if(QDELETED(target) || !admin?.holder)
		return
	var/verb_type = verb_for(action)
	if(verb_type)
		SSadmin_verbs.dynamic_invoke_verb(admin, verb_type, target)
		return
	var/topic_key = topic_for(action)
	if(topic_key)
		run_topic(admin, list("[topic_key]" = REF(target)))
		return
	switch(action)
		if("transform")
			var/kind = params["kind"]
			if(kind == "ai")
				run_topic(admin, list("makeai" = REF(target)))
			else if(kind in list("observer", "human", "monkey", "robot"))
				run_topic(admin, list("simplemake" = kind, "mob" = REF(target)))
		if("mute")
			run_topic(admin, list("mute" = target.ckey, "mute_type" = "[text2num(params["type"])]"))
		if("ban")
			if(target.client)
				run_topic(admin, list("newbankey" = target.key, "newbanip" = target.client.address, "newbancid" = target.client.computer_id))
			else
				run_topic(admin, list("newbankey" = target.key))
		if("notes")
			run_topic(admin, list("showmessageckey" = target.ckey))
		if("unbans")
			run_topic(admin, list("searchunbankey" = target.key))
		if("centcom")
			run_topic(admin, list("centcomlookup" = target.ckey))
		if("related")
			if(target.client)
				run_topic(admin, list("showrelatedacc" = params["by"] == "ip" ? "ip" : "cid", "client" = REF(target.client)))
		if("logs")
			run_topic(admin, list("individuallog" = REF(target), "log_src" = target.ckey ? LOGSRC_CKEY : LOGSRC_MOB))
	SStgui.update_uis(src)

#undef PLAYER_PANEL_MAX_ENTRIES
