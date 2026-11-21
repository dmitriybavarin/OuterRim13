/datum/job/nanotrasen_representative
	title = JOB_NANOTRASEN_REPRESENTATIVE
	description = "Представляйте интересы NanoTrasen на станции, проверяйте капитана и глав отделов и отчитывайтесь перед Центральным командованием."
	auto_deadmin_role_flags = DEADMIN_POSITION_HEAD
	faction = FACTION_STATION
	total_positions = 1
	spawn_positions = 1
	supervisors = "Центральное командование"
	req_admin_notify = 1
	minimal_player_age = 14
	config_tag = "NANOTRASEN_REPRESENTATIVE"

	outfit = /datum/outfit/job/nanotrasen_representative
	plasmaman_outfit = /datum/outfit/plasmaman/centcom_official

	paycheck = PAYCHECK_COMMAND
	paycheck_department = ACCOUNT_SRV

	mind_traits = list(HEAD_OF_STAFF_MIND_TRAITS)
	liver_traits = list(TRAIT_ROYAL_METABOLISM)

	display_order = JOB_DISPLAY_ORDER_NANOTRASEN_REPRESENTATIVE
	department_for_prefs = /datum/job_department/central_command
	departments_list = list(
		/datum/job_department/central_command,
	)

	job_flags = STATION_JOB_FLAGS | HEAD_OF_STAFF_JOB_FLAGS | JOB_ANTAG_PROTECTED
	rpg_title = "Royal Envoy"

	human_authority = JOB_AUTHORITY_HUMANS_ONLY

	voice_of_god_power = 1.4
	tgui_icon = FA_ICON_BUILDING

/datum/outfit/job/nanotrasen_representative
	name = "Nanotrasen Representative"
	jobtype = /datum/job/nanotrasen_representative

	id = /obj/item/card/id/advanced/centcom_black
	id_trim = /datum/id_trim/job/nanotrasen_representative
	uniform = /obj/item/clothing/under/rank/centcom/official
	backpack_contents = list(
		/obj/item/stamp/centcom = 1,
		/obj/item/clipboard = 1,
		)
	belt = /obj/item/modular_computer/pda/crew/heads
	ears = /obj/item/radio/headset/heads/captain/alt
	glasses = /obj/item/clothing/glasses/sunglasses
	gloves = /obj/item/clothing/gloves/color/black
	shoes = /obj/item/clothing/shoes/laceup
	l_pocket = /obj/item/pen

	backpack = /obj/item/storage/backpack
	satchel = /obj/item/storage/backpack/satchel
	duffelbag = /obj/item/storage/backpack/duffelbag
	messenger = /obj/item/storage/backpack/messenger

	implants = list(/obj/item/implant/mindshield)
