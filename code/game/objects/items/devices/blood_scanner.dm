///Pricks people with a big needle and gives the user a bunch of info about bloodtype, tox damage, other such stuff. if you fuck up it stabs the guy a bit.
/obj/item/blood_scanner
	name = "hemoanalytic scanner"
	icon = 'icons/obj/devices/scanner.dmi'
	icon_state = "bloodscanner"
	inhand_icon_state = "healthanalyzer"
	worn_icon_state = "healthanalyzer"
	lefthand_file = 'icons/mob/inhands/equipment/medical_lefthand.dmi'
	righthand_file = 'icons/mob/inhands/equipment/medical_righthand.dmi'
	desc = "This Me-Lo Tech branded medical device can detect abnormalities in blood flow or composition. There is a button on the side which scans the patient's blood for common medicines."
	obj_flags = CONDUCTS_ELECTRICITY
	item_flags = NOBLUDGEON
	slot_flags = ITEM_SLOT_BELT
	throwforce = 3
	w_class = WEIGHT_CLASS_TINY
	throw_speed = 3
	throw_range = 7
	custom_materials = list(/datum/material/iron = SMALL_MATERIAL_AMOUNT * 2, /datum/material/glass = SMALL_MATERIAL_AMOUNT * 0.5)

/obj/item/blood_scanner/interact_with_atom(atom/interacting_with, mob/living/user, list/modifiers)
	if(!usable_check(person_scanning = user, scanee = interacting_with))
		return NONE
	var/mob/living/carbon/poked_guy = interacting_with
	var/obj/item/bodypart/poked_bit = poked_guy.get_bodypart(check_zone(user.zone_selected))
	if(!poked_bit)
		return
	user.visible_message(span_notice(loc_key("item-blood-scanner-prick-others", list(user = user, target = poked_guy, item = src))), span_notice(loc_key("item-blood-scanner-prick-self", list(target = poked_guy, item = src))), ignored_mobs = poked_guy)
	to_chat(poked_guy, span_notice(loc_key("item-blood-scanner-prick-target", list(user = user, item = src, part = poked_bit))))
	var/success = do_after(user, 2 SECONDS, poked_guy)
	if(success)
		scan_blood(scanner = user, scanned_person = poked_guy)
	else
		if(prob(25))
			regret(stabber = user, stabbed = poked_guy, to_stab = poked_bit)
		return

	return ITEM_INTERACT_SUCCESS

/obj/item/blood_scanner/interact_with_atom_secondary(atom/interacting_with, mob/living/user, list/modifiers)
	if(!usable_check(person_scanning = user, scanee = interacting_with))
		return NONE
	var/mob/living/carbon/poked_guy = interacting_with
	var/obj/item/bodypart/poked_bit = poked_guy.get_bodypart(check_zone(user.zone_selected))
	user.visible_message(span_notice(loc_key("item-blood-scanner-prick-others", list(user = user, target = poked_guy, item = src))), span_notice(loc_key("item-blood-scanner-prick-self", list(target = poked_guy, item = src))), ignored_mobs = poked_guy)
	to_chat(poked_guy, span_notice(loc_key("item-blood-scanner-prick-target", list(user = user, item = src, part = poked_bit))))
	var/success = do_after(user, 2 SECONDS, poked_guy)
	if(success)
		chemscan(user, poked_guy, reagent_types_to_check = /datum/reagent/medicine)
	else
		if(prob(25))
			regret(stabber = user, stabbed = poked_guy, to_stab = poked_bit)
		return

	return ITEM_INTERACT_SUCCESS


/obj/item/blood_scanner/proc/scan_blood(mob/living/scanner, mob/living/carbon/scanned_person)
	var/render_list = list()
	var/oxy_loss = scanned_person.get_oxy_loss()
	var/tox_loss = scanned_person.get_tox_loss()
	render_list += span_info("[loc_key("item-blood-scanner-read", list(item = loc_entity(src, name)))]\n")
	render_list += "<span class='notice ml-1'>Blood Type: [scanned_person?.dna?.blood_type]</span>\n"
	if(oxy_loss > 50)//if they have knockout levels of suffocation damage
		render_list += "<span class='danger ml-1'>Warning: Hypoxic blood oxygen levels.</span>\n"
	if(scanned_person.get_blood_volume(apply_modifiers = TRUE) <= BLOOD_VOLUME_SAFE)
		render_list += "<span class='danger ml-1'>Warning: Dangerously low blood flow.</span>\n"
	if(tox_loss > 10)
		render_list += "<span class='danger ml-1'>Warning: Toxic buildup detected in bloodstream.</span>\n"
	if(scanned_person.has_status_effect(/datum/status_effect/eigenstasium))
		render_list += "<span class='danger ml-1'>Warning: Dimensional instability detected. Administer stabilizers.</span>\n"
	if(scanned_person.has_reagent(/datum/reagent/gold/cursed) || scanned_person.has_status_effect(/datum/status_effect/midas_blight))
		render_list += "<span class='danger ml-1'>Warning: Hemo-aurificating hexes present.</span>\n" //can it detect normal things? barely. But ancient greed-cursed magicks? Spot on.
	if(HAS_TRAIT_FROM(scanned_person, TRAIT_NODEATH, /datum/reagent/inverse/penthrite))
		render_list += "<span class='danger ml-1'>Warning: Frankensteinian revivification in progress.</span>\n" //patient is currently an immortal drug-zombie
	if(scanned_person.has_status_effect(/datum/status_effect/high_blood_pressure))
		render_list += "<span class='danger ml-1'>Warning: Dangerously high blood pressure.</span>\n"
	if(HAS_TRAIT(scanned_person, TRAIT_IMMUNODEFICIENCY))
		render_list += "<span class='danger ml-1'>Warning: Low immune cell concentration.</span>\n" //it doe
	to_chat(scanner, boxed_message(jointext(render_list, "")), type = MESSAGE_TYPE_INFO)

/obj/item/blood_scanner/proc/regret(mob/living/stabber, mob/living/stabbed, obj/item/bodypart/to_stab)
	to_stab?.force_wound_upwards(/datum/wound/pierce/bleed/moderate/needle_fail, wound_source = "idiot moved with a needle in them")
	stabber.visible_message(span_warning(loc_key("item-blood-scanner-rip-others", list(item = src, target = stabbed, part = to_stab))), span_warning(loc_key("item-blood-scanner-rip-self", list(their = stabbed.p_their(), part = to_stab))), ignored_mobs = stabbed)
	to_chat(stabbed, span_userdanger(loc_key("item-blood-scanner-rip-target", list(item = src, part = to_stab))))

/obj/item/blood_scanner/proc/usable_check(mob/living/person_scanning, atom/scanee)
	if(!isliving(scanee))
		return FALSE
	if(!istype(scanee, /mob/living/carbon))
		to_chat(person_scanning, span_warning(loc_key("item-blood-scanner-incompatible", list(item = src))))
		return FALSE
	if(!person_scanning.can_read(src) || person_scanning.is_blind())
		to_chat(person_scanning, span_warning(loc_key("item-blood-scanner-unreadable", list(item = src))))
		return FALSE
	return TRUE
