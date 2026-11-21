/datum/round_event_control/anomaly/anomaly_bluespace
	name = "Anomaly: Bluespace"
	typepath = /datum/round_event/anomaly/anomaly_bluespace

	max_occurrences = 1
	weight = 15
	description = "This anomaly randomly teleports all items and mobs in a large area."
	min_wizard_trigger_potency = 0
	max_wizard_trigger_potency = 2

/datum/round_event/anomaly/anomaly_bluespace
	start_when = ANOMALY_START_MEDIUM_TIME
	announce_when = ANOMALY_ANNOUNCE_MEDIUM_TIME
	anomaly_path = /obj/effect/anomaly/bluespace

/datum/round_event/anomaly/anomaly_bluespace/announce(fake)
	if(isnull(impact_area))
		impact_area = placer.findValidArea()
	priority_announce(loc_key("announcement-anomaly-bluespace-detected-text", list(area = impact_area.name)), LOC_KEY("announcement-anomaly-alert-title"))
