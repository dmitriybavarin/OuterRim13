GLOBAL_LIST_EMPTY(admin_context_menus)

#define ADMIN_CONTEXT_MAX_TARGETS 80

/client/proc/open_admin_context_menu(atom/target)
	if(!holder || QDELETED(target))
		return
	var/turf/clicked = get_turf(target)
	if(!clicked)
		return
	var/datum/admin_context_menu/menu = GLOB.admin_context_menus[ckey]
	if(!menu)
		menu = new
		GLOB.admin_context_menus[ckey] = menu
	menu.clicked_turf = clicked
	menu.focus = target
	menu.serial++
	menu.ui_interact(mob)
	SStgui.update_uis(menu)

/datum/admin_context_menu
	var/turf/clicked_turf
	var/atom/focus
	var/serial = 0

/datum/admin_context_menu/ui_state(mob/user)
	return ADMIN_STATE(R_ADMIN|R_DEBUG|R_FUN|R_POSSESS|R_SPAWN)

/datum/admin_context_menu/ui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "AdminContext")
		ui.open()

/datum/admin_context_menu/proc/verb_for(action)
	var/static/list/verbs = list(
		"possess_mob" = /datum/admin_verb/cmd_assume_direct_control,
		"possess_obj" = /datum/admin_verb/possess,
		"vv" = /datum/admin_verb/debug_variables,
		"mark" = /datum/admin_verb/mark_datum,
		"tag" = /datum/admin_verb/tag_datum,
		"delete" = /datum/admin_verb/cmd_admin_delete,
		"proccall" = /datum/admin_verb/call_proc_datum,
		"narrate" = /datum/admin_verb/cmd_admin_local_narrate,
		"osay" = /datum/admin_verb/object_say,
		"occupants" = /datum/admin_verb/show_occupants_player_panel,
		"tweak" = /datum/admin_verb/machine_upgrade,
		"admin_pm" = /datum/admin_verb/cmd_admin_pm_context,
		"check_contents" = /datum/admin_verb/cmd_check_contents,
		"direct_narrate" = /datum/admin_verb/cmd_admin_direct_narrate,
		"headset" = /datum/admin_verb/cmd_admin_headset_message,
		"jump_mob" = /datum/admin_verb/jump_to_mob,
		"rejuvenate" = /datum/admin_verb/cmd_admin_rejuvenate,
		"select_equipment" = /datum/admin_verb/select_equipment,
		"player_panel" = /datum/admin_verb/show_player_panel,
		"subtle" = /datum/admin_verb/cmd_admin_subtle_message,
		"smite" = /datum/admin_verb/admin_smite,
		"get_mob" = /datum/admin_verb/get_mob,
		"send_mob" = /datum/admin_verb/send_mob,
	)
	return verbs[action]

/datum/admin_context_menu/proc/available_actions(atom/target, client/admin)
	var/list/result = list("examine", "point", "vv", "mark", "tag", "delete", "proccall", "narrate")
	if(ismob(target))
		var/mob/target_mob = target
		if(target != admin.mob)
			result += "possess_mob"
			result += "jump_mob"
			result += "get_mob"
			result += "send_mob"
		if(target_mob.client)
			result += "admin_pm"
		result += "subtle"
		result += "direct_narrate"
		result += "select_equipment"
		result += "player_panel"
		if(ishuman(target_mob))
			result += "headset"
		if(isliving(target_mob))
			result += "rejuvenate"
			result += "check_contents"
			result += "smite"
	else if(isobj(target))
		if(target.loc)
			result += "possess_obj"
		result += "osay"
		result += "occupants"
		if(ismachinery(target))
			result += "tweak"
	var/list/allowed = list()
	for(var/action in result)
		var/verb_type = verb_for(action)
		if(verb_type)
			var/datum/admin_verb/verb_singleton = SSadmin_verbs.admin_verbs_by_type[verb_type]
			if(!verb_singleton || !admin.holder.check_for_rights(verb_singleton.permissions))
				continue
		allowed += action
	return allowed

/datum/admin_context_menu/proc/target_entry(atom/target, client/admin, kind)
	var/list/entry = list(
		"ref" = REF(target),
		"name" = "[target.name]",
		"type" = "[target.type]",
		"kind" = kind,
		"actions" = available_actions(target, admin),
	)
	if(ismob(target))
		var/mob/target_mob = target
		entry["ckey"] = target_mob.ckey
	return entry

/datum/admin_context_menu/ui_data(mob/user)
	var/list/data = list()
	var/client/admin = user.client
	data["serial"] = serial
	data["focus"] = focus ? REF(focus) : null
	var/list/targets = list()
	if(admin?.holder && !QDELETED(clicked_turf))
		data["coords"] = "[clicked_turf.x], [clicked_turf.y], [clicked_turf.z]"
		var/list/mobs = list()
		var/list/objs = list()
		for(var/atom/movable/thing as anything in clicked_turf)
			if(QDELETED(thing) || istype(thing, /atom/movable/screen))
				continue
			if(istype(thing, /obj/effect) && thing != focus)
				continue
			if(ismob(thing))
				mobs += list(target_entry(thing, admin, "mob"))
			else if(isobj(thing))
				objs += list(target_entry(thing, admin, "obj"))
		targets += mobs
		targets += objs
		if(length(targets) > ADMIN_CONTEXT_MAX_TARGETS)
			targets.Cut(ADMIN_CONTEXT_MAX_TARGETS + 1)
		targets += list(target_entry(clicked_turf, admin, "turf"))
	data["targets"] = targets
	return data

/datum/admin_context_menu/ui_act(action, list/params, datum/tgui/ui, datum/ui_state/state)
	. = ..()
	if(.)
		return
	var/client/admin = ui.user.client
	if(!admin?.holder)
		return
	var/atom/target = locate(params["ref"])
	if(!istype(target) || QDELETED(target))
		return
	if(target != clicked_turf && get_turf(target) != clicked_turf)
		return
	if(!(action in available_actions(target, admin)))
		return
	INVOKE_ASYNC(src, PROC_REF(run_action), admin, action, target)
	return TRUE

/datum/admin_context_menu/proc/run_action(client/admin, action, atom/target)
	var/turf/target_turf = get_turf(target)
	log_admin("[key_name(admin)] used the admin context menu action [action] on [target] ([target.type]) at [AREACOORD(target_turf)]")
	switch(action)
		if("examine")
			admin.mob.run_examinate(target)
		if("point")
			admin.mob._pointed(target)
		else
			var/verb_type = verb_for(action)
			if(verb_type)
				SSadmin_verbs.dynamic_invoke_verb(admin, verb_type, target)
	SStgui.update_uis(src)

#undef ADMIN_CONTEXT_MAX_TARGETS
