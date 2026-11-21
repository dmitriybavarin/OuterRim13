/obj/item/tourniquet
	name = "tourniquet"
	desc = "A medical device used to stop severe bleeding from a limb."
	icon = 'icons/obj/medical/firstaid.dmi'
	icon_state = "tourniquet"

	w_class = WEIGHT_CLASS_SMALL
	resistance_flags = FLAMMABLE
	max_integrity = 50
	item_flags = NOBLUDGEON
	custom_premium_price = PAYCHECK_CREW * 2

/obj/item/tourniquet/Initialize(mapload)
	. = ..()
	AddComponent( \
		/datum/component/limb_applicable, \
		valid_zones = GLOB.limb_zones.Copy() + BODY_ZONE_HEAD, \
		apply_category = LIMB_ITEM_TOURNIQUET, \
		do_apply = CALLBACK(src, PROC_REF(do_apply_tourniquet)), \
	)
	RegisterSignal(src, COMSIG_ITEM_APPLIED_TO_LIMB, PROC_REF(on_applied_to_limb))
	RegisterSignal(src, COMSIG_ITEM_UNAPPLIED_FROM_LIMB, PROC_REF(on_removed_from_limb))

/obj/item/tourniquet/Destroy()
	STOP_PROCESSING(SSobj, src)
	return ..()

/obj/item/tourniquet/suicide_act(mob/living/user)
	user.visible_message(span_suicide(loc_key("item-tourniquet-suicide", list(user = user, item = src, their = p_their(), theyre = user.p_theyre()))))
	if(!do_after(user, 5 SECONDS, user))
		return SHAME
	var/obj/item/bodypart/head = user.get_bodypart(BODY_ZONE_HEAD)
	if(!head || !head.dismember())
		return SHAME
	return OXYLOSS

/obj/item/tourniquet/proc/on_applied_to_limb(datum/source, obj/item/bodypart/limb)
	SIGNAL_HANDLER
	limb.refresh_bleed_rate()
	switch(limb.body_zone)
		if(BODY_ZONE_L_ARM, BODY_ZONE_R_ARM)
			var/obj/item/bodypart/arm/arm = limb
			arm.set_speed_modifiers(arm.interaction_modifier + 0.5, arm.click_cd_modifier + 0.5)
		if(BODY_ZONE_L_LEG, BODY_ZONE_R_LEG)
			var/obj/item/bodypart/leg/leg = limb
			leg.set_speed_modifier(leg.speed_modifier + 0.5)
		if(BODY_ZONE_HEAD)
			START_PROCESSING(SSobj, src)

/obj/item/tourniquet/proc/on_removed_from_limb(datum/source, obj/item/bodypart/limb)
	SIGNAL_HANDLER
	limb.refresh_bleed_rate()
	switch(limb.body_zone)
		if(BODY_ZONE_L_ARM, BODY_ZONE_R_ARM)
			var/obj/item/bodypart/arm/arm = limb
			arm.set_speed_modifiers(arm.interaction_modifier - 0.5, arm.click_cd_modifier - 0.5)
		if(BODY_ZONE_L_LEG, BODY_ZONE_R_LEG)
			var/obj/item/bodypart/leg/leg = limb
			leg.set_speed_modifier(leg.speed_modifier - 0.5)
		if(BODY_ZONE_HEAD)
			START_PROCESSING(SSobj, src)

/obj/item/tourniquet/process(seconds_per_tick)
	var/obj/item/bodypart/limb = loc
	if(!istype(limb) || isnull(limb.owner))
		return PROCESS_KILL
	if(HAS_TRAIT(limb.owner, TRAIT_NOBREATH))
		return // you win this time

	limb.owner.losebreath += 1 * seconds_per_tick // incapable of breathing
	limb.owner.apply_damage(1 * seconds_per_tick, OXY, BODY_ZONE_HEAD) // no blood getting to brain
	if(SPT_PROB(6, seconds_per_tick))
		limb.owner.apply_damage(10, STAMINA, BODY_ZONE_HEAD)
	if(SPT_PROB(5, seconds_per_tick))
		limb.owner.adjust_eye_blur(4 SECONDS)
	if(SPT_PROB(4, seconds_per_tick))
		limb.owner.adjust_dizzy(4 SECONDS)
		limb.owner.adjust_confusion(2 SECONDS)

/obj/item/tourniquet/proc/do_apply_tourniquet(mob/user, mob/living/patient, obj/item/bodypart/limb)
	var/speed_multiplier = 2
	var/speed_boosted = FALSE
	var/zone_text = loc_lookup("item-tourniquet-zone", limb.plaintext_zone)
	for(var/datum/wound/woundies as anything in limb.wounds)
		if(!woundies.blood_flow)
			continue
		if(HAS_TRAIT(woundies, TRAIT_WOUND_SCANNED) && limb.body_zone != BODY_ZONE_HEAD)
			speed_multiplier = 0.5
			speed_boosted = TRUE
			break
		speed_multiplier = 1

	if(limb.body_zone == BODY_ZONE_HEAD)
		speed_multiplier *= 2 // are you sure about that?

	else if(user != patient)
		speed_multiplier *= 0.5

	if(limb.body_zone == BODY_ZONE_HEAD)
		user.visible_message(
			span_warning((user == patient ? loc_key("item-tourniquet-neck-self-others", list(user = user, item = src, their = p_their(), patient = patient)) : loc_key("item-tourniquet-neck-other-others", list(user = user, item = src, their = p_their(), patient = patient)))),
			span_userdanger((user == patient ? loc_key("item-tourniquet-neck-self-user", list(item = src, patient = patient)) : loc_key("item-tourniquet-neck-other-user", list(item = src, patient = patient)))),
			visible_message_flags = ALWAYS_SHOW_SELF_MESSAGE,
			ignored_mobs = patient,
		)
		if(user != patient)
			patient.show_message(
				span_userdanger(loc_key("item-tourniquet-neck-patient-seen", list(user = user, item = src))),
				MSG_VISUAL,
				span_userdanger(loc_key("item-tourniquet-neck-patient-felt", list(user = user))),
			)

	else if(speed_boosted)
		user.visible_message(
			span_notice((user == patient ? loc_key("item-tourniquet-expert-self-others", list(user = user, item = src, their = p_their(), patient = patient, zone = zone_text)) : loc_key("item-tourniquet-expert-other-others", list(user = user, item = src, their = p_their(), patient = patient, zone = zone_text)))),
			span_notice((user == patient ? loc_key("item-tourniquet-expert-self-user", list(item = src, patient = patient, zone = zone_text)) : loc_key("item-tourniquet-expert-other-user", list(item = src, patient = patient, zone = zone_text)))),
			visible_message_flags = ALWAYS_SHOW_SELF_MESSAGE,
			ignored_mobs = patient,
		)
		if(user != patient)
			patient.show_message(
				span_notice(loc_key("item-tourniquet-expert-patient-seen", list(user = user, item = src, zone = zone_text))),
				MSG_VISUAL,
				span_notice(loc_key("item-tourniquet-expert-patient-felt", list(user = user, zone = zone_text))),
			)

	else
		user.visible_message(
			span_warning((user == patient ? loc_key("item-tourniquet-apply-self-others", list(user = user, item = src, their = p_their(), patient = patient, zone = zone_text)) : loc_key("item-tourniquet-apply-other-others", list(user = user, item = src, their = p_their(), patient = patient, zone = zone_text)))),
			span_warning((user == patient ? loc_key("item-tourniquet-apply-self-user", list(item = src, patient = patient, zone = zone_text)) : loc_key("item-tourniquet-apply-other-user", list(item = src, patient = patient, zone = zone_text)))),
			visible_message_flags = ALWAYS_SHOW_SELF_MESSAGE,
			ignored_mobs = patient,
		)
		if(user != patient)
			patient.show_message(
				span_warning(loc_key("item-tourniquet-apply-patient-seen", list(user = user, item = src, zone = zone_text))),
				MSG_VISUAL,
				span_warning(loc_key("item-tourniquet-apply-patient-felt", list(user = user, zone = zone_text))),
			)

	if(!do_after(user, 5 SECONDS * speed_multiplier, patient))
		return FALSE

	// pain from tight wrapping
	patient.apply_damage(5, BRUTE, limb, attacking_item = src)
	patient.apply_damage(20, STAMINA, limb, attacking_item = src)
	return TRUE
