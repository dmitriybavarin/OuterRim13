/datum/round_event_control/anomaly/anomaly_hallucination
	name = "Anomaly: Hallucination"
	typepath = /datum/round_event/anomaly/anomaly_hallucination

	min_players = 10
	max_occurrences = 5
	weight = 20
	description = "This anomaly causes you to hallucinate."
	min_wizard_trigger_potency = 0
	max_wizard_trigger_potency = 2

/datum/round_event/anomaly/anomaly_hallucination
	start_when = ANOMALY_START_MEDIUM_TIME
	announce_when = ANOMALY_ANNOUNCE_MEDIUM_TIME
	anomaly_path = /obj/effect/anomaly/hallucination

/datum/round_event/anomaly/anomaly_hallucination/announce(fake)
	if(isnull(impact_area))
		impact_area = placer.findValidArea()
	priority_announce(loc_key("announcement-anomaly-hallucination-text", list(area = impact_area.name)), LOC_KEY("announcement-anomaly-alert-title"))
