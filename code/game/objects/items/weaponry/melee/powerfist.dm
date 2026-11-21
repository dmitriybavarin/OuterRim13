///Defines for the pressure strength of the fist
#define LOW_PRESSURE 1
#define MID_PRESSURE 2
#define HIGH_PRESSURE 3
///Defines for the tank change action
#define TANK_INSERTING 0
#define TANK_REMOVING 1

/obj/item/melee/powerfist
	name = "power-fist"
	desc = "A metal gauntlet with a piston-powered ram on top for that extra 'oomph' in your punch."
	icon = 'icons/obj/antags/syndicate_tools.dmi'
	icon_state = "powerfist"
	inhand_icon_state = "powerfist"
	icon_angle = 180
	lefthand_file = 'icons/mob/inhands/weapons/melee_lefthand.dmi'
	righthand_file = 'icons/mob/inhands/weapons/melee_righthand.dmi'
	obj_flags = CONDUCTS_ELECTRICITY
	attack_verb_continuous = list("whacks", "fists", "power-punches")
	attack_verb_simple = list("whack", "fist", "power-punch")
	force = 20
	throwforce = 10
	throw_range = 7
	w_class = WEIGHT_CLASS_NORMAL
	armor_type = /datum/armor/melee_powerfist
	resistance_flags = FIRE_PROOF
	/// Delay between attacks
	var/click_delay = 0.15 SECONDS
	/// Pressure level on the fist
	var/fist_pressure_setting = LOW_PRESSURE
	/// Amount of moles per punch
	var/gas_per_fist = 3
	/// Tank used for the gauntlet's piston-ram.
	var/obj/item/tank/internals/tank

/datum/armor/melee_powerfist
	fire = 100
	acid = 40

/obj/item/melee/powerfist/proc/pressure_setting_to_text(fist_pressure_setting)
	switch(fist_pressure_setting)
		if(LOW_PRESSURE)
			return "low"
		if(MID_PRESSURE)
			return "medium"
		if(HIGH_PRESSURE)
			return "high"
		else
			CRASH("Invalid pressure setting: [fist_pressure_setting]!")

/obj/item/melee/powerfist/examine(mob/user)
	. = ..()
	if(!in_range(user, src))
		. += span_notice(LOC_KEY("item-closer-look"))
		return
	if(tank)
		. += span_notice("[icon2html(tank, user)] [loc_key("item-powerfist-examine-tank", list(tank = loc_entity(tank, "\a [tank]")))]")
		. += span_notice(loc_key("item-powerfist-examine-remove", list(tool = "<b>[LOC_KEY("item-powerfist-screwdriver")]</b>")))

	. += span_notice("Use a <b>wrench</b> to change the valve strength. Current strength is at <b>[pressure_setting_to_text(fist_pressure_setting)]</b> level.")

/obj/item/melee/powerfist/wrench_act(mob/living/user, obj/item/tool)
	fist_pressure_setting = fist_pressure_setting >= HIGH_PRESSURE ? LOW_PRESSURE : fist_pressure_setting + 1
	tool.play_tool_sound(src)
	balloon_alert(user, "piston strength set to [pressure_setting_to_text(fist_pressure_setting)]")
	return TRUE

/obj/item/melee/powerfist/screwdriver_act(mob/living/user, obj/item/tool)
	if(!tank)
		balloon_alert(user, LOC_KEY("item-powerfist-no-tank"))
		return
	update_tank(tank, TANK_REMOVING, user)
	return TRUE

/obj/item/melee/powerfist/item_interaction(mob/living/user, obj/item/tool, list/modifiers)
	if(!istype(tool, /obj/item/tank/internals))
		return NONE

	if(tank)
		to_chat(user, span_notice(LOC_KEY("item-powerfist-tank-present")))
		return ITEM_INTERACT_BLOCKING

	if(astype(tool, /obj/item/tank/internals).volume <= 3)
		to_chat(user, span_warning(loc_key("item-powerfist-tank-too-small", list(tool = tool, item = src))))
		return ITEM_INTERACT_BLOCKING

	update_tank(tool, TANK_INSERTING, user)
	return ITEM_INTERACT_SUCCESS

/obj/item/melee/powerfist/proc/update_tank(obj/item/tank/internals/the_tank, removing = TANK_INSERTING, mob/living/carbon/human/user)
	if(removing)
		if(!tank)
			to_chat(user, span_notice(loc_key("item-powerfist-no-tank-attached", list(item = src))))
			return
		to_chat(user, span_notice(loc_key("item-powerfist-tank-detach", list(tank = the_tank, item = src))))
		tank.forceMove(get_turf(user))
		user.put_in_hands(tank)
		tank = null
		return

	if(tank)
		to_chat(user, span_warning(loc_key("item-powerfist-tank-already", list(item = src))))
		return
	if(!user.transferItemToLoc(the_tank, src))
		return
	to_chat(user, span_notice(loc_key("item-powerfist-tank-attach", list(tank = the_tank, item = src))))
	tank = the_tank

/obj/item/melee/powerfist/attack(mob/living/target, mob/living/user)
	if(!tank)
		to_chat(user, span_warning(loc_key("item-powerfist-no-gas", list(item = src))))
		return
	if(HAS_TRAIT(user, TRAIT_PACIFISM))
		to_chat(user, span_warning(LOC_KEY("item-pacifist-no-harm")))
		return
	var/turf/our_turf = get_turf(src)
	if(!our_turf)
		return

	var/datum/gas_mixture/gas_used = tank.remove_air(gas_per_fist * fist_pressure_setting)
	if(!gas_used)
		to_chat(user, span_warning(loc_key("item-powerfist-tank-empty", list(item = src))))
		target.apply_damage((force / 5), BRUTE)
		playsound(loc, 'sound/items/weapons/punch1.ogg', 50, TRUE)
		target.visible_message(span_danger(loc_key("item-powerfist-punch-dull-others", list(user = user, they = user.p_they(), es = user.p_es(), target = target.name))), \
			span_userdanger(loc_key("item-powerfist-punch-dull-target", list(user = user))))
		return

	if(!molar_cmp_equals(gas_used.total_moles(), gas_per_fist * fist_pressure_setting))
		our_turf.assume_air(gas_used)
		to_chat(user, span_warning(loc_key("item-powerfist-weak-hiss", list(item = src))))
		playsound(loc, 'sound/items/weapons/punch4.ogg', 50, TRUE)
		target.apply_damage((force / 2), BRUTE)
		target.visible_message(span_danger(loc_key("item-powerfist-punch-weak-others", list(user = user, they = user.p_they(), es = user.p_es(), target = target.name))), \
			span_userdanger(loc_key("item-powerfist-punch-weak-target", list(user = user))))
		return

	target.visible_message(span_danger(loc_key("item-powerfist-punch-loud-others", list(user = user, they = user.p_they(), es = user.p_es(), target = target.name))), \
		span_userdanger(loc_key("item-powerfist-punch-loud-target", list(user = user))))
	new /obj/effect/temp_visual/kinetic_blast(target.loc)
	target.apply_damage(force * fist_pressure_setting, BRUTE, wound_bonus = CANT_WOUND)
	playsound(src, 'sound/items/weapons/resonator_blast.ogg', 50, TRUE)
	playsound(src, 'sound/items/weapons/genhit2.ogg', 50, TRUE)

	if(!QDELETED(target))
		var/atom/throw_target = get_edge_target_turf(target, get_dir(src, get_step_away(target, src)))

		target.throw_at(throw_target, 5 * fist_pressure_setting, 0.5 + (fist_pressure_setting / 2))

	log_combat(user, target, "power fisted", src)

	user.changeNext_move(CLICK_CD_MELEE * click_delay)

	our_turf.assume_air(gas_used)

#undef LOW_PRESSURE
#undef MID_PRESSURE
#undef HIGH_PRESSURE
#undef TANK_INSERTING
#undef TANK_REMOVING
