///Tracking reasons
/datum/antagonist/heretic_monster
	name = "\improper Eldritch Horror"
	roundend_category = "Heretics"
	antagpanel_category = ANTAG_GROUP_HORRORS
	antag_moodlet = /datum/mood_event/heretics
	pref_flag = ROLE_HERETIC
	antag_hud_name = "heretic_beast"
	suicide_cry = "MY MASTER SMILES UPON ME!!"
	show_in_antagpanel = FALSE
	stinger_sound = 'sound/music/antag/heretic/heretic_gain.ogg'
	/// Our master (a heretic)'s mind.
	var/datum/mind/master

/datum/antagonist/heretic_monster/on_removal()
	if(!silent)
		if(master?.current)
			to_chat(master.current, span_warning(loc_key("heretic-mob-monster-release-master", list(servant = owner))))
		if(owner.current)
			to_chat(owner.current, span_deconversion_message(master ? loc_key("heretic-mob-monster-release-named", list(master = master)) : LOC_KEY("heretic-mob-monster-release")))
			owner.current.visible_message(span_deconversion_message(loc_key("heretic-mob-monster-freed-others", list(user = owner.current, theyve = owner.current.p_theyve()))), ignored_mobs = owner.current)

	master = null
	return ..()

/datum/antagonist/heretic_monster/apply_innate_effects(mob/living/mob_override)
	. = ..()
	var/mob/living/target = mob_override || owner.current
	ADD_TRAIT(target, TRAIT_HERETIC_SUMMON, REF(src))

/datum/antagonist/heretic_monster/remove_innate_effects(mob/living/mob_override)
	var/mob/living/target = mob_override || owner.current
	REMOVE_TRAIT(target, TRAIT_HERETIC_SUMMON, REF(src))
	return ..()

/*
 * Set our [master] var to a new mind.
 */
/datum/antagonist/heretic_monster/proc/set_owner(datum/mind/master)
	src.master = master
	owner.enslave_mind_to_creator(master.current)

	var/datum/objective/master_obj = new()
	master_obj.owner = owner
	master_obj.explanation_text = "Assist your master."
	master_obj.completed = TRUE

	objectives += master_obj
	owner.announce_objectives()
	to_chat(owner, span_boldnotice(ishuman(owner.current) ? LOC_KEY("heretic-mob-monster-gained-human") : LOC_KEY("heretic-mob-monster-gained-other")))
	to_chat(owner, span_notice(loc_key("heretic-mob-monster-master", list(master = master))))
