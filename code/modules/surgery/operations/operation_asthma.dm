/datum/surgery_operation/organ/asthmatic_bypass
	name = "force open windpipe"
	// google says the *actual* operation used to relieve asthma is called bronchial thermoplasty but this operation doesn't resemble that at all
	// local doctors suggested "bronchial dilatation" instead
	rnd_name = "Bronchial Dilatation (Asthmatic Bypass)"
	desc = "Forcibly expand a patient's windpipe, relieving asthma symptoms."
	operation_flags = OPERATION_PRIORITY_NEXT_STEP
	implements = list(
		TOOL_RETRACTOR = 1.25,
		TOOL_WIRECUTTER = 2.25,
	)
	time = 8 SECONDS
	preop_sound = 'sound/items/handling/surgery/retractor1.ogg'
	success_sound = 'sound/items/handling/surgery/retractor2.ogg'
	target_type = /obj/item/organ/lungs
	all_surgery_states_required = SURGERY_SKIN_OPEN|SURGERY_ORGANS_CUT
	/// The amount of inflammation a failure or success of this surgery will reduce.
	var/inflammation_reduction = 75

/datum/surgery_operation/organ/asthmatic_bypass/all_required_strings()
	return list("the patient must be asthmatic") + ..()

/datum/surgery_operation/organ/asthmatic_bypass/state_check(obj/item/organ/organ)
	if(!organ.owner.has_quirk(/datum/quirk/item_quirk/asthma))
		return FALSE
	return TRUE

/datum/surgery_operation/organ/asthmatic_bypass/on_preop(obj/item/organ/lungs/organ, mob/living/surgeon, obj/item/tool, list/operation_args)
	display_results(
		surgeon,
		organ.owner,
		span_notice(loc_key("surgery-operation_asthma-you_begin_to_stretch_organ_s", list(organ = organ.owner))),
		span_notice(loc_key("surgery-operation_asthma-surgeon_begins_to_stretch_organ_s", list(surgeon = surgeon, organ = organ.owner))),
		span_notice(loc_key("surgery-operation_asthma-surgeon_begins_to_stretch_organ_s_2", list(surgeon = surgeon, organ = organ.owner))),
	)
	display_pain(organ.owner, "You feel an agonizing stretching sensation in your neck!")

/datum/surgery_operation/organ/asthmatic_bypass/on_success(obj/item/organ/lungs/organ, mob/living/surgeon, obj/item/tool, list/operation_args)
	var/datum/quirk/item_quirk/asthma/asthma = organ.owner.get_quirk(/datum/quirk/item_quirk/asthma)
	if(isnull(asthma))
		return

	asthma.adjust_inflammation(-inflammation_reduction)

	display_results(
		surgeon,
		organ.owner,
		span_notice(loc_key("surgery-operation_asthma-you_stretch_organ_s_windpipe_with", list(organ = organ.owner, tool = tool))),
		span_notice(loc_key("surgery-operation_asthma-surgeon_succeeds_at_stretching_organ_s", list(surgeon = surgeon, organ = organ.owner, tool = tool))),
		span_notice(loc_key("surgery-operation_asthma-surgeon_finishes_stretching_organ_s_windpipe", list(surgeon = surgeon, organ = organ.owner)))
	)

/datum/surgery_operation/organ/asthmatic_bypass/on_failure(obj/item/organ/lungs/organ, mob/living/surgeon, obj/item/tool, list/operation_args)
	var/datum/quirk/item_quirk/asthma/asthma = organ.owner.get_quirk(/datum/quirk/item_quirk/asthma)
	if(isnull(asthma))
		return

	asthma.adjust_inflammation(-inflammation_reduction)

	display_results(
		surgeon,
		organ.owner,
		span_warning(loc_key("surgery-operation_asthma-you_stretch_organ_s_windpipe_with_2", list(organ = organ.owner, tool = tool))),
		span_warning(loc_key("surgery-operation_asthma-surgeon_succeeds_at_stretching_organ_s_2", list(surgeon = surgeon, organ = organ.owner, tool = tool))),
		span_warning(loc_key("surgery-operation_asthma-surgeon_finishes_stretching_organ_s_windpipe_2", list(surgeon = surgeon, organ = organ.owner))),
	)

	organ.owner.losebreath++

	if(prob(30))
		organ.owner.cause_wound_of_type_and_severity(WOUND_SLASH, organ.bodypart_owner, WOUND_SEVERITY_MODERATE, WOUND_SEVERITY_CRITICAL, WOUND_PICK_LOWEST_SEVERITY, tool)
	organ.bodypart_owner.receive_damage(brute = 10, wound_bonus = tool.wound_bonus, sharpness = SHARP_EDGED, damage_source = tool)
