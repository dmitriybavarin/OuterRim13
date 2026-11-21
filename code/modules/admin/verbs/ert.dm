/// If we spawn an ERT with the "choose experienced leader" option, select the leader from the top X playtimes
#define ERT_EXPERIENCED_LEADER_CHOOSE_TOP 3
#define ERT_MAX_TEAMSIZE 50
#define ERT_MAX_TEXT_LENGTH 500
#define ERT_PREVIEW_SLOT "ert_preview"

// CENTCOM RESPONSE TEAM

ADMIN_VERB(summon_ert, R_FUN, "Summon ERT", "Summons an emergency response team.", ADMIN_CATEGORY_FUN)
	message_admins("[key_name_admin(user)] opened the Summon ERT window.")
	log_admin("[key_name(user)] opened the Summon ERT window.")
	var/datum/ert_panel/panel = new
	panel.ui_interact(user.mob)
	BLACKBOX_LOG_ADMIN_VERB("Summon ERT")

/datum/ert_panel
	var/busy = FALSE
	var/preview_busy = FALSE
	var/list/preview_cache = list()
	var/list/preview_current = list()

/datum/ert_panel/ui_state(mob/user)
	return ADMIN_STATE(R_FUN)

/datum/ert_panel/ui_close(mob/user)
	if(!busy)
		qdel(src)

/datum/ert_panel/ui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "SummonERT")
		ui.open()

/datum/ert_panel/ui_static_data(mob/user)
	var/list/data = list()
	var/list/templates = list()
	var/enforce_human = CONFIG_GET(string/human_authority) == HUMAN_AUTHORITY_ENFORCED
	for(var/template_type in subtypesof(/datum/ert))
		var/datum/ert/template = new template_type
		templates += list(list(
			"id" = "[template_type]",
			"name" = replacetext("[template_type]", "/datum/ert/", ""),
			"code" = template.code,
			"teamsize" = template.teamsize,
			"mission" = template.mission,
			"polldesc" = template.polldesc,
			"open_armory" = template.opendoors,
			"leader_experience" = template.leader_experience,
			"random_names" = template.random_names,
			"spawn_admin" = template.spawn_admin,
			"use_custom_shuttle" = template.use_custom_shuttle,
			"has_shuttle" = !!template.ert_template,
			"enforce_human" = enforce_human,
			"mob_type" = template.mob_type ? "[template.mob_type]" : "",
		))
		qdel(template)
	data["templates"] = templates
	var/list/species = list()
	for(var/mob_type in subtypesof(/mob/living/carbon/human))
		species += "[mob_type]"
	data["mob_types"] = species
	data["max_teamsize"] = ERT_MAX_TEAMSIZE
	data["max_text"] = ERT_MAX_TEXT_LENGTH
	return data

/datum/ert_panel/ui_data(mob/user)
	var/list/data = list()
	data["busy"] = busy
	data["spawn_points"] = length(GLOB.emergencyresponseteamspawn)
	data["user_is_ghost"] = isobserver(user)
	var/list/ghosts = list()
	for(var/mob/dead/observer/ghost in GLOB.player_list)
		if(!ghost.client)
			continue
		ghosts += list(list(
			"name" = ghost.name,
			"ckey" = ghost.ckey,
			"minutes" = ghost.client.get_exp_living(TRUE) || 0,
			"banned" = !!is_banned_from(ghost.ckey, "deathsquad"),
		))
	data["ghosts"] = ghosts
	data["preview"] = preview_current
	data["preview_busy"] = preview_busy
	return data

/datum/ert_panel/ui_act(action, list/params, datum/tgui/ui, datum/ui_state/state)
	. = ..()
	if(.)
		return
	var/mob/user = ui.user
	switch(action)
		if("preview")
			if(preview_busy)
				return TRUE
			var/preview_type = text2path(params["template"])
			if(!ispath(preview_type, /datum/ert) || preview_type == /datum/ert)
				return TRUE
			var/preview_mob = text2path(params["mob_type"])
			if(!ispath(preview_mob, /mob/living/carbon/human))
				preview_mob = null
			build_preview(preview_type, preview_mob, !!params["enforce_human"])
			return TRUE
		if("summon")
			if(busy)
				return TRUE
			var/template_type = text2path(params["template"])
			if(!ispath(template_type, /datum/ert) || template_type == /datum/ert)
				return TRUE
			var/datum/ert/ertemplate = new template_type
			ertemplate.teamsize = clamp(round(text2num(params["teamsize"]) || 1), 1, ERT_MAX_TEAMSIZE)
			ertemplate.mission = STRIP_HTML_SIMPLE(trim(params["mission"]), ERT_MAX_TEXT_LENGTH)
			ertemplate.polldesc = STRIP_HTML_SIMPLE(trim(params["polldesc"]), ERT_MAX_TEXT_LENGTH)
			if(!length(ertemplate.polldesc))
				ertemplate.polldesc = "a Code [ertemplate.code] Nanotrasen Emergency Response Team"
			ertemplate.enforce_human = !!params["enforce_human"]
			ertemplate.opendoors = !!params["open_armory"]
			ertemplate.leader_experience = !!params["leader_experience"]
			ertemplate.random_names = !!params["random_names"]
			ertemplate.spawn_admin = !!params["spawn_admin"]
			ertemplate.use_custom_shuttle = !!params["use_custom_shuttle"]
			var/mob_type = text2path(params["mob_type"])
			ertemplate.mob_type = ispath(mob_type, /mob/living/carbon/human) ? mob_type : null
			busy = TRUE
			log_admin("[key_name(user)] summoned a CentCom response team: [template_type], size [ertemplate.teamsize], mission \"[ertemplate.mission]\", poll \"[ertemplate.polldesc]\", open armory: [ertemplate.opendoors], experienced leader: [ertemplate.leader_experience], random names: [ertemplate.random_names], briefing officer: [ertemplate.spawn_admin], custom shuttle: [ertemplate.use_custom_shuttle], enforce human: [ertemplate.enforce_human], species: [ertemplate.mob_type || "default"].")
			message_admins("[key_name_admin(user)] is creating a CentCom response team ([template_type])...")
			INVOKE_ASYNC(src, PROC_REF(run_summon), user, ertemplate)
			return TRUE

/datum/ert_panel/proc/build_preview(preview_type, preview_mob, enforce_human)
	var/cache_key = "[preview_type]|[preview_mob]|[enforce_human]"
	if(preview_cache[cache_key])
		preview_current = preview_cache[cache_key]
		return
	preview_busy = TRUE
	SStgui.update_uis(src)
	var/datum/ert/template = new preview_type
	var/list/role_types = list(template.leader_role)
	for(var/role_type in template.roles)
		if(!(role_type in role_types))
			role_types += role_type
	var/species_type
	if(preview_mob)
		var/mob/living/carbon/human/species/species_mob = preview_mob
		species_type = initial(species_mob.race)
	var/list/result = list()
	for(var/role_type in role_types)
		var/datum/antagonist/ert/role_antag = role_type
		var/mob/living/carbon/human/dummy/mannequin = generate_or_wait_for_human_dummy(ERT_PREVIEW_SLOT)
		if(!enforce_human && species_type)
			mannequin.set_species(species_type)
		else
			mannequin.set_species(/datum/species/human)
		mannequin.equipOutfit(initial(role_antag.outfit), TRUE)
		mannequin.setDir(SOUTH)
		var/icon/flat = getFlatIcon(mannequin)
		flat.Scale(flat.Width() * 2, flat.Height() * 2)
		result += list(list(
			"role" = initial(role_antag.role),
			"leader" = role_type == template.leader_role,
			"image" = icon2base64(flat),
		))
		unset_busy_human_dummy(ERT_PREVIEW_SLOT)
		CHECK_TICK
	qdel(template)
	preview_cache[cache_key] = result
	preview_current = result
	preview_busy = FALSE

/datum/ert_panel/proc/run_summon(mob/user, datum/ert/ertemplate)
	var/success = spawn_response_team(user, ertemplate)
	busy = FALSE
	if(success)
		log_admin("[key_name(user)] created a CentCom response team.")
	else
		log_admin("[key_name(user)] failed to create a CentCom response team.")
	if(user && !QDELETED(src))
		SStgui.update_uis(src)

/datum/ert_panel/proc/spawn_response_team(mob/user, datum/ert/ertemplate)
	var/list/spawn_points = GLOB.emergencyresponseteamspawn

	var/list/mob/dead/observer/candidates = SSpolling.poll_ghost_candidates("Do you wish to be considered for [span_notice(ertemplate.polldesc)]?", check_jobban = "deathsquad", alert_pic = /obj/item/card/id/advanced/centcom/ert/commander, role_name_text = "emergency response team")

	if(!length(candidates))
		message_admins("[key_name_admin(user)] tried to create a CentCom response team but [user.p_they()] didn't find any candidates.")
		return FALSE

	var/list/spawn_turfs = list()

	var/turf/brief_spawn

	if(ertemplate.use_custom_shuttle && ertemplate.ert_template)
		to_chat(user, span_boldnotice("Attempting to spawn ERT custom shuttle, this may take a few seconds..."))
		var/datum/map_template/shuttle/ship = new ertemplate.ert_template
		var/x = rand(TRANSITIONEDGE, world.maxx - TRANSITIONEDGE - ship.width)
		var/y = rand(TRANSITIONEDGE, world.maxy - TRANSITIONEDGE - ship.height)
		var/z = SSmapping.empty_space.z_value
		var/turf/located_turf = locate(x, y, z)
		if(!located_turf)
			CRASH("ERT shuttle found no place to load in")

		if(!ship.load(located_turf))
			CRASH("Loading ERT shuttle failed!")

		var/list/shuttle_turfs = ship.get_affected_turfs(located_turf)

		for(var/turf/affected_turf as anything in shuttle_turfs)
			for(var/obj/effect/landmark/ert_shuttle_spawn/spawner in affected_turf)
				spawn_turfs += get_turf(spawner)

			if(!brief_spawn)
				brief_spawn = get_turf(locate(/obj/effect/landmark/ert_shuttle_brief_spawn) in affected_turf)

		if(!length(spawn_turfs))
			stack_trace("ERT shuttle loaded but found no spawn points, placing the ERT at wherever inside the shuttle instead.")

			for(var/turf/open/floor/open_turf in shuttle_turfs)
				if(!is_safe_turf(open_turf))
					continue
				spawn_turfs += open_turf

	if(ertemplate.spawn_admin)
		if(isobserver(user))
			var/mob/living/carbon/human/admin_officer = new (brief_spawn || spawn_points[1])
			var/chosen_outfit = user.client?.prefs?.read_preference(/datum/preference/choiced/brief_outfit)
			user.client.prefs.safe_transfer_prefs_to(admin_officer, is_antag = TRUE)
			admin_officer.equipOutfit(chosen_outfit)
			admin_officer.PossessByPlayer(user.key)

		else
			to_chat(user, span_warning("Could not spawn you in as briefing officer as you are not a ghost!"))

	var/numagents = min(ertemplate.teamsize, length(candidates))

	var/datum/team/ert/ert_team = new ertemplate.team()
	if(ertemplate.rename_team)
		ert_team.name = ertemplate.rename_team

	var/datum/objective/missionobj = new ()
	missionobj.team = ert_team
	missionobj.explanation_text = ertemplate.mission
	missionobj.completed = TRUE
	ert_team.objectives += missionobj
	ert_team.mission = missionobj

	var/mob/dead/observer/earmarked_leader
	var/leader_spawned = FALSE

	if(ertemplate.leader_experience)
		var/list/candidate_living_exps = list()
		for(var/i in candidates)
			var/mob/dead/observer/potential_leader = i
			candidate_living_exps[potential_leader] = potential_leader.client?.get_exp_living(TRUE)

		candidate_living_exps = sort_list(candidate_living_exps, cmp=/proc/cmp_numeric_dsc)
		if(candidate_living_exps.len > ERT_EXPERIENCED_LEADER_CHOOSE_TOP)
			candidate_living_exps.Cut(ERT_EXPERIENCED_LEADER_CHOOSE_TOP+1)
		earmarked_leader = pick(candidate_living_exps)
	else
		earmarked_leader = pick(candidates)

	var/spawn_index = 0
	while(numagents && candidates.len)
		var/turf/spawnloc
		if(length(spawn_turfs))
			spawnloc = pick(spawn_turfs)
		else
			spawnloc = spawn_points[spawn_index+1]
			spawn_index = WRAP_UP(spawn_index, spawn_points.len)

		var/mob/dead/observer/chosen_candidate = earmarked_leader || pick(candidates)
		candidates -= chosen_candidate

		var/mob/living/carbon/human/ert_operative
		if(ertemplate.mob_type)
			ert_operative = new ertemplate.mob_type(spawnloc)
		else
			ert_operative = new /mob/living/carbon/human(spawnloc)
			chosen_candidate.client.prefs.safe_transfer_prefs_to(ert_operative, is_antag = TRUE)
		ert_operative.PossessByPlayer(chosen_candidate.key)

		if(ertemplate.enforce_human || !(ert_operative.dna.species.changesource_flags & ERT_SPAWN))
			ert_operative.set_species(/datum/species/human)

		var/datum/antagonist/ert/ert_antag

		if((chosen_candidate == earmarked_leader) || (numagents == 1 && !leader_spawned))
			ert_antag = new ertemplate.leader_role ()
			earmarked_leader = null
			leader_spawned = TRUE
		else
			ert_antag = ertemplate.roles[WRAP(numagents,1,length(ertemplate.roles) + 1)]
			ert_antag = new ert_antag ()
		ert_antag.random_names = ertemplate.random_names

		ert_operative.mind.add_antag_datum(ert_antag,ert_team)
		ert_operative.mind.set_assigned_role(SSjob.get_job_type(ert_antag.ert_job_path))

		ert_operative.log_message("has been selected as \a [ert_antag.name].", LOG_GAME)
		numagents--

	if(ertemplate.opendoors)
		for(var/obj/machinery/door/poddoor/ert/door as anything in SSmachines.get_machines_by_type_and_subtypes(/obj/machinery/door/poddoor/ert))
			door.open()
			CHECK_TICK

	message_admins("[key_name_admin(user)] created a CentCom response team.")
	message_admins("[capitalize(ertemplate.polldesc)] has spawned with the mission: [ertemplate.mission]")
	return TRUE

#undef ERT_EXPERIENCED_LEADER_CHOOSE_TOP
#undef ERT_MAX_TEAMSIZE
#undef ERT_MAX_TEXT_LENGTH
#undef ERT_PREVIEW_SLOT
