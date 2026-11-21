/obj/item/scanner_wand
	name = "kiosk scanner wand"
	icon = 'icons/obj/devices/scanner.dmi'
	icon_state = "scanner_wand"
	inhand_icon_state = "healthanalyzer"
	icon_angle = -45
	lefthand_file = 'icons/mob/inhands/equipment/medical_lefthand.dmi'
	righthand_file = 'icons/mob/inhands/equipment/medical_righthand.dmi'
	desc = "A wand that medically scans people. Inserting it into a medical kiosk makes it able to perform a health scan on the patient."
	force = 0
	throwforce = 0
	w_class = WEIGHT_CLASS_BULKY
	var/selected_target = null

/obj/item/scanner_wand/attack(mob/living/M, mob/living/carbon/human/user)
	flick("[icon_state]_active", src) //nice little visual flash when scanning someone else.

	if((HAS_TRAIT(user, TRAIT_CLUMSY) || HAS_TRAIT(user, TRAIT_DUMB)) && prob(25))
		user.visible_message(span_warning(loc_key("item-scanner-wand-self-others", list(user = user))), \
		to_chat(user, span_info(loc_key("item-scanner-wand-self-self", list(target = M)))))
		selected_target = user
		return

	if(!ishuman(M))
		to_chat(user, span_info(LOC_KEY("item-scanner-wand-invalid")))
		selected_target = null
		return

	user.visible_message(span_notice(loc_key("item-scanner-wand-target-others", list(user = user, target = M))), \
						span_notice(loc_key("item-scanner-wand-target-self", list(target = M))))
	selected_target = M
	return

/obj/item/scanner_wand/attack_self(mob/user)
	to_chat(user, span_info(LOC_KEY("item-scanner-wand-clear")))
	selected_target = null

/obj/item/scanner_wand/proc/return_patient()
	var/returned_target = selected_target
	return returned_target
