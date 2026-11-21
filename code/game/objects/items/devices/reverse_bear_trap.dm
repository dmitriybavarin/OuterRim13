#define REVERSE_BEAR_TRAP_COUNTDOWN (60 SECONDS)

/obj/item/reverse_bear_trap
	name = "reverse bear trap"
	desc = "A horrifying set of shut metal jaws, rigged to a kitchen timer and secured by padlock to a head-mounted clamp. To apply, hit someone with it."
	icon = 'icons/obj/devices/syndie_gadget.dmi'
	worn_icon = 'icons/mob/clothing/head/utility.dmi'
	icon_state = "reverse_bear_trap"
	slot_flags = ITEM_SLOT_HEAD
	obj_flags = CONDUCTS_ELECTRICITY
	resistance_flags = FIRE_PROOF | UNACIDABLE
	w_class = WEIGHT_CLASS_NORMAL
	max_integrity = 300
	inhand_icon_state = "reverse_bear_trap"
	lefthand_file = 'icons/mob/inhands/items_lefthand.dmi'
	righthand_file = 'icons/mob/inhands/items_righthand.dmi'

	///Is the reverse bear trap active?
	var/ticking = FALSE
	///Cooldown for the KILL
	COOLDOWN_DECLARE(kill_countdown)
	///chance per "fiddle" to get the trap off your head
	var/escape_chance = 0
	///Is the target struggling?
	var/struggling = FALSE

	var/time_since_last_beep = 0
	var/datum/looping_sound/reverse_bear_trap/soundloop
	var/datum/looping_sound/reverse_bear_trap_beep/soundloop2

/obj/item/reverse_bear_trap/Initialize(mapload)
	. = ..()
	soundloop = new(src)
	soundloop2 = new(src)

/obj/item/reverse_bear_trap/Destroy()
	QDEL_NULL(soundloop)
	QDEL_NULL(soundloop2)
	STOP_PROCESSING(SSprocessing, src)
	return ..()

/obj/item/reverse_bear_trap/process(seconds_per_tick)
	if(!ticking)
		return
	soundloop2.mid_length = max(0.5, COOLDOWN_TIMELEFT(src, kill_countdown) - 5) //beepbeepbeepbeepbeep
	if (COOLDOWN_FINISHED(src, kill_countdown) || !isliving(loc))
		trigger()

/obj/item/reverse_bear_trap/proc/trigger()
	playsound(src, 'sound/machines/microwave/microwave-end.ogg', 100, FALSE)
	soundloop.stop()
	soundloop2.stop()
	to_chat(loc, span_userdanger(LOC_KEY("item-bear-trap-ding")))
	addtimer(CALLBACK(src, PROC_REF(snap)), 0.2 SECONDS)
	COOLDOWN_RESET(src, kill_countdown) // reset the countdown in case it wasn't finished

/obj/item/reverse_bear_trap/attack_hand(mob/user, list/modifiers)
	. = ..()
	if(!iscarbon(user))
		return
	var/mob/living/carbon/carbon_user = user
	if(carbon_user.get_item_by_slot(ITEM_SLOT_HEAD) != src)
		return
	if(!HAS_TRAIT_FROM(src, TRAIT_NODROP, REVERSE_BEAR_TRAP_TRAIT) || struggling)
		return

	struggling = TRUE
	var/fear_string
	switch(COOLDOWN_TIMELEFT(src, kill_countdown))
		if(0 SECONDS to 5 SECONDS)
			fear_string = "agonizingly"
		if(5 SECONDS to 20 SECONDS)
			fear_string = "desperately"
		if(20 SECONDS to 40 SECONDS)
			fear_string = "panickedly"
		if(40 SECONDS to 50 SECONDS)
			fear_string = "shakily"

	carbon_user.visible_message(span_danger("[carbon_user] fiddles with and pulls at [src]..."), \
		span_danger("You[isnull(fear_string) ? "" : " [fear_string]"] try to pull at [src]..."), "<i>You hear clicking and ticking.</i>")
	if(!do_after(user, 2 SECONDS, target = src))
		struggling = FALSE
		return
	if(!prob(escape_chance))
		to_chat(user, span_warning(LOC_KEY("item-bear-trap-stuck")))
		escape_chance++
	else
		user.visible_message(span_warning(loc_key("item-bear-trap-open-others", list(user = user, name = name))), \
		span_userdanger(LOC_KEY("item-bear-trap-open-self")), "<i>[LOC_KEY("item-bear-trap-open-hear")]</i>")
		REMOVE_TRAIT(src, TRAIT_NODROP, REVERSE_BEAR_TRAP_TRAIT)
	struggling = FALSE

/obj/item/reverse_bear_trap/attack(mob/living/target, mob/living/user)
	if(target.get_item_by_slot(ITEM_SLOT_HEAD))
		to_chat(user, span_warning(loc_key("item-bear-trap-headgear", list(their = target.p_their()))))
		return
	target.visible_message(span_warning(loc_key("item-bear-trap-force-others", list(user = user, item = src, target = target))), \
		span_userdanger(loc_key("item-bear-trap-force-target", list(target = target, item = src))), "<i>[LOC_KEY("item-bear-trap-force-hear")]</i>")
	to_chat(user, span_danger(loc_key("item-bear-trap-force-self", list(item = src, target = target))))

	if(!do_after(user, 3 SECONDS, target = target) || target.get_item_by_slot(ITEM_SLOT_HEAD))
		return
	target.visible_message(span_warning(loc_key("item-bear-trap-lock-others", list(user = user, item = src, target = target))), \
		span_userdanger(loc_key("item-bear-trap-lock-target", list(user = user, item = src))), "<i>[LOC_KEY("item-bear-trap-lock-hear")]</i>")
	to_chat(user, span_danger(loc_key("item-bear-trap-lock-self", list(item = src, target = target))))

	user.dropItemToGround(src)
	target.equip_to_slot_if_possible(src, ITEM_SLOT_HEAD)
	arm()
	notify_ghosts(
		"[user.real_name] put a reverse bear trap on [target.real_name]!",
		source = src,
		header = "Reverse bear trap armed",
		notify_flags = NOTIFY_CATEGORY_NOFLASH,
		ghost_sound = 'sound/machines/beep/beep.ogg',
		notify_volume = 75,
	)

/obj/item/reverse_bear_trap/proc/snap()
	reset()
	var/mob/living/carbon/human/victim = loc
	if(!istype(victim) || victim.get_item_by_slot(ITEM_SLOT_HEAD) != src)
		visible_message(span_warning(loc_key("item-bear-trap-snap", list(item = src))))
		playsound(src, 'sound/effects/snap.ogg', 75, TRUE)
	else
		var/mob/living/carbon/human/jill = loc
		jill.visible_message(span_boldwarning(loc_key("item-bear-trap-trigger-others", list(item = src, target = jill, their = jill.p_their()))), span_userdanger(loc_key("item-bear-trap-trigger-self", list(item = src))))
		jill.emote("scream")
		playsound(src, 'sound/effects/snap.ogg', 75, TRUE, frequency = 0.5)
		playsound(src, 'sound/effects/splat.ogg', 50, TRUE, frequency = 0.5)
		jill.apply_damage(9999, BRUTE, BODY_ZONE_HEAD)
		jill.investigate_log("has been killed by [src].", INVESTIGATE_DEATHS)
		jill.death() //just in case, for some reason, they're still alive
		flash_color(jill, flash_color = "#FF0000", flash_time = 100)

/obj/item/reverse_bear_trap/proc/reset()
	ticking = FALSE
	update_appearance(UPDATE_OVERLAYS)
	REMOVE_TRAIT(src, TRAIT_NODROP, REVERSE_BEAR_TRAP_TRAIT)
	soundloop.stop()
	soundloop2.stop()
	STOP_PROCESSING(SSprocessing, src)

/obj/item/reverse_bear_trap/update_overlays()
	. = ..()
	if(ticking != TRUE)
		return
	/// note: this timer overlay increments one frame every second (to simulate a clock ticking). If you want to instead have it do a full cycle in a minute, set the 'delay' of each frame of the icon overlay to 75 rather than 10, and the worn overlay to twice that.
	. += "rbt_ticking"

/obj/item/reverse_bear_trap/proc/arm() //hulen
	ticking = TRUE
	update_appearance(UPDATE_OVERLAYS)
	escape_chance = initial(escape_chance) //we keep these vars until re-arm, for tracking purposes
	COOLDOWN_START(src, kill_countdown, REVERSE_BEAR_TRAP_COUNTDOWN)
	ADD_TRAIT(src, TRAIT_NODROP, REVERSE_BEAR_TRAP_TRAIT)
	soundloop.start()
	soundloop2.mid_length = initial(soundloop2.mid_length)
	soundloop2.start()
	START_PROCESSING(SSprocessing, src)

#undef REVERSE_BEAR_TRAP_COUNTDOWN
