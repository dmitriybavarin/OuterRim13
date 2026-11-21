/datum/job/blueshield
	title = JOB_BLUESHIELD
	description = "Защищайте глав отделов и представителя NanoTrasen, подчиняйтесь Центральному командованию и берегите командный состав."
	auto_deadmin_role_flags = DEADMIN_POSITION_SECURITY
	faction = FACTION_STATION
	total_positions = 1
	spawn_positions = 1
	supervisors = "Центральное командование и представитель NanoTrasen"
	req_admin_notify = 1
	minimal_player_age = 14
	config_tag = "BLUESHIELD_OFFICER"

	outfit = /datum/outfit/job/blueshield
	plasmaman_outfit = /datum/outfit/plasmaman/security

	paycheck = PAYCHECK_COMMAND
	paycheck_department = ACCOUNT_SEC

	liver_traits = list(TRAIT_LAW_ENFORCEMENT_METABOLISM)

	display_order = JOB_DISPLAY_ORDER_BLUESHIELD
	department_for_prefs = /datum/job_department/central_command
	departments_list = list(
		/datum/job_department/central_command,
	)

	job_flags = STATION_JOB_FLAGS | JOB_ANTAG_PROTECTED
	rpg_title = "Royal Guard"

	human_authority = JOB_AUTHORITY_HUMANS_ONLY

	tgui_icon = FA_ICON_SHIELD_HALVED

/datum/outfit/job/blueshield
	name = "Blueshield Officer"
	jobtype = /datum/job/blueshield

	id_trim = /datum/id_trim/job/blueshield
	uniform = /obj/item/clothing/under/rank/security/officer
	suit = /obj/item/clothing/suit/armor/vest/alt/sec
	suit_store = /obj/item/gun/energy/disabler
	backpack_contents = list(
		/obj/item/evidencebag = 1,
		)
	belt = /obj/item/modular_computer/pda/crew/security
	ears = /obj/item/radio/headset/headset_sec/alt
	glasses = /obj/item/clothing/glasses/hud/security/sunglasses
	gloves = /obj/item/clothing/gloves/color/black/security
	head = /obj/item/clothing/head/helmet/sec
	shoes = /obj/item/clothing/shoes/jackboots/sec
	l_pocket = /obj/item/restraints/handcuffs
	r_pocket = /obj/item/assembly/flash/handheld

	backpack = /obj/item/storage/backpack/security
	satchel = /obj/item/storage/backpack/satchel/sec
	duffelbag = /obj/item/storage/backpack/duffelbag/sec
	messenger = /obj/item/storage/backpack/messenger/sec

	box = /obj/item/storage/box/survival/security
	implants = list(/obj/item/implant/mindshield)
