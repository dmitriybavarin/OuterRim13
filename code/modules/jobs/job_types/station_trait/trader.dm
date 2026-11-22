/datum/job/trader
	title = JOB_TRADER
	description = "Buy and sell goods aboard the station, haggle with the crew, and keep your own books."
	auto_deadmin_role_flags = DEADMIN_POSITION_SECURITY
	faction = FACTION_STATION
	total_positions = 0
	spawn_positions = 0
	supervisors = SUPERVISOR_QM
	exp_granted_type = EXP_TYPE_CREW
	config_tag = "TRADER"

	outfit = /datum/outfit/job/trader
	plasmaman_outfit = /datum/outfit/plasmaman/cargo

	paycheck = PAYCHECK_CREW
	paycheck_department = ACCOUNT_CAR

	display_order = JOB_DISPLAY_ORDER_TRADER
	departments_list = list(/datum/job_department/cargo)

	family_heirlooms = list(/obj/item/clipboard)

	mail_goodies = list(
		/obj/item/stack/spacecash/c200 = 10,
		/obj/item/stack/sheet/mineral/gold = 5,
	)
	rpg_title = "Merchant"
	allow_bureaucratic_error = FALSE
	job_flags = (STATION_JOB_FLAGS | STATION_TRAIT_JOB_FLAGS | JOB_ANTAG_PROTECTED) & ~JOB_REOPEN_ON_ROUNDSTART_LOSS
	tgui_icon = FA_ICON_COINS

/datum/job/trader/get_default_roundstart_spawn_point()
	for(var/obj/effect/landmark/start/spawn_point as anything in GLOB.start_landmarks_list)
		if(spawn_point.name != "Cargo Technician")
			continue
		. = spawn_point
		if(spawn_point.used)
			continue
		spawn_point.used = TRUE
		break
	if(!.)
		. = ..()
	if(!.)
		log_mapping("Job [title] ([type]) couldn't find a round start spawn point.")

/datum/outfit/job/trader
	name = "Trader"
	jobtype = /datum/job/trader

	id_trim = /datum/id_trim/job/trader
	backpack_contents = list(
		/obj/item/boxcutter = 1,
		/obj/item/stack/spacecash/c200 = 1,
	)
	uniform = /obj/item/clothing/under/rank/cargo/tech
	belt = /obj/item/modular_computer/pda/trader
	ears = /obj/item/radio/headset/headset_cargo
	l_hand = /obj/item/universal_scanner
