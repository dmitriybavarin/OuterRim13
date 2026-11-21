/// Adds a newline to the examine list if the above entry is not empty and it is not the first element in the list
#define ADD_NEWLINE_IF_NECESSARY(list) if(length(list) > 0 && list[length(list)]) { list += "" }

/mob/living/carbon/human/get_examine_icon(mob/user)
	return null

/mob/living/carbon/examine(mob/user)
	if(HAS_TRAIT(src, TRAIT_UNKNOWN_APPEARANCE) && !isobserver(user))
		return list(span_warning(LOC_KEY("mob-examine-you_re_struggling_to_make_out")))

	var/visible_gender = get_visible_gender()
	var/list/gender_args = list(gender = visible_gender)

	. = list()
	. += get_clothing_examine_info(user)
	// give us some space between clothing examine and the rest
	ADD_NEWLINE_IF_NECESSARY(.)

	var/appears_dead = FALSE
	var/just_sleeping = FALSE

	if(IS_DEAD_OR_FAKING(src))
		appears_dead = TRUE

		var/obj/item/clothing/glasses/shades = get_item_by_slot(ITEM_SLOT_EYES)
		var/are_we_in_weekend_at_bernies = shades?.tint && buckled && istype(buckled, /obj/vehicle/ridden/wheelchair)

		if(isliving(user) && (HAS_MIND_TRAIT(user, TRAIT_NAIVE) || are_we_in_weekend_at_bernies))
			just_sleeping = TRUE

		if(!just_sleeping)
			// since this is relatively important and giving it space makes it easier to read
			ADD_NEWLINE_IF_NECESSARY(.)
			if(HAS_TRAIT(src, TRAIT_SUICIDED))
				. += span_warning(loc_key("examine-body-suicide", gender_args))

			. += generate_death_examine_text()

	//Status effects
	var/list/status_examines = get_status_effect_examinations(user)
	if (length(status_examines))
		. += status_examines

	if(get_bodypart(BODY_ZONE_HEAD) && !get_organ_by_type(/obj/item/organ/brain))
		. += span_deadsay(loc_key("examine-body-brain-missing", gender_args))

	var/list/disabled = list()
	for(var/obj/item/bodypart/body_part as anything in get_bodyparts())
		if(body_part.bodypart_disabled)
			disabled += body_part

		var/treatment_distance = isliving(user) && get_dist(src, user) <= CARBON_EXAMINE_EMBEDDING_MAX_DIST
		for(var/obj/item/embedded as anything in body_part.embedded_objects)
			if(embedded.get_embed().stealthy_embed)
				continue
			var/harmless = embedded.get_embed().is_harmless()
			var/embed_line = loc_entity(embedded, "\a [embedded]")
			if (treatment_distance)
				embed_line = "<a href='byond://?src=[REF(src)];embedded_object=[REF(embedded)];embedded_limb=[REF(body_part)]'>[embed_line]</a>"
			var/embed_text = loc_key("examine-body-embedded-[harmless ? "stuck" : "in"]", list(gender = visible_gender, icon = icon2html(embedded, user), item = embed_line, zone = loc_zone(body_part.plaintext_zone)))
			if (harmless)
				. += span_italics(span_notice(embed_text))
			else
				. += span_boldwarning(embed_text)

		var/obj/item/tourniquet/current_tourniquet = LAZYACCESS(body_part.applied_items, LIMB_ITEM_TOURNIQUET)
		if(current_tourniquet)
			var/tourniquet_href = loc_entity(current_tourniquet, "\a [current_tourniquet]")
			if(treatment_distance)
				tourniquet_href = "<a href='byond://?src=[REF(src)];remove_tourniquet=[REF(body_part)]'>[tourniquet_href]</a>"
			var/tourniquet_msg = loc_key("examine-body-tourniquet", list(gender = visible_gender, icon = icon2html(current_tourniquet, user), item = tourniquet_href, zone = loc_zone(body_part.body_zone == BODY_ZONE_HEAD ? "neck" : body_part.plaintext_zone)))
			if(body_part.body_zone == BODY_ZONE_HEAD)
				. += span_boldwarning(tourniquet_msg)
			else
				. += span_notice(tourniquet_msg)

		var/obj/item/stack/medical/wrap/current_gauze = LAZYACCESS(body_part.applied_items, LIMB_ITEM_GAUZE)
		if(current_gauze)
			var/gauze_href = loc_entity(current_gauze, current_gauze.name)
			if(treatment_distance) // only shows the href if we're adjacent
				gauze_href = "<a href='byond://?src=[REF(src)];gauze_limb=[REF(body_part)]'>[gauze_href]</a>"
			. += span_notice(loc_key("examine-body-gauze", list(gender = visible_gender, icon = icon2html(current_gauze, user), item = gauze_href, zone = loc_zone(body_part.plaintext_zone))))

		for(var/datum/wound/iter_wound as anything in body_part.wounds)
			if(isnull(iter_wound.examine_desc))
				continue
			. += span_danger(iter_wound.get_examine_description(user))

		var/surgery_examine = body_part.get_surgery_examine()
		if(surgery_examine)
			. += surgery_examine


	for(var/obj/item/bodypart/body_part as anything in disabled)
		var/damage_text
		if(HAS_TRAIT(body_part, TRAIT_DISABLED_BY_WOUND))
			continue // skip if it's disabled by a wound (cuz we'll be able to see the bone sticking out!)
		if(body_part.get_damage() < body_part.max_damage) //we don't care if it's stamcritted
			damage_text = "limp and lifeless"
		else
			damage_text = (body_part.brute_dam >= body_part.burn_dam) ? body_part.heavy_brute_msg : body_part.heavy_burn_msg
		. += span_boldwarning(loc_key("examine-body-limb-looks", list(gender = visible_gender, zone = loc_zone(body_part.plaintext_zone), state = loc_lookup("examine-damage-state", damage_text))))

	//stores missing limbs
	var/l_limbs_missing = 0
	var/r_limbs_missing = 0
	for(var/missing_limb in get_missing_limbs())
		if(missing_limb == BODY_ZONE_HEAD)
			. += span_deadsay("<B>[loc_key("examine-body-limb-missing", list(gender = visible_gender, zone = loc_zone(parse_zone(missing_limb))))]</B>")
			continue
		if(missing_limb == BODY_ZONE_L_ARM || missing_limb == BODY_ZONE_L_LEG)
			l_limbs_missing++
		else if(missing_limb == BODY_ZONE_R_ARM || missing_limb == BODY_ZONE_R_LEG)
			r_limbs_missing++

		. += span_boldwarning(loc_key("examine-body-limb-missing", list(gender = visible_gender, zone = loc_zone(parse_zone(missing_limb)))))

	if(l_limbs_missing >= 2 && r_limbs_missing == 0)
		. += span_tinydanger(loc_key("examine-body-limbs-left", gender_args))
	else if(l_limbs_missing == 0 && r_limbs_missing >= 2)
		. += span_tinydanger(loc_key("examine-body-limbs-right", gender_args))
	else if(l_limbs_missing >= 2 && r_limbs_missing >= 2)
		. += span_tinydanger(loc_key("examine-body-limbs-all", gender_args))

	if(!(user == src && has_status_effect(/datum/status_effect/grouped/screwy_hud/fake_healthy))) //fake healthy
		var/temp
		if(user == src && has_status_effect(/datum/status_effect/grouped/screwy_hud/fake_crit))//fake damage
			temp = 50
		else
			temp = get_brute_loss()
		var/list/damage_desc = get_majority_bodypart_damage_desc()
		var/brute_desc = loc_lookup("examine-damage-type", damage_desc[BRUTE])
		var/burn_desc = loc_lookup("examine-damage-type", damage_desc[BURN])
		if(temp)
			if(temp < 25)
				. += span_danger(loc_key("examine-body-damage-minor", list(gender = visible_gender, damage = brute_desc)))
			else if(temp < 50)
				. += span_danger(loc_key("examine-body-damage-moderate", list(gender = visible_gender, damage = brute_desc)))
			else
				. += span_bolddanger(loc_key("examine-body-damage-severe", list(gender = visible_gender, damage = brute_desc)))

		temp = get_fire_loss()
		if(temp)
			if(temp < 25)
				. += span_danger(loc_key("examine-body-damage-minor", list(gender = visible_gender, damage = burn_desc)))
			else if (temp < 50)
				. += span_danger(loc_key("examine-body-damage-moderate", list(gender = visible_gender, damage = burn_desc)))
			else
				. += span_bolddanger(loc_key("examine-body-damage-severe", list(gender = visible_gender, damage = burn_desc)))

	if(pulledby?.grab_state)
		. += span_warning(loc_key("examine-body-grabbed", list(gender = visible_gender, pulledby = pulledby)))

	if(nutrition < NUTRITION_LEVEL_STARVING - 50)
		. += span_warning(loc_key("examine-body-malnourished", gender_args))
	else if(nutrition >= NUTRITION_LEVEL_FAT)
		if(user.nutrition < NUTRITION_LEVEL_STARVING - 50)
			. += span_hypnophrase(loc_key("examine-body-plump", gender_args))
		else
			. += "<b>[loc_key("examine-body-chubby", gender_args)]</b>"
	switch(disgust)
		if(DISGUST_LEVEL_GROSS to DISGUST_LEVEL_VERYGROSS)
			. += loc_key("examine-body-disgust-mild", gender_args)
		if(DISGUST_LEVEL_VERYGROSS to DISGUST_LEVEL_DISGUSTED)
			. += loc_key("examine-body-disgust-strong", gender_args)
		if(DISGUST_LEVEL_DISGUSTED to INFINITY)
			. += loc_key("examine-body-disgust-extreme", gender_args)

	var/apparent_blood_volume = CAN_HAVE_BLOOD(src) ? get_blood_volume(apply_modifiers = TRUE) : BLOOD_VOLUME_NORMAL
	if(HAS_TRAIT(src, TRAIT_USES_SKINTONES) && ishuman(src))
		var/mob/living/carbon/human/husrc = src // gross istypesrc but easier than refactoring even further for now
		if(husrc.skin_tone == "albino")
			apparent_blood_volume -= (BLOOD_VOLUME_NORMAL * 0.25) // knocks you down a few pegs
	switch(apparent_blood_volume)
		if(BLOOD_VOLUME_OKAY to BLOOD_VOLUME_SAFE)
			. += span_warning(loc_key("examine-body-skin-pale", gender_args))
		if(BLOOD_VOLUME_BAD to BLOOD_VOLUME_OKAY)
			. += span_boldwarning(loc_key("examine-body-skin-deathly", gender_args))
		if(-INFINITY to BLOOD_VOLUME_BAD)
			. += span_deadsay("<b>[loc_key("examine-body-skin-drained", gender_args)]</b>")

	if(is_bleeding())
		var/list/obj/item/bodypart/bleeding_limbs = list()
		var/list/obj/item/bodypart/grasped_limbs = list()

		for(var/obj/item/bodypart/body_part as anything in get_bodyparts())
			if(body_part.cached_bleed_rate)
				bleeding_limbs += loc_zone(body_part.plaintext_zone)
			if(body_part.grasped_by)
				grasped_limbs += loc_zone(body_part.plaintext_zone)

		if(LAZYLEN(bleeding_limbs))
			var/bleed_text = "<b>"
			var/bleeding_zones = loc_list(bleeding_limbs)
			if(appears_dead)
				bleed_text += "<span class='deadsay'>"
				bleed_text += loc_key("examine-body-bleeding-dead", list(gender = visible_gender, zones = bleeding_zones))
			else
				bleed_text += "<span class='warning'>"
				bleed_text += loc_key("examine-body-bleeding-[HAS_TRAIT(src, TRAIT_BLOOD_FOUNTAIN) ? "fast" : "alive"]", list(gender = visible_gender, zones = bleeding_zones))

			if(appears_dead)
				bleed_text += "<span class='deadsay'>"
			else
				bleed_text += "<span class='warning'>"
			bleed_text += "</b>"

			. += bleed_text
			if(LAZYLEN(grasped_limbs))
				for(var/grasped_part in grasped_limbs)
					. += loc_key("examine-body-bleeding-grasped", list(gender = visible_gender, zone = grasped_part))

	if(reagents.has_reagent(/datum/reagent/teslium, needs_metabolizing = TRUE))
		. += span_smallnoticeital(loc_key("examine-body-teslium-glow", gender_args)) // this should be signalized

	var/mob/living/living_user = user
	SEND_SIGNAL(living_user, COMSIG_CARBON_MID_EXAMINE, src, .) // Adds examine text after clothing and wounds but before death and scars
	if(just_sleeping)
		. += span_notice(loc_key("examine-body-asleep", gender_args))
	else if(!appears_dead)
		if(src != user)
			if(HAS_TRAIT(user, TRAIT_SPIRITUAL) && mind?.holy_role && user != src)
				. += loc_key("examine-body-holy-aura", gender_args)
				living_user.add_mood_event("religious_comfort", /datum/mood_event/religiously_comforted)

		if(IS_UNCONSCIOUS(src))
			. += span_notice(loc_key("examine-body-asleep", gender_args))
		else if(stat == SOFT_CRIT)
			. += span_notice(loc_key("examine-body-barely-conscious", gender_args))
		else if(HAS_TRAIT(src, TRAIT_DUMB))
			. += loc_key("examine-body-stupid-face", gender_args)

		var/obj/item/organ/brain/brain = get_organ_by_type(/obj/item/organ/brain)
		if(brain && isnull(ai_controller))
			var/npc_message = ""
			if(HAS_TRAIT(brain, TRAIT_GHOSTROLE_ON_REVIVE) || HAS_TRAIT(src, TRAIT_GHOSTROLE_ON_REVIVE))
				npc_message = LOC_KEY("examine-body-soul-pending")
			else if(!key)
				npc_message = loc_key("examine-body-catatonic", gender_args)
			else if(!client)
				npc_message = loc_key("examine-body-absent-stare", gender_args)
			if(npc_message)
				// give some space since this is usually near the end
				ADD_NEWLINE_IF_NECESSARY(.)
				. += span_deadsay(npc_message)

	var/scar_severity = 0
	for(var/datum/scar/scar as anything in all_scars)
		if(scar.is_visible(user))
			scar_severity += scar.severity

	if(scar_severity >= 1)
		// give some space since this is even more usually near the end
		ADD_NEWLINE_IF_NECESSARY(.)
		switch(scar_severity)
			if(1 to 4)
				. += span_tinynoticeital(loc_key("examine-body-scars-minor", gender_args))
			if(5 to 8)
				. += span_smallnoticeital(loc_key("examine-body-scars-several", gender_args))
			if(9 to 11)
				. += span_notice("<i>[loc_key("examine-body-scars-severe", gender_args)]</i>")
			if(12 to INFINITY)
				. += span_notice("<b><i>[loc_key("examine-body-scars-horrific", gender_args)]</i></b>")

	if(HAS_TRAIT(src, TRAIT_HUSK))
		if(HAS_TRAIT_FROM(src, TRAIT_HUSK, /datum/status_effect/zombie::id))
			. += span_warning(loc_key("examine-body-husk-rotted", gender_args)) // future todo: lizards don't have skin, they have scales
		else
			. += span_warning(LOC_KEY("mob-examine-this_body_has_been_reduced_to"))
	if(HAS_MIND_TRAIT(user, TRAIT_MORBID))
		if(HAS_TRAIT(src, TRAIT_DISSECTED))
			. += span_notice("[loc_key("examine-body-dissected", gender_args)] <b><i>[LOC_KEY("examine-body-dissected-tail")]</i></b>")
		if(HAS_TRAIT(src, TRAIT_SURGICALLY_ANALYZED))
			. += span_notice("[loc_key("examine-body-analyzed", list(gender = user.get_visible_gender()))] <b><i>[LOC_KEY("examine-body-analyzed-tail")]</i></b>")
	if(isliving(user) && HAS_MIND_TRAIT(user, TRAIT_EXAMINE_FITNESS))
		. += compare_fitness(user)

	var/hud_info = get_hud_examine_info(user)
	if(length(hud_info))
		. += hud_info

	if(isobserver(user))
		ADD_NEWLINE_IF_NECESSARY(.)
		. += "<b>[LOC_KEY("examine-body-quirks-label")]</b> [get_quirk_string(FALSE, CAT_QUIRK_ALL)]"

	SEND_SIGNAL(src, COMSIG_ATOM_EXAMINE, user, .)
	if(length(.))
		.[1] = "<span class='info'>" + .[1]
		.[length(.)] += "</span>"
	return .

/mob/living/carbon/examine_more(mob/user)
	. = ..()
	if(HAS_TRAIT(src, TRAIT_INVISIBLE_MAN))
		return
	for(var/datum/scar/iter_scar as anything in all_scars)
		if(iter_scar.is_visible(user))
			. += iter_scar.get_examine_description(user)

/**
 * Shows any and all examine text related to any status effects the user has.
 */
/mob/living/proc/get_status_effect_examinations(mob/examiner)
	var/list/examine_list = list()

	for(var/datum/status_effect/effect as anything in status_effects)
		var/effect_text = effect.get_examine_text(examiner)
		if(!effect_text)
			continue

		examine_list += effect_text

	if(!length(examine_list))
		return

	return examine_list.Join("<br>")

/// Returns death message for mob examine text
/mob/living/carbon/proc/generate_death_examine_text()
	var/mob/dead/observer/ghost = get_ghost(TRUE, TRUE)
	var/list/gender_args = list(gender = get_visible_gender())
	//This checks to see if the body is revivable
	var/obj/item/organ/brain = get_organ_by_type(/obj/item/organ/brain)
	if((brain && HAS_TRAIT(brain, TRAIT_GHOSTROLE_ON_REVIVE)) || HAS_TRAIT(src, TRAIT_GHOSTROLE_ON_REVIVE))
		return span_deadsay(loc_key("examine-body-limp-ghostrole", gender_args))
	var/client_like = client || HAS_TRAIT(src, TRAIT_MIND_TEMPORARILY_GONE)
	var/valid_ghost = ghost?.can_reenter_corpse && ghost?.client
	var/valid_soul = brain || !HAS_TRAIT(src, TRAIT_FAKE_SOULLESS)
	if((brain && client_like) || (valid_ghost && valid_soul))
		return span_deadsay(loc_key("examine-body-limp-recoverable", gender_args))
	return span_deadsay(loc_key("examine-body-limp-departed", gender_args))

/// Returns a list of "damtype" => damage description based off of which bodypart description is most common
/mob/living/carbon/proc/get_majority_bodypart_damage_desc()
	var/list/seen_damage = list() // This looks like: ({Damage type} = list({Damage description for that damage type} = {number of times it has appeared}, ...), ...)
	var/list/most_seen_damage = list() // This looks like: ({Damage type} = {Frequency of the most common description}, ...)
	var/list/final_descriptions = list() // This looks like: ({Damage type} = {Most common damage description for that type}, ...)
	for(var/obj/item/bodypart/part as anything in get_bodyparts())
		for(var/damage_type in part.damage_examines)
			var/damage_desc = part.damage_examines[damage_type]
			if(!seen_damage[damage_type])
				seen_damage[damage_type] = list()

			if(!seen_damage[damage_type][damage_desc])
				seen_damage[damage_type][damage_desc] = 1
			else
				seen_damage[damage_type][damage_desc] += 1

			if(seen_damage[damage_type][damage_desc] > most_seen_damage[damage_type])
				most_seen_damage[damage_type] = seen_damage[damage_type][damage_desc]
				final_descriptions[damage_type] = damage_desc
	return final_descriptions

/// Coolects examine information about the mob's clothing and equipment
/mob/living/carbon/proc/get_clothing_examine_info(mob/living/user)
	. = list()
	var/list/gender_args = list(gender = get_visible_gender())
	//Hands
	for(var/held_index in get_active_held_indexes())
		var/obj/item/held_thing = get_item_for_held_index(held_index)
		if((held_thing.item_flags & (ABSTRACT|HAND_ITEM)) || HAS_TRAIT(held_thing, TRAIT_EXAMINE_SKIP))
			continue
		. += loc_key("examine-slot-held", list(gender = gender_args["gender"], item = held_thing.examine_title(user), hand = loc_lookup("bodypart-hand", get_held_index_name(held_index))))
	for(var/obj/item/bodypart/arm/part in get_bodyparts())
		if(!(part.bodypart_flags & BODYPART_PSEUDOPART))
			continue
		var/obj/item/corresponding_item = get_item_for_held_index(part.held_index) || part
		. += loc_key("examine-slot-pseudopart", list(gender = gender_args["gender"], item = corresponding_item.examine_title(user), zone = loc_zone(initial(part.plaintext_zone))))
	//handcuffed?
	if(handcuffed)
		. += span_warning(loc_key("examine-slot-handcuffed-[istype(handcuffed, /obj/item/restraints/handcuffs/cable) ? "cable" : "plain"]", list(gender = gender_args["gender"], icon = icon2html(handcuffed, user))))
	//eyes
	if(is_eyes_visible(requires_eyes = TRUE))
		if(HAS_TRAIT(src, TRAIT_UNNATURAL_RED_GLOWY_EYES))
			. += span_warning(loc_key("examine-body-eyes-glowing", gender_args))
		else if(HAS_TRAIT(src, TRAIT_BLOODSHOT_EYES))
			. += span_warning(loc_key("examine-body-eyes-bloodshot", gender_args))

// Yes there's a lot of copypasta here, we can improve this later when carbons are less dumb in general
/mob/living/carbon/human/get_clothing_examine_info(mob/living/user)
	. = list()
	var/list/gender_args = list(gender = get_visible_gender())
	var/visible_gender = gender_args["gender"]

	//uniform
	if(w_uniform && !(obscured_slots & HIDEJUMPSUIT) && !HAS_TRAIT(w_uniform, TRAIT_EXAMINE_SKIP))
		//accessory
		var/accessory_message = ""
		if(istype(w_uniform, /obj/item/clothing/under))
			var/obj/item/clothing/under/undershirt = w_uniform
			var/list/accessories = undershirt.list_accessories_with_icon(user)
			if(length(accessories))
				accessory_message = loc_list(accessories)

		. += loc_key("examine-slot-uniform-[length(accessory_message) ? "accessories" : "plain"]", list(gender = visible_gender, item = w_uniform.examine_title(user), accessories = accessory_message))
	//head
	if(head && !(obscured_slots & HIDEHEADGEAR) && !HAS_TRAIT(head, TRAIT_EXAMINE_SKIP))
		. += loc_key("examine-slot-head", list(gender = visible_gender, item = head.examine_title(user)))
	//mask
	if(wear_mask && !(obscured_slots & HIDEMASK)  && !HAS_TRAIT(wear_mask, TRAIT_EXAMINE_SKIP))
		. += loc_key("examine-slot-mask", list(gender = visible_gender, item = wear_mask.examine_title(user)))
	//neck
	if(wear_neck && !(obscured_slots & HIDENECK)  && !HAS_TRAIT(wear_neck, TRAIT_EXAMINE_SKIP))
		. += loc_key("examine-slot-neck", list(gender = visible_gender, item = wear_neck.examine_title(user)))
	//eyes
	if(!(obscured_slots & HIDEEYES))
		if(glasses  && !HAS_TRAIT(glasses, TRAIT_EXAMINE_SKIP))
			. += loc_key("examine-slot-glasses", list(gender = visible_gender, item = glasses.examine_title(user)))
		else if(HAS_TRAIT(src, TRAIT_UNNATURAL_RED_GLOWY_EYES))
			. += span_warning(loc_key("examine-body-eyes-glowing", gender_args))
		else if(HAS_TRAIT(src, TRAIT_BLOODSHOT_EYES))
			. += span_warning(loc_key("examine-body-eyes-bloodshot", gender_args))
	//ears
	if(ears && !(obscured_slots & HIDEEARS) && !HAS_TRAIT(ears, TRAIT_EXAMINE_SKIP))
		. += loc_key("examine-slot-ears", list(gender = visible_gender, item = ears.examine_title(user)))
	//suit/armor
	if(wear_suit && !HAS_TRAIT(wear_suit, TRAIT_EXAMINE_SKIP))
		. += loc_key("examine-slot-wearing", list(gender = visible_gender, item = wear_suit.examine_title(user)))
		//suit/armor storage
		if(s_store && !(obscured_slots & HIDESUITSTORAGE) && !HAS_TRAIT(s_store, TRAIT_EXAMINE_SKIP))
			. += loc_key("examine-slot-suit-storage", list(gender = visible_gender, item = s_store.examine_title(user), suit = loc_entity(wear_suit, wear_suit.name)))
	//back
	if(back && !HAS_TRAIT(back, TRAIT_EXAMINE_SKIP))
		. += loc_key("examine-slot-back", list(gender = visible_gender, item = back.examine_title(user)))
	//ID
	if(wear_id && !HAS_TRAIT(wear_id, TRAIT_EXAMINE_SKIP))
		var/obj/item/card/id/id = wear_id.GetID()
		if(id && get_dist(user, src) <= ID_EXAMINE_DISTANCE)
			var/id_href = "<a href='byond://?src=[REF(src)];see_id=1;id_ref=[REF(id)];id_name=[id.registered_name];examine_time=[world.time]'>[wear_id.examine_title(user)]</a>"
			. += loc_key("examine-slot-wearing", list(gender = visible_gender, item = id_href))

		else
			. += loc_key("examine-slot-wearing", list(gender = visible_gender, item = wear_id.examine_title(user)))
	//Hands
	for(var/held_index in get_active_held_indexes())
		var/obj/item/held_thing = get_item_for_held_index(held_index)
		if((held_thing.item_flags & (ABSTRACT|HAND_ITEM)) || HAS_TRAIT(held_thing, TRAIT_EXAMINE_SKIP))
			continue
		. += loc_key("examine-slot-held", list(gender = gender_args["gender"], item = held_thing.examine_title(user), hand = loc_lookup("bodypart-hand", get_held_index_name(held_index))))
	for(var/obj/item/bodypart/arm/part in get_bodyparts())
		if(!(part.bodypart_flags & BODYPART_PSEUDOPART))
			continue
		var/obj/item/corresponding_item = get_item_for_held_index(part.held_index) || part
		. += loc_key("examine-slot-pseudopart-bare", list(gender = gender_args["gender"], item = corresponding_item.examine_title(user), zone = loc_zone(initial(part.plaintext_zone))))
	//gloves
	if(gloves && !(obscured_slots & HIDEGLOVES) && !HAS_TRAIT(gloves, TRAIT_EXAMINE_SKIP))
		. += loc_key("examine-slot-gloves", list(gender = visible_gender, item = gloves.examine_title(user)))
	else if(GET_ATOM_BLOOD_DECAL_LENGTH(src) && num_hands)
		var/list/blood_stains = GET_ATOM_BLOOD_DECALS(src)
		var/datum/blood_type/blood_type = blood_stains[blood_stains[length(blood_stains)]]
		var/blood_descriptior = "blood"
		if(istype(blood_type))
			blood_descriptior = LOWER_TEXT(blood_type.get_blood_name())
		. += span_warning(loc_key("examine-slot-hands-bloody-[num_hands > 1 ? "many" : "one"]", list(gender = visible_gender, blood = loc_lookup("examine-blood-name", blood_descriptior))))
	else if (blood_in_hands && num_hands)
		. += span_warning(loc_key("examine-slot-hands-bloody-[num_hands > 1 ? "many" : "one"]", list(gender = visible_gender, blood = LOC_KEY("examine-blood-name-blood"))))
	//handcuffed?
	if(handcuffed)
		. += span_warning(loc_key("examine-slot-handcuffed-[istype(handcuffed, /obj/item/restraints/handcuffs/cable) ? "cable" : "plain"]", list(gender = gender_args["gender"], icon = icon2html(handcuffed, user))))
	//belt
	if(belt && !(obscured_slots & HIDEBELT) && !HAS_TRAIT(belt, TRAIT_EXAMINE_SKIP))
		. += loc_key("examine-slot-belt", list(gender = visible_gender, item = belt.examine_title(user)))
	//shoes
	if(shoes && !(obscured_slots & HIDESHOES)  && !HAS_TRAIT(shoes, TRAIT_EXAMINE_SKIP))
		. += loc_key("examine-slot-shoes", list(gender = visible_gender, item = shoes.examine_title(user)))

/// Collects info displayed about any HUDs the user has when examining src
/mob/living/carbon/proc/get_hud_examine_info(mob/living/user)
	return

/mob/living/carbon/human/get_hud_examine_info(mob/living/user)
	. = list()

	var/perpname = get_face_name(get_id_name(""))
	var/title = ""
	if(perpname && (HAS_TRAIT(user, TRAIT_SECURITY_HUD) || HAS_TRAIT(user, TRAIT_MEDICAL_HUD)) && (!IS_UNCONSCIOUS_OR_CRIT(user) || isobserver(user)) && user != src)
		var/datum/record/crew/target_record = find_record(perpname)
		if(target_record)
			. += loc_key("examine-hud-rank", list(rank = target_record.rank))
			. += "<a href='byond://?src=[REF(src)];hud=1;photo_front=1;examine_time=[world.time]'>\[[LOC_KEY("examine-hud-photo-front")]\]</a><a href='byond://?src=[REF(src)];hud=1;photo_side=1;examine_time=[world.time]'>\[[LOC_KEY("examine-hud-photo-side")]\]</a>"
		if(HAS_TRAIT(user, TRAIT_MEDICAL_HUD) && HAS_TRAIT(user, TRAIT_SECURITY_HUD))
			title = separator_hr(LOC_KEY("examine-hud-title-both"))
			. += get_medhud_examine_info(user, target_record)
			. += get_sechud_examine_info(user, target_record)

		else if(HAS_TRAIT(user, TRAIT_MEDICAL_HUD))
			title = separator_hr(LOC_KEY("examine-hud-title-medical"))
			. += get_medhud_examine_info(user, target_record)

		else if(HAS_TRAIT(user, TRAIT_SECURITY_HUD))
			title = separator_hr(LOC_KEY("examine-hud-title-security"))
			. += get_sechud_examine_info(user, target_record)

	// applies the separator correctly without an extra line break
	if(title && length(.))
		.[1] = title + .[1]
	return .

/// Collects information displayed about src when examined by a user with a medical HUD.
/mob/living/carbon/proc/get_medhud_examine_info(mob/living/user, datum/record/crew/target_record)
	. = list()

	var/list/cybers = list()
	for(var/obj/item/organ/cyberimp/cyberimp in organs)
		if(IS_ROBOTIC_ORGAN(cyberimp) && !(cyberimp.organ_flags & ORGAN_HIDDEN))
			cybers += cyberimp.examine_title(user)
	if(length(cybers))
		. += "<span class='notice ml-1'>[LOC_KEY("examine-hud-cyber-detected")]</span>"
		. += "<span class='notice ml-2'>[english_list(cybers, and_text = ", and")]</span>"
	if(target_record)
		. += "<a href='byond://?src=[REF(src)];hud=m;physical_status=1;examine_time=[world.time]'>\[[target_record.physical_status]\]</a>"
		. += "<a href='byond://?src=[REF(src)];hud=m;mental_status=1;examine_time=[world.time]'>\[[target_record.mental_status]\]</a>"
	else
		. += "\[[LOC_KEY("examine-hud-record-missing")]\]"
		. += "\[[LOC_KEY("examine-hud-record-missing")]\]"
	. += "<a href='byond://?src=[REF(src)];hud=m;evaluation=1;examine_time=[world.time]'>\[[LOC_KEY("examine-hud-medical-evaluation")]\]</a>"
	. += "<a href='byond://?src=[REF(src)];hud=m;quirk=1;examine_time=[world.time]'>\[[LOC_KEY("examine-hud-see-quirks")]\]</a>"

/// Collects information displayed about src when examined by a user with a security HUD.
/mob/living/carbon/proc/get_sechud_examine_info(mob/living/user, datum/record/crew/target_record)
	. = list()

	var/wanted_status = WANTED_NONE
	var/security_note = LOC_KEY("examine-hud-notes-none")

	if(target_record)
		wanted_status = target_record.wanted_status
		if(target_record.security_note)
			security_note = target_record.security_note
	if(ishuman(user))
		. += loc_key("examine-hud-criminal-status", list(status = "<a href='byond://?src=[REF(src)];hud=s;status=1;examine_time=[world.time]'>\[[wanted_status]\]</a>"))
	else
		. += loc_key("examine-hud-criminal-status", list(status = wanted_status))
	. += loc_key("examine-hud-important-notes", list(note = security_note))
	. += loc_key("examine-hud-security-record", list(link = "<a href='byond://?src=[REF(src)];hud=s;view=1;examine_time=[world.time]'>\[[LOC_KEY("examine-hud-view")]\]</a>"))
	if(ishuman(user))
		. += "<a href='byond://?src=[REF(src)];hud=s;add_citation=1;examine_time=[world.time]'>\[[LOC_KEY("examine-hud-add-citation")]\]</a>\
			<a href='byond://?src=[REF(src)];hud=s;add_crime=1;examine_time=[world.time]'>\[[LOC_KEY("examine-hud-add-crime")]\]</a>\
			<a href='byond://?src=[REF(src)];hud=s;add_note=1;examine_time=[world.time]'>\[[LOC_KEY("examine-hud-add-note")]\]</a>"

/mob/living/carbon/human/examine_more(mob/user)
	. = ..()

	if(istype(w_uniform, /obj/item/clothing/under) && !(obscured_slots & HIDEJUMPSUIT) && !HAS_TRAIT(w_uniform, TRAIT_EXAMINE_SKIP))
		var/obj/item/clothing/under/undershirt = w_uniform
		if(undershirt.has_sensor == BROKEN_SENSORS)
			. += list(span_notice(loc_key("examine-slot-sensor-sparking", list(item = undershirt))))

	if((HAS_TRAIT(src, TRAIT_UNKNOWN_APPEARANCE) || HAS_TRAIT(src, TRAIT_INVISIBLE_MAN)) && !isobserver(user))
		return

	var/limbs_text = get_mismatched_limb_text()
	if(LAZYLEN(limbs_text))
		. += limbs_text

	var/agetext = get_age_text()
	if(agetext)
		. += agetext

/// Reports all body parts which are mismatched with the user's species
/mob/living/carbon/human/proc/get_mismatched_limb_text()
	var/list/covered = get_covered_body_zones()
	var/list/texts = list()
	for(var/obj/item/bodypart/part as anything in get_bodyparts())
		var/part_id = part.limb_id
		var/obj/item/bodypart/expected_part = dna?.species?.bodypart_overrides[part.body_zone]
		var/expected_id = initial(expected_part?.limb_id)
		// only report abnormal bodyparts
		if(part_id == expected_id)
			continue
		// same shape bodyparts are concealed by clothing
		// this means you can see ex. digitigrade legs through clothes
		// but you can't see ex. cybernetic legs through clothes
		if(part.bodyshape == initial(expected_part?.bodyshape) && (part.body_zone in covered))
			continue
		texts += span_notice(loc_key("examine-body-limb-mismatch", list(gender = get_visible_gender(), limb = loc_entity(part, "\a [part]"))))

	return texts

/// Reports how old the mob appears to be
/mob/living/carbon/human/proc/get_age_text()
	if(obscured_slots & HIDEFACE)
		return

	var/age_slug
	switch(age)
		if(-INFINITY to 25)
			age_slug = "young"
		if(26 to 35)
			age_slug = "adult"
		if(36 to 55)
			age_slug = "middle"
		if(56 to 75)
			age_slug = "old"
		if(76 to 100)
			age_slug = "very_old"
		if(101 to INFINITY)
			age_slug = "withering"

	return span_notice(loc_key("examine-age-[age_slug]", list(gender = get_visible_gender())))

#undef ADD_NEWLINE_IF_NECESSARY
