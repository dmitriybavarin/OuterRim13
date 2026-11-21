

/mob/living/carbon/alien/adult/attack_hulk(mob/living/carbon/human/user)
	. = ..()
	if(!.)
		return
	adjust_brute_loss(15)
	var/hitverb = "hit"
	if(mob_size < MOB_SIZE_LARGE)
		safe_throw_at(get_edge_target_turf(src, get_dir(user, src)), 2, 1, user)
		hitverb = "slam"
	playsound(loc, /datum/sound_effect/punch, 25, TRUE, -1)
	visible_message(span_danger("[user] [hitverb]s [src]!"), \
					span_userdanger("[user] [hitverb]s you!"), span_hear(LOC_KEY("mob-adult_defense-you_hear_a_sickening_sound_of")), COMBAT_MESSAGE_RANGE, user)
	to_chat(user, span_danger(loc_key("mob-adult_defense-you_hitverb_source", list(hitverb = hitverb, source = src))))

/mob/living/carbon/alien/adult/attack_hand(mob/living/carbon/human/user, list/modifiers)
	. = ..()
	if(.)
		return TRUE
	var/damage = rand(1, 9)
	if (prob(90))
		playsound(loc, /datum/sound_effect/punch, 25, TRUE, -1)
		visible_message(span_danger(loc_key("mob-adult_defense-user_punches_source", list(user = user, source = src))), \
						span_userdanger(loc_key("mob-adult_defense-user_punches_you", list(user = user))), span_hear(LOC_KEY("mob-adult_defense-you_hear_a_sickening_sound_of")), COMBAT_MESSAGE_RANGE, user)
		to_chat(user, span_danger(loc_key("mob-adult_defense-you_punch_source", list(source = src))))
		if ((stat != DEAD) && (damage > 9 || prob(5)))//Regular humans have a very small chance of knocking an alien down.
			Unconscious(40)
			visible_message(span_danger(loc_key("mob-adult_defense-user_knocks_source_down", list(user = user, source = src))), \
							span_userdanger(loc_key("mob-adult_defense-user_knocks_you_down", list(user = user))), span_hear(LOC_KEY("mob-adult_defense-you_hear_a_sickening_sound_of")), null, user)
			to_chat(user, span_danger(loc_key("mob-adult_defense-you_knock_source_down", list(source = src))))
		var/obj/item/bodypart/affecting = get_bodypart(get_random_valid_zone(user.zone_selected))
		apply_damage(damage, BRUTE, affecting)
		log_combat(user, src, "attacked")
	else
		playsound(loc, 'sound/items/weapons/punchmiss.ogg', 25, TRUE, -1)
		visible_message(span_danger(loc_key("mob-adult_defense-user_s_punch_misses_source", list(user = user, source = src))), \
						span_danger(loc_key("mob-adult_defense-you_avoid_user_s_punch", list(user = user))), span_hear(LOC_KEY("mob-adult_defense-you_hear_a_swoosh")), COMBAT_MESSAGE_RANGE, user)
		to_chat(user, span_warning(loc_key("mob-adult_defense-your_punch_misses_source", list(source = src))))

/mob/living/carbon/alien/adult/do_attack_animation(atom/A, visual_effect_icon, obj/item/used_item, no_effect)
	if(!no_effect && !visual_effect_icon)
		visual_effect_icon = ATTACK_EFFECT_CLAW
	..()
