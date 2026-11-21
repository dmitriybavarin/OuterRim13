/datum/round_event_control/anomaly/anomaly_flux
	name = "Anomaly: Hyper-Energetic Flux"
	typepath = /datum/round_event/anomaly/anomaly_flux

	min_players = 10
	max_occurrences = 5
	weight = 20
	description = "This anomaly shocks and explodes."
	min_wizard_trigger_potency = 1
	max_wizard_trigger_potency = 4

/datum/round_event/anomaly/anomaly_flux
	start_when = ANOMALY_START_DANGEROUS_TIME
	announce_when = ANOMALY_ANNOUNCE_DANGEROUS_TIME
	anomaly_path = /obj/effect/anomaly/flux

/datum/round_event/anomaly/anomaly_flux/announce(fake)
	if(isnull(impact_area))
		impact_area = placer.findValidArea()
	priority_announce(loc_key("announcement-anomaly-hyper-flux-text", list(area = impact_area.name)), LOC_KEY("announcement-anomaly-alert-title"))
