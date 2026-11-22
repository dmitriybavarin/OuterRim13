/obj/item/food/grown/flower/poppy/blessed
	name = "blessed poppy"
	desc = "A strange poppy flower, one that has never seen the light of day."
	icon_state = "/obj/item/food/grown/flower/poppy/blessed"
	post_init_icon_state = "map_flower"
	icon = 'icons/map_icons/items/_item.dmi'
	greyscale_colors = COLOR_WHITE
	greyscale_config = /datum/greyscale_config/flower_simple
	greyscale_config_worn = /datum/greyscale_config/flower_simple_worn
	/// Counts how many time we picked someone out of crit condition
	var/save_count = 0

/obj/item/food/grown/flower/poppy/blessed/Initialize(mapload, obj/item/seeds/new_seed)
	. = ..()
	RegisterSignal(src, COMSIG_ITEM_APPLIED_TO_LIMB, PROC_REF(applied_to_limb))
	color = COLOR_PINK
	animate(src, color = COLOR_YELLOW, loop = -1, time = 10 SECONDS)
	animate(color = COLOR_PINK, loop = -1, time = 10 SECONDS)

/obj/item/food/grown/flower/poppy/blessed/Destroy()
	STOP_PROCESSING(SSobj, src)
	return ..()

/obj/item/food/grown/flower/poppy/blessed/equipped(mob/user, slot, initial)
	. = ..()
	if(slot & slot_flags)
		ADD_TRAIT(user, TRAIT_NOCRITDAMAGE, REF(src))
		START_PROCESSING(SSobj, src)

/obj/item/food/grown/flower/poppy/blessed/dropped(mob/user, silent)
	. = ..()
	REMOVE_TRAIT(user, TRAIT_NOCRITDAMAGE, REF(src))
	STOP_PROCESSING(SSobj, src)

/obj/item/food/grown/flower/poppy/blessed/process(seconds_per_tick)
	if(isliving(loc))
		heal_crit(seconds_per_tick)
		return

	if(isbodypart(loc))
		heal_limb(seconds_per_tick)
		return

	stack_trace("[type] processing in a non-living or non-bodypart mob")
	return PROCESS_KILL

/obj/item/food/grown/flower/poppy/blessed/proc/heal_crit(seconds_per_tick)
	var/mob/living/wearer = loc
	if(wearer.stat == STABLE || wearer.stat == DEAD)
		return

	wearer.adjust_brute_loss(-0.5 * seconds_per_tick, updating_health = FALSE)
	wearer.adjust_fire_loss(-0.5 * seconds_per_tick, updating_health = FALSE)
	wearer.adjust_tox_loss(-0.25 * seconds_per_tick, updating_health = FALSE, forced = TRUE)
	wearer.adjust_oxy_loss(-0.25 * seconds_per_tick, updating_health = FALSE)
	wearer.updatehealth()
	if(wearer.stat == STABLE)
		save_count += 1
		if(prob(25 * save_count))
			to_chat(wearer, span_mansus(loc_key("heretic-item-poppy-withers", list(item = src))))
			burn()

	else if(SPT_PROB(33, seconds_per_tick))
		new /obj/effect/temp_visual/heal(get_turf(src), pick(COLOR_PINK, COLOR_YELLOW))
		if(prob(20))
			wearer.visible_message(span_mansus(loc_key("heretic-item-poppy-glow-worn", list(wearer = wearer, name = loc_entity(src, name)))))

/obj/item/food/grown/flower/poppy/blessed/proc/heal_limb(seconds_per_tick)
	var/obj/item/bodypart/limb = loc
	if(!length(limb.wounds))
		to_chat(limb.owner, span_mansus(loc_key("heretic-item-poppy-withers", list(item = src))))
		burn()
		return

	var/healed = FALSE
	for(var/datum/wound/wound as anything in limb.wounds)
		if(wound.blood_flow > 0)
			wound.adjust_blood_flow(-0.2 * seconds_per_tick)
			healed = TRUE

		if(istype(wound, /datum/wound/blunt/bone))
			var/datum/wound/blunt/bone/broken_bone = wound
			broken_bone.regen_ticks_current += 2.5 * seconds_per_tick
			broken_bone.processes = TRUE // to auto-healing
			broken_bone.healing = TRUE
			healed = TRUE

		if(istype(wound, /datum/wound/burn/flesh))
			var/datum/wound/burn/flesh/burned_flesh = wound
			burned_flesh.flesh_healing += 0.5 * seconds_per_tick
			burned_flesh.sanitization += 0.2 * seconds_per_tick
			healed = TRUE

	if(healed && SPT_PROB(33, seconds_per_tick))
		new /obj/effect/temp_visual/heal(get_turf(src), pick(COLOR_PINK, COLOR_YELLOW))
		if(prob(20))
			limb.owner.visible_message(span_mansus(loc_key("heretic-item-poppy-glow-limb", list(item = src, owner = limb.owner, zone = loc_zone(limb.plaintext_zone)))))

#define LIMB_CATEGORY_POPPY "poppy"

/obj/item/food/grown/flower/poppy/blessed/interact_with_atom(atom/interacting_with, mob/living/user, list/modifiers)
	if(!iscarbon(interacting_with))
		return NONE

	var/mob/living/carbon/carbon_target = interacting_with
	var/obj/item/bodypart/target_limb = carbon_target.get_bodypart(user.zone_selected)
	if(isnull(target_limb))
		carbon_target.balloon_alert(user, LOC_KEY("heretic-item-poppy-no-limb"))
		return ITEM_INTERACT_BLOCKING

	if(!length(target_limb.wounds))
		carbon_target.balloon_alert(user, LOC_KEY("heretic-item-poppy-no-wounds"))
		return ITEM_INTERACT_BLOCKING

	if(LAZYACCESS(target_limb.applied_items, LIMB_CATEGORY_POPPY))
		carbon_target.balloon_alert(user, LOC_KEY("heretic-item-poppy-already-healing"))
		return ITEM_INTERACT_BLOCKING

	var/list/lay_args = list(user = user, item = src, target = carbon_target, their = user.p_their(), zone = loc_zone(target_limb.plaintext_zone))
	var/lay_self = carbon_target == user
	user.visible_message(
		span_notice(lay_self ? loc_key("heretic-item-poppy-seen-own", lay_args) : loc_key("heretic-item-poppy-seen-target", lay_args)),
		span_notice(lay_self ? loc_key("heretic-item-poppy-self-own", lay_args) : loc_key("heretic-item-poppy-self-target", lay_args)),
		visible_message_flags = ALWAYS_SHOW_SELF_MESSAGE,
		vision_distance = 5,
	)
	if(!do_after(user, 2 SECONDS, carbon_target))
		return ITEM_INTERACT_BLOCKING

	user.visible_message(
		span_mansus(lay_self ? loc_key("heretic-item-poppy-glowseen-own", lay_args) : loc_key("heretic-item-poppy-glowseen-target", lay_args)),
		span_mansus(lay_self ? loc_key("heretic-item-poppy-glowself-own", lay_args) : loc_key("heretic-item-poppy-glowself-target", lay_args)),
		visible_message_flags = ALWAYS_SHOW_SELF_MESSAGE,
		vision_distance = 5,
	)
	target_limb.apply_item(src, LIMB_CATEGORY_POPPY)
	return ITEM_INTERACT_SUCCESS

/obj/item/food/grown/flower/poppy/blessed/proc/applied_to_limb(mob/living/user, obj/item/bodypart/limb)
	SIGNAL_HANDLER
	START_PROCESSING(SSobj, src)

#undef LIMB_CATEGORY_POPPY
