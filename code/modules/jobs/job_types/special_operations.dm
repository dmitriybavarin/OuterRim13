/datum/job/special_ops_director
	title = JOB_SPECIAL_OPS_DIRECTOR
	description = "Руководите специальными операциями Центрального командования, координируйте офицеров специальных операций и отвечайте только перед Центральным командованием."
	auto_deadmin_role_flags = DEADMIN_POSITION_HEAD|DEADMIN_POSITION_SECURITY
	faction = FACTION_STATION
	total_positions = 1
	spawn_positions = 1
	supervisors = "Центральное командование"
	req_admin_notify = 1
	minimal_player_age = 14
	config_tag = "SPECIAL_OPS_DIRECTOR"

	outfit = /datum/outfit/job/special_ops_director
	plasmaman_outfit = /datum/outfit/plasmaman/centcom_commander

	paycheck = PAYCHECK_COMMAND
	paycheck_department = ACCOUNT_SEC

	mind_traits = list(HEAD_OF_STAFF_MIND_TRAITS)
	liver_traits = list(TRAIT_ROYAL_METABOLISM)

	display_order = JOB_DISPLAY_ORDER_SPECIAL_OPS_DIRECTOR
	department_for_prefs = /datum/job_department/central_command
	departments_list = list(
		/datum/job_department/central_command,
	)

	job_flags = STATION_JOB_FLAGS | HEAD_OF_STAFF_JOB_FLAGS | JOB_ANTAG_PROTECTED
	rpg_title = "Warlord"

	human_authority = JOB_AUTHORITY_HUMANS_ONLY

	voice_of_god_power = 1.4
	tgui_icon = FA_ICON_CROWN

/datum/outfit/job/special_ops_director
	name = "Special Operations Director"
	jobtype = /datum/job/special_ops_director

	id = /obj/item/card/id/advanced/centcom
	id_trim = /datum/id_trim/job/special_ops_director
	uniform = /obj/item/clothing/under/rank/centcom/commander
	suit = /obj/item/clothing/suit/armor/centcom_formal
	head = /obj/item/clothing/head/hats/centcom_cap
	belt = /obj/item/modular_computer/pda/crew/heads
	ears = /obj/item/radio/headset/headset_cent/alt
	glasses = /obj/item/clothing/glasses/hud/security/sunglasses
	gloves = /obj/item/clothing/gloves/combat
	shoes = /obj/item/clothing/shoes/combat
	l_pocket = /obj/item/pen
	r_pocket = /obj/item/restraints/handcuffs
	suit_store = /obj/item/gun/energy/e_gun
	backpack_contents = list(
		/obj/item/stamp/centcom = 1,
		/obj/item/melee/baton/security/loaded = 1,
		)

	backpack = /obj/item/storage/backpack/ert
	satchel = /obj/item/storage/backpack/ert
	duffelbag = /obj/item/storage/backpack/ert
	messenger = /obj/item/storage/backpack/ert

	box = /obj/item/storage/box/survival/centcom
	implants = list(/obj/item/implant/mindshield)

/datum/job/special_ops_officer
	title = JOB_SPECIAL_OPS_OFFICER
	description = "Выполняйте особые задачи Центрального командования на станции, подчиняйтесь директору специальных операций и действуйте по его приказам."
	auto_deadmin_role_flags = DEADMIN_POSITION_SECURITY
	faction = FACTION_STATION
	total_positions = 1
	spawn_positions = 1
	supervisors = "Директор специальных операций и Центральное командование"
	req_admin_notify = 1
	minimal_player_age = 14
	config_tag = "SPECIAL_OPS_OFFICER"

	outfit = /datum/outfit/job/special_ops_officer
	plasmaman_outfit = /datum/outfit/plasmaman/centcom_official

	paycheck = PAYCHECK_COMMAND
	paycheck_department = ACCOUNT_SEC

	liver_traits = list(TRAIT_LAW_ENFORCEMENT_METABOLISM)

	display_order = JOB_DISPLAY_ORDER_SPECIAL_OPS_OFFICER
	department_for_prefs = /datum/job_department/central_command
	departments_list = list(
		/datum/job_department/central_command,
	)

	job_flags = STATION_JOB_FLAGS | JOB_ANTAG_PROTECTED
	rpg_title = "Royal Guard"

	human_authority = JOB_AUTHORITY_HUMANS_ONLY

	tgui_icon = FA_ICON_USER_SHIELD

/datum/outfit/job/special_ops_officer
	name = "Special Operations Officer"
	jobtype = /datum/job/special_ops_officer

	id = /obj/item/card/id/advanced/centcom
	id_trim = /datum/id_trim/job/special_ops_officer
	uniform = /obj/item/clothing/under/rank/centcom/military
	suit = /obj/item/clothing/suit/armor/vest/marine
	suit_store = /obj/item/gun/energy/e_gun
	head = /obj/item/clothing/head/helmet/swat
	belt = /obj/item/modular_computer/pda/crew/security
	ears = /obj/item/radio/headset/headset_cent/alt
	glasses = /obj/item/clothing/glasses/hud/security/sunglasses
	gloves = /obj/item/clothing/gloves/combat
	shoes = /obj/item/clothing/shoes/combat
	l_pocket = /obj/item/restraints/handcuffs
	r_pocket = /obj/item/assembly/flash/handheld
	backpack_contents = list(
		/obj/item/melee/baton/security/loaded = 1,
		)

	backpack = /obj/item/storage/backpack/ert
	satchel = /obj/item/storage/backpack/ert
	duffelbag = /obj/item/storage/backpack/ert
	messenger = /obj/item/storage/backpack/ert

	box = /obj/item/storage/box/survival/centcom
	implants = list(/obj/item/implant/mindshield)

/proc/get_centcom_spawn_turf()
	var/list/candidates = list()
	for(var/area_type in list(/area/centcom/central_command_areas/control, /area/centcom/central_command_areas/admin, /area/centcom/central_command_areas/briefing))
		for(var/turf/open/candidate in get_area_turfs(area_type))
			if(!candidate.is_blocked_turf())
				candidates += candidate
		if(length(candidates))
			break
	return length(candidates) ? pick(candidates) : null

/datum/job/special_ops_director/get_roundstart_spawn_point()
	return get_centcom_spawn_turf() || ..()

/datum/job/special_ops_director/get_latejoin_spawn_point()
	return get_centcom_spawn_turf() || ..()

/datum/job/special_ops_officer/get_roundstart_spawn_point()
	return get_centcom_spawn_turf() || ..()

/datum/job/special_ops_officer/get_latejoin_spawn_point()
	return get_centcom_spawn_turf() || ..()
