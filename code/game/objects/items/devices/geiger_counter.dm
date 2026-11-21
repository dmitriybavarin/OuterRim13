/obj/item/geiger_counter //DISCLAIMER: I know nothing about how real-life Geiger counters work. This will not be realistic. ~Xhuis
	name = "\improper Geiger counter"
	desc = "A handheld device used for detecting and measuring radiation pulses."
	icon = 'icons/obj/devices/scanner.dmi'
	icon_state = "geiger_off"
	inhand_icon_state = "multitool"
	worn_icon_state = "geiger_counter"
	lefthand_file = 'icons/mob/inhands/equipment/tools_lefthand.dmi'
	righthand_file = 'icons/mob/inhands/equipment/tools_righthand.dmi'
	w_class = WEIGHT_CLASS_SMALL
	slot_flags = ITEM_SLOT_BELT
	item_flags = NOBLUDGEON
	custom_materials = list(/datum/material/iron = SMALL_MATERIAL_AMOUNT * 1.5, /datum/material/glass = SMALL_MATERIAL_AMOUNT * 1.5)

	var/last_perceived_radiation_danger = null

	var/scanning = FALSE

/obj/item/geiger_counter/Initialize(mapload)
	. = ..()

	RegisterSignal(src, COMSIG_IN_RANGE_OF_IRRADIATION, PROC_REF(on_pre_potential_irradiation))

/obj/item/geiger_counter/examine(mob/user)
	. = ..()
	if(!scanning)
		return
	. += span_info(LOC_KEY("item-geiger-examine-clear"))
	switch(last_perceived_radiation_danger)
		if(null)
			. += span_notice(LOC_KEY("item-geiger-examine-safe"))
		if(PERCEIVED_RADIATION_DANGER_LOW)
			. += span_alert(LOC_KEY("item-geiger-examine-low"))
		if(PERCEIVED_RADIATION_DANGER_MEDIUM)
			. += span_warning(LOC_KEY("item-geiger-examine-medium"))
		if(PERCEIVED_RADIATION_DANGER_HIGH)
			. += span_danger(LOC_KEY("item-geiger-examine-high"))
		if(PERCEIVED_RADIATION_DANGER_EXTREME)
			. += span_suicide(LOC_KEY("item-geiger-examine-critical"))

/obj/item/geiger_counter/update_icon_state()
	if(!scanning)
		icon_state = "geiger_off"
		return ..()

	switch(last_perceived_radiation_danger)
		if(null)
			icon_state = "geiger_on_1"
		if(PERCEIVED_RADIATION_DANGER_LOW)
			icon_state = "geiger_on_2"
		if(PERCEIVED_RADIATION_DANGER_MEDIUM)
			icon_state = "geiger_on_3"
		if(PERCEIVED_RADIATION_DANGER_HIGH)
			icon_state = "geiger_on_4"
		if(PERCEIVED_RADIATION_DANGER_EXTREME)
			icon_state = "geiger_on_5"
	return ..()

/obj/item/geiger_counter/attack_self(mob/user)
	scanning = !scanning

	if (scanning)
		AddComponent(/datum/component/geiger_sound)
	else
		qdel(GetComponent(/datum/component/geiger_sound))

	update_appearance(UPDATE_ICON)
	balloon_alert(user, scanning ? LOC_KEY("item-geiger-switch-on") : LOC_KEY("item-geiger-switch-off"))

/obj/item/geiger_counter/interact_with_atom(atom/interacting_with, mob/living/user, list/modifiers)
	if(SHOULD_SKIP_INTERACTION(interacting_with, src, user))
		return NONE
	return ranged_interact_with_atom(interacting_with, user, modifiers)

/obj/item/geiger_counter/ranged_interact_with_atom(atom/interacting_with, mob/living/user, list/modifiers)
	if(!CAN_IRRADIATE(interacting_with))
		return NONE

	user.visible_message(span_notice(loc_key("item-geiger-scan-others", list(user = user, target = interacting_with, item = src))), span_notice(loc_key("item-geiger-scan-self", list(target = interacting_with, item = src))))
	addtimer(CALLBACK(src, PROC_REF(scan), interacting_with, user), 20, TIMER_UNIQUE) // Let's not have spamming GetAllContents
	return ITEM_INTERACT_SUCCESS

/obj/item/geiger_counter/equipped(mob/user, slot, initial)
	. = ..()

	RegisterSignal(user, COMSIG_IN_RANGE_OF_IRRADIATION, PROC_REF(on_pre_potential_irradiation))

/obj/item/geiger_counter/dropped(mob/user, silent = FALSE)
	. = ..()

	UnregisterSignal(user, COMSIG_IN_RANGE_OF_IRRADIATION)

/obj/item/geiger_counter/proc/on_pre_potential_irradiation(datum/source, datum/radiation_pulse_information/pulse_information, insulation_to_target)
	SIGNAL_HANDLER

	last_perceived_radiation_danger = get_perceived_radiation_danger(pulse_information, insulation_to_target)
	addtimer(CALLBACK(src, PROC_REF(reset_perceived_danger)), TIME_WITHOUT_RADIATION_BEFORE_RESET, TIMER_UNIQUE | TIMER_OVERRIDE)

	if (scanning)
		update_appearance(UPDATE_ICON)

/obj/item/geiger_counter/proc/reset_perceived_danger()
	last_perceived_radiation_danger = null
	if (scanning)
		update_appearance(UPDATE_ICON)

/obj/item/geiger_counter/proc/scan(atom/target, mob/user)
	if (SEND_SIGNAL(target, COMSIG_GEIGER_COUNTER_SCAN, user, src) & COMSIG_GEIGER_COUNTER_SCAN_SUCCESSFUL)
		return

	to_chat(user, span_notice("[icon2html(src, user)] [isliving(target) ? LOC_KEY("item-geiger-clean-subject") : LOC_KEY("item-geiger-clean-target")]"))

/obj/item/geiger_counter/click_alt(mob/living/user)
	if(!scanning)
		to_chat(user, span_warning(loc_key("item-geiger-reset-off", list(item = src))))
		return CLICK_ACTION_BLOCKING
	to_chat(user, span_notice(loc_key("item-geiger-reset-done", list(item = src))))
	last_perceived_radiation_danger = null
	update_appearance(UPDATE_ICON)
	return CLICK_ACTION_SUCCESS
