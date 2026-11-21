

/mob/living/carbon/alien/larva/attack_hand(mob/living/carbon/human/user, list/modifiers)
	. = ..()
	if(.)
		return TRUE
	var/damage = rand(1, 9)
	if (prob(90))
		playsound(loc, /datum/sound_effect/punch, 25, TRUE, -1)
		visible_message(span_danger(loc_key("mob-larva_defense-user_kicks_source", list(user = user, source = src))), \
						span_userdanger(loc_key("mob-larva_defense-user_kicks_you", list(user = user))), span_hear(LOC_KEY("mob-larva_defense-you_hear_a_sickening_sound_of")), COMBAT_MESSAGE_RANGE, user)
		to_chat(user, span_danger(loc_key("mob-larva_defense-you_kick_source", list(source = src))))
		if ((stat != DEAD) && (damage > 4.9))
			Unconscious(rand(100,200))

		var/obj/item/bodypart/affecting = get_bodypart(get_random_valid_zone(user.zone_selected))
		apply_damage(damage, BRUTE, affecting)
		log_combat(user, src, "attacked")
	else
		playsound(loc, 'sound/items/weapons/punchmiss.ogg', 25, TRUE, -1)
		visible_message(span_danger(loc_key("mob-larva_defense-user_s_kick_misses_source", list(user = user, source = src))), \
						span_danger(loc_key("mob-larva_defense-you_avoid_user_s_kick", list(user = user))), span_hear(LOC_KEY("mob-larva_defense-you_hear_a_swoosh")), COMBAT_MESSAGE_RANGE, user)
		to_chat(user, span_warning(loc_key("mob-larva_defense-your_kick_misses_source", list(source = src))))
		log_combat(user, src, "attacked and missed")

/mob/living/carbon/alien/larva/attack_hulk(mob/living/carbon/human/user)
	. = ..()
	if(!.)
		return
	user.AddComponent(/datum/component/force_move, get_step_away(user,src, 30))

/mob/living/carbon/alien/larva/do_attack_animation(atom/A, visual_effect_icon, obj/item/used_item, no_effect)
	if(!no_effect && !visual_effect_icon)
		visual_effect_icon = ATTACK_EFFECT_BITE
	..()
