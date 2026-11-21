/**
 * Mech prizes + MECHA COMBAT!!
 */

/// Mech battle special attack types.
#define SPECIAL_ATTACK_HEAL 1
#define SPECIAL_ATTACK_DAMAGE 2
#define SPECIAL_ATTACK_UTILITY 3
#define SPECIAL_ATTACK_OTHER 4

/// Max length of a mech battle
#define MAX_BATTLE_LENGTH 50

/obj/item/toy/mecha
	icon = 'icons/obj/toys/toy.dmi'
	icon_state = "fivestarstoy"
	verb_say = "beeps"
	verb_ask = "beeps"
	verb_exclaim = "beeps"
	verb_yell = "beeps"
	w_class = WEIGHT_CLASS_SMALL
	floor_placeable = TRUE
	/// Timer when it'll be off cooldown
	var/timer = 0
	/// Cooldown between play sessions
	var/cooldown = 1.5 SECONDS
	/// Cooldown multiplier after a battle (by default: battle cooldowns are 30 seconds)
	var/cooldown_multiplier = 20
	/// If it makes noise when played with
	var/quiet = FALSE
	/// TRUE = Offering battle to someone || FALSE = Not offering battle
	var/wants_to_battle = FALSE
	/// TRUE = in combat currently || FALSE = Not in combat
	var/in_combat = FALSE
	/// The mech's health in battle
	var/combat_health = 0
	/// The mech's max combat health
	var/max_combat_health = 0
	/// TRUE = the special attack is charged || FALSE = not charged
	var/special_attack_charged = FALSE
	/// What type of special attack they use - SPECIAL_ATTACK_DAMAGE, SPECIAL_ATTACK_HEAL, SPECIAL_ATTACK_UTILITY, SPECIAL_ATTACK_OTHER
	var/special_attack_type = 0
	/// What message their special move gets on examining
	var/special_attack_type_message = ""
	/// The battlecry when using the special attack
	var/special_attack_cry = "*flip"
	/// Current cooldown of their special attack
	var/special_attack_cooldown = 0
	/// This mech's win count in combat
	var/wins = 0
	/// ...And their loss count in combat
	var/losses = 0

/obj/item/toy/mecha/Initialize(mapload)
	. = ..()
	AddElement(/datum/element/series, /obj/item/toy/mecha, "Mini-Mecha action figures")
	AddElement(/datum/element/toy_talk)
	combat_health = max_combat_health
	switch(special_attack_type)
		if(SPECIAL_ATTACK_DAMAGE)
			special_attack_type_message = LOC_KEY("item-toymech-special-damage")
		if(SPECIAL_ATTACK_HEAL)
			special_attack_type_message = LOC_KEY("item-toymech-special-heal")
		if(SPECIAL_ATTACK_UTILITY)
			special_attack_type_message = LOC_KEY("item-toymech-special-utility")
		if(SPECIAL_ATTACK_OTHER)
			special_attack_type_message = loc_key("item-toymech-special-other", list(effect = special_attack_type_message))
		else
			special_attack_type_message = LOC_KEY("item-toymech-special-mystery")

/**
 * this proc combines "sleep" while also checking for if the battle should continue
 *
 * this goes through some of the checks - the toys need to be next to each other to fight!
 * if it's player vs themself: They need to be able to "control" both mechs (either must be adjacent or using TK)
 * if it's player vs player: Both players need to be able to "control" their mechs (either must be adjacent or using TK)
 * if it's player vs mech (suicide): the mech needs to be in range of the player
 * if all the checks are TRUE, it does the sleeps, and returns TRUE. Otherwise, it returns FALSE.
 * Arguments:
 * * delay - the amount of time the sleep at the end of the check will sleep for
 * * attacker - the attacking toy in the battle.
 * * attacker_controller - the controller of the attacking toy. there should ALWAYS be an attacker_controller
 * * opponent - (optional) the defender controller in the battle, for PvP
 */
/obj/item/toy/mecha/proc/combat_sleep(delay, obj/item/toy/mecha/attacker, mob/living/carbon/attacker_controller, mob/living/carbon/opponent)
	if(!attacker_controller)
		return FALSE

	if(!attacker) //if there's no attacker, then attacker_controller IS the attacker
		if(!in_range(src, attacker_controller))
			attacker_controller.visible_message(span_suicide(loc_key("item-toymech-run-away", list(user = attacker_controller, item = src))))
			return FALSE
	else // if there's an attacker, we can procede as normal
		if(!in_range(src, attacker)) //and the two toys aren't next to each other, the battle ends
			attacker_controller.visible_message(span_notice(loc_key("item-toymech-separate-both", list(attacker = attacker, item = src))), \
								span_notice(loc_key("item-toymech-separate-both", list(attacker = attacker, item = src))))
			return FALSE

		//dead men tell no tales, incapacitated men fight no fights
		if(attacker_controller.incapacitated)
			return FALSE
		//if the attacker_controller isn't next to the attacking toy (and doesn't have telekinesis), the battle ends
		if(!in_range(attacker, attacker_controller) && !(attacker_controller.dna.check_mutation(/datum/mutation/telekinesis)))
			attacker_controller.visible_message(span_notice(loc_key("item-toymech-separate-user-others", list(user = attacker_controller.name, attacker = attacker))), \
								span_notice(loc_key("item-toymech-separate-user-self", list(attacker = attacker))))
			return FALSE

		//if it's PVP and the opponent is not next to the defending(src) toy (and doesn't have telekinesis), the battle ends
		if(opponent)
			if(opponent.incapacitated)
				return FALSE
			if(!in_range(src, opponent) && !(opponent.dna.check_mutation(/datum/mutation/telekinesis)))
				opponent.visible_message(span_notice(loc_key("item-toymech-separate-opponent-others", list(user = opponent.name, item = src))), \
							span_notice(loc_key("item-toymech-separate-opponent-self", list(item = src))))
				return FALSE
		//if it's not PVP and the attacker_controller isn't next to the defending toy (and doesn't have telekinesis), the battle ends
		else
			if (!in_range(src, attacker_controller) && !(attacker_controller.dna.check_mutation(/datum/mutation/telekinesis)))
				attacker_controller.visible_message(span_notice(loc_key("item-toymech-separate-three-others", list(user = attacker_controller.name, item = src, attacker = attacker))), \
									span_notice(loc_key("item-toymech-separate-three-self", list(attacker = attacker, item = src))))
				return FALSE

	//if all that is good, then we can sleep peacefully
	sleep(delay)
	return TRUE

//all credit to skasi for toy mech fun ideas
/obj/item/toy/mecha/attack_self(mob/user)
	if(timer < world.time)
		to_chat(user, span_notice(loc_key("item-toymech-play", list(item = src))))
		timer = world.time + cooldown
		if(!quiet)
			playsound(user, 'sound/vehicles/mecha/mechstep.ogg', 20, TRUE)
	else
		. = ..()

/obj/item/toy/mecha/attack_hand(mob/user, list/modifiers)
	. = ..()
	if(.)
		return
	if(loc == user)
		attack_self(user)

/**
 * If you attack a mech with a mech, initiate combat between them
 */
/obj/item/toy/mecha/item_interaction(mob/living/user, obj/item/tool, list/modifiers)
	if(!istype(tool, /obj/item/toy/mecha))
		return NONE
	var/obj/item/toy/mecha/challenger = tool
	if(check_battle_start(user, challenger))
		mecha_brawl(challenger, user)

/**
 * Attack is called from the user's toy, aimed at target(another human), checking for target's toy.
 */
/obj/item/toy/mecha/attack(mob/living/carbon/human/target, mob/living/carbon/human/user)
	if(target == user)
		to_chat(user, span_notice(LOC_KEY("item-toymech-self-battle")))
		return
	else if(!user.combat_mode)
		if(wants_to_battle) //prevent spamming someone with offers
			to_chat(user, span_notice(LOC_KEY("item-toymech-offering")))
			return
		if(!check_battle_start(user)) //if the user's mech isn't ready, don't bother checking
			return

		for(var/obj/item/toy/mecha/gundam as anything in target.get_held_items_of_type(/obj/item/toy/mecha))
			if(!gundam.check_battle_start(target, null, user)) //check if the attacker mech is ready
				break

			//slap them with the metaphorical white glove
			if(gundam.wants_to_battle) //if the target mech wants to battle, initiate the battle from their POV
				mecha_brawl(gundam, target, user) //P = defender's mech / SRC = attacker's mech / target = defender / user = attacker
				gundam.wants_to_battle = FALSE
				return

		//extend the offer of battle to the other mech
		to_chat(user, span_notice(loc_key("item-toymech-offer-user", list(target = target.name))))
		to_chat(target, span_notice("<b>[loc_key("item-toymech-offer-target-title", list(user = user.name, their = user.p_their(), toy = name))]</b> <i>[LOC_KEY("item-toymech-offer-target-hint")]</i>"))
		wants_to_battle = TRUE
		addtimer(CALLBACK(src, PROC_REF(withdraw_offer), user), 6 SECONDS)
		return

	..()

/**
 * Overrides attack_tk - Sorry, you have to be face to face to initiate a battle, it's good sportsmanship
 */
/obj/item/toy/mecha/attack_tk(mob/user)
	if(timer < world.time)
		to_chat(user, span_notice(loc_key("item-toymech-play-telekinesis", list(item = src))))
		timer = world.time + cooldown
		if(!quiet)
			playsound(user, 'sound/vehicles/mecha/mechstep.ogg', 20, TRUE)
	return COMPONENT_CANCEL_ATTACK_CHAIN


/**
 * Resets the request for battle.
 *
 * For use in a timer, this proc resets the wants_to_battle variable after a short period.
 * Arguments:
 * * user - the user wanting to do battle
 */
/obj/item/toy/mecha/proc/withdraw_offer(mob/living/carbon/user)
	if(wants_to_battle)
		wants_to_battle = FALSE
		to_chat(user, span_notice(LOC_KEY("item-toymech-no-battle")))
/**
 * Starts a battle, toy mech vs player. Player... doesn't win.
 */
/obj/item/toy/mecha/suicide_act(mob/living/user)
	if(in_combat)
		to_chat(user, span_notice(loc_key("item-toymech-in-battle", list(item = src))))
		return

	user.visible_message(span_suicide(loc_key("item-toymech-suicide", list(user = user, they = user.p_they(), item = src, theyre = user.p_theyre()))))

	in_combat = TRUE
	sleep(1.5 SECONDS)
	for(var/i in 1 to 4)
		switch(i)
			if(1, 3)
				SpinAnimation(5, 0)
				playsound(src, 'sound/vehicles/mecha/mechstep.ogg', 30, TRUE)
				user.adjust_brute_loss(25)
				user.adjust_stamina_loss(50)
			if(2)
				user.SpinAnimation(5, 0)
				playsound(user, 'sound/items/weapons/smash.ogg', 20, TRUE)
				combat_health-- //we scratched it!
			if(4)
				say(special_attack_cry + "!!")
				user.adjust_stamina_loss(25)

		if(!combat_sleep(1 SECONDS, null, user))
			say("PATHETIC.")
			combat_health = max_combat_health
			in_combat = FALSE
			return SHAME

	sleep(0.5 SECONDS)
	user.adjust_brute_loss(450)

	in_combat = FALSE
	say("AN EASY WIN. MY POWER INCREASES.") // steal a soul, become swole
	add_atom_colour(rgb(255, 115, 115), ADMIN_COLOUR_PRIORITY)
	max_combat_health = round(max_combat_health*1.5 + 0.1)
	combat_health = max_combat_health
	wins++
	return BRUTELOSS

/obj/item/toy/mecha/examine()
	. = ..()
	. += span_notice(loc_key("item-toymech-examine-special", list(cry = special_attack_cry, effect = special_attack_type_message)))
	if(in_combat)
		. += span_notice(loc_key("item-toymech-examine-health-current", list(max = max_combat_health, health = combat_health)))
		. += span_notice(loc_key("item-toymech-examine-light", list(state = special_attack_cooldown ? LOC_KEY("item-toymech-light-cooldown") : LOC_KEY("item-toymech-light-ready"))))
	else
		. += span_notice(loc_key("item-toymech-examine-health", list(max = max_combat_health)))

	if(wins || losses)
		. += span_notice(loc_key("item-toymech-examine-record", list(wins = wins, losses = losses)))

/obj/item/toy/mecha/can_speak(allow_mimes)
	return !quiet && ..()

/**
 * The 'master' proc of the mech battle. Processes the entire battle's events and makes sure it start and finishes correctly.
 *
 * src is the defending toy, and the battle proc is called on it to begin the battle.
 * After going through a few checks at the beginning to ensure the battle can start properly, the battle begins a loop that lasts
 * until either toy has no more health. During this loop, it also ensures the mechs stay in combat range of each other.
 * It will then randomly decide attacks for each toy, occasionally making one or the other use their special attack.
 * When either mech has no more health, the loop ends, and it displays the victor and the loser while updating their stats and resetting them.
 * Arguments:
 * * attacker - the attacking toy, the toy in the attacker_controller's hands
 * * attacker_controller - the user, the one who is holding the toys / controlling the fight
 * * opponent - optional arg used in Mech PvP battles: the other person who is taking part in the fight (controls src)
 */
/obj/item/toy/mecha/proc/mecha_brawl(obj/item/toy/mecha/attacker, mob/living/carbon/attacker_controller, mob/living/carbon/opponent)
	//A GOOD DAY FOR A SWELL BATTLE!
	attacker_controller.visible_message(span_danger(loc_key("item-toymech-collide-others", list(user = attacker_controller.name, attacker = attacker, item = src))), \
						span_danger(loc_key("item-toymech-collide-self", list(attacker = attacker, item = src))), \
						span_hear(LOC_KEY("item-toymech-collide-hear")), COMBAT_MESSAGE_RANGE)

	/// Who's in control of the defender (src)?
	var/mob/living/carbon/src_controller = (opponent)? opponent : attacker_controller
	/// How long has the battle been going?
	var/battle_length = 0

	in_combat = TRUE
	attacker.in_combat = TRUE

	//1.5 second cooldown * 20 = 30 second cooldown after a fight
	timer = world.time + cooldown*cooldown_multiplier
	attacker.timer = world.time + attacker.cooldown*attacker.cooldown_multiplier

	sleep(1 SECONDS)
	//--THE BATTLE BEGINS--
	while(combat_health > 0 && attacker.combat_health > 0 && battle_length < MAX_BATTLE_LENGTH)
		if(!combat_sleep(0.5 SECONDS, attacker, attacker_controller, opponent)) //combat_sleep checks everything we need to have checked for combat to continue
			break

		//before we do anything - deal with charged attacks
		if(special_attack_charged)
			src_controller.visible_message(span_danger(loc_key("item-toymech-unleash-others", list(item = src))), \
							span_danger(loc_key("item-toymech-unleash-self", list(item = src))))
			special_attack_move(attacker)
		else if(attacker.special_attack_charged)

			attacker_controller.visible_message(span_danger(loc_key("item-toymech-unleash-others", list(item = attacker))), \
								span_danger(loc_key("item-toymech-unleash-self", list(item = attacker))))
			attacker.special_attack_move(src)
		else
			//process the cooldowns
			if(special_attack_cooldown > 0)
				special_attack_cooldown--
			if(attacker.special_attack_cooldown > 0)
				attacker.special_attack_cooldown--

			//combat commences
			switch(rand(1,8))
				if(1 to 3) //attacker wins
					if(attacker.special_attack_cooldown == 0 && attacker.combat_health <= round(attacker.max_combat_health/3)) //if health is less than 1/3 and special off CD, use it
						attacker.special_attack_charged = TRUE
						attacker_controller.visible_message(span_danger(loc_key("item-toymech-charge-others", list(item = attacker))), \
											span_danger(loc_key("item-toymech-charge-self", list(item = attacker))))
					else //just attack
						attacker.SpinAnimation(5, 0)
						playsound(attacker, 'sound/vehicles/mecha/mechstep.ogg', 30, TRUE)
						combat_health--
						attacker_controller.visible_message(span_danger(loc_key("item-toymech-devastate-others", list(attacker = attacker, item = src))), \
											span_danger(loc_key("item-toymech-devastate-self", list(attacker = attacker, item = src))), \
											span_hear(LOC_KEY("item-toymech-devastate-hear")), COMBAT_MESSAGE_RANGE)
						if(prob(5))
							combat_health--
							playsound(src, 'sound/effects/meteorimpact.ogg', 20, TRUE)
							attacker_controller.visible_message(span_boldwarning(LOC_KEY("item-toymech-crippling-others")), \
												span_boldwarning(loc_key("item-toymech-crippling-self", list(target = src))), null, COMBAT_MESSAGE_RANGE)

				if(4) //both lose
					attacker.SpinAnimation(5, 0)
					SpinAnimation(5, 0)
					combat_health--
					attacker.combat_health--
					do_sparks(2, FALSE, src)
					do_sparks(2, FALSE, attacker)
					if(prob(50))
						attacker_controller.visible_message(span_danger(loc_key("item-toymech-clash", list(item = attacker, target = src))), \
											span_danger(loc_key("item-toymech-clash", list(item = attacker, target = src))), \
											span_hear(LOC_KEY("item-toymech-clash-hear")), COMBAT_MESSAGE_RANGE)
					else
						src_controller.visible_message(span_danger(loc_key("item-toymech-clash", list(item = src, target = attacker))), \
										span_danger(loc_key("item-toymech-clash", list(item = src, target = attacker))), \
										span_hear(LOC_KEY("item-toymech-clash-hear")), COMBAT_MESSAGE_RANGE)
				if(5) //both win
					playsound(attacker, 'sound/items/weapons/parry.ogg', 20, TRUE)
					if(prob(50))
						attacker_controller.visible_message(span_danger(loc_key("item-toymech-deflect", list(item = src, target = attacker))), \
											span_danger(loc_key("item-toymech-deflect", list(item = src, target = attacker))), \
											span_hear(LOC_KEY("item-toymech-deflect-hear")), COMBAT_MESSAGE_RANGE)
					else
						src_controller.visible_message(span_danger(loc_key("item-toymech-deflect", list(item = attacker, target = src))), \
										span_danger(loc_key("item-toymech-deflect", list(item = attacker, target = src))), \
										span_hear(LOC_KEY("item-toymech-deflect-hear")), COMBAT_MESSAGE_RANGE)

				if(6 to 8) //defender wins
					if(special_attack_cooldown == 0 && combat_health <= round(max_combat_health/3)) //if health is less than 1/3 and special off CD, use it
						special_attack_charged = TRUE
						src_controller.visible_message(span_danger(loc_key("item-toymech-charge-others", list(item = src))), \
										span_danger(loc_key("item-toymech-charge-self", list(item = src))))
					else //just attack
						SpinAnimation(5, 0)
						playsound(src, 'sound/vehicles/mecha/mechstep.ogg', 30, TRUE)
						attacker.combat_health--
						src_controller.visible_message(span_danger(loc_key("item-toymech-smash-others", list(item = src, attacker = attacker))), \
										span_danger(loc_key("item-toymech-smash-self", list(item = src, attacker = attacker))), \
										span_hear(LOC_KEY("item-toymech-smash-hear")), COMBAT_MESSAGE_RANGE)
						if(prob(5))
							attacker.combat_health--
							playsound(attacker, 'sound/effects/meteorimpact.ogg', 20, TRUE)
							src_controller.visible_message(span_boldwarning(LOC_KEY("item-toymech-crippling-others")), \
											span_boldwarning(loc_key("item-toymech-crippling-self", list(target = attacker))), null, COMBAT_MESSAGE_RANGE)
				else
					attacker_controller.visible_message(span_notice(loc_key("item-toymech-awkward-others", list(item = src, attacker = attacker))), \
										span_notice(LOC_KEY("item-toymech-awkward-self")))

		battle_length++
		sleep(0.5 SECONDS)

	/// Lines chosen for the winning mech
	var/list/winlines = list("YOU'RE NOTHING BUT SCRAP!", "I'LL YIELD TO NONE!", "GLORY IS MINE!", "AN EASY FIGHT.", "YOU SHOULD HAVE NEVER FACED ME.", "ROCKED AND SOCKED.")

	if(attacker.combat_health <= 0 && combat_health <= 0) //both lose
		playsound(src, 'sound/machines/warning-buzzer.ogg', 20, TRUE)
		attacker_controller.visible_message(span_boldnotice(loc_key("item-toymech-destruction-others", list(item = src, attacker = attacker))), \
							span_boldnotice(loc_key("item-toymech-destruction-self", list(item = src, attacker = attacker))))
	else if(attacker.combat_health <= 0) //src wins
		wins++
		attacker.losses++
		playsound(attacker, 'sound/effects/light_flicker.ogg', 20, TRUE)
		attacker_controller.visible_message(span_notice(loc_key("item-toymech-falls-apart", list(attacker = attacker))), \
							span_notice(loc_key("item-toymech-falls-apart", list(attacker = attacker))), null, COMBAT_MESSAGE_RANGE)
		say("[pick(winlines)]")
		src_controller.visible_message(span_notice(loc_key("item-toymech-victory-others", list(item = src, attacker = attacker))), \
						span_notice(loc_key("item-toymech-victory-self", list(item = src, attacker = attacker))))
	else if (combat_health <= 0) //attacker wins
		attacker.wins++
		losses++
		playsound(src, 'sound/effects/light_flicker.ogg', 20, TRUE)
		src_controller.visible_message(span_notice(loc_key("item-toymech-collapse", list(item = src))), \
						span_notice(loc_key("item-toymech-collapse", list(item = src))), null, COMBAT_MESSAGE_RANGE)
		attacker.say("[pick(winlines)]")
		attacker_controller.visible_message(span_notice(loc_key("item-toymech-demolish-others", list(attacker = attacker, item = src))), \
							"[span_notice(loc_key("item-toymech-demolish-self", list(attacker = attacker, item = src)))]!")
	else //both win?
		say("NEXT TIME.")
		//don't want to make this a one sided conversation
		quiet? attacker.say("I WENT EASY ON YOU.") : attacker.say("OF COURSE.")

	in_combat = FALSE
	attacker.in_combat = FALSE

	combat_health = max_combat_health
	attacker.combat_health = attacker.max_combat_health

	return

/**
 * This proc checks if a battle can be initiated between src and attacker.
 *
 * Both SRC and attacker (if attacker is included) timers are checked if they're on cooldown, and
 * both SRC and attacker (if attacker is included) are checked if they are in combat already.
 * If any of the above are true, the proc returns FALSE and sends a message to user (and target, if included) otherwise, it returns TRUE
 * Arguments:
 * * user: the user who is initiating the battle
 * * attacker: optional arg for checking two mechs at once
 * * target: optional arg used in Mech PvP battles (if used, attacker is target's toy)
 */
/obj/item/toy/mecha/proc/check_battle_start(mob/living/carbon/user, obj/item/toy/mecha/attacker, mob/living/carbon/target)
	if(attacker?.in_combat)
		to_chat(user, span_notice(loc_key("item-toymech-busy-owner", list(owner = target ? target.p_their() : "Your", toy = attacker.name))))
		to_chat(target, span_notice(loc_key("item-toymech-busy-own", list(toy = attacker.name))))
		return FALSE
	if(in_combat)
		to_chat(user, span_notice(loc_key("item-toymech-busy-own", list(toy = name))))
		to_chat(target, span_notice(loc_key("item-toymech-busy-opponent", list(their = user.p_their(), toy = name))))
		return FALSE
	if(attacker && attacker.timer > world.time)
		to_chat(user, span_notice(loc_key("item-toymech-unready-owner", list(owner = target ? target.p_their() : "Your", toy = attacker.name))))
		to_chat(target, span_notice(loc_key("item-toymech-unready-own", list(toy = attacker.name))))
		return FALSE
	if(timer > world.time)
		to_chat(user, span_notice(loc_key("item-toymech-unready-own", list(toy = name))))
		to_chat(target, span_notice(loc_key("item-toymech-unready-opponent", list(their = user.p_their(), toy = name))))
		return FALSE

	return TRUE

/**
 * Processes any special attack moves that happen in the battle (called in the mechaBattle proc).
 *
 * Makes the toy shout their special attack cry and updates its cooldown. Then, does the special attack.
 * Arguments:
 * * victim - the toy being hit by the special move
 */
/obj/item/toy/mecha/proc/special_attack_move(obj/item/toy/mecha/victim)
	say(special_attack_cry + "!!")

	special_attack_charged = FALSE
	special_attack_cooldown = 3

	switch(special_attack_type)
		if(SPECIAL_ATTACK_DAMAGE) //+2 damage
			victim.combat_health-=2
			playsound(src, 'sound/items/weapons/marauder.ogg', 20, TRUE)
		if(SPECIAL_ATTACK_HEAL) //+2 healing
			combat_health+=2
			playsound(src, 'sound/vehicles/mecha/mech_shield_raise.ogg', 20, TRUE)
		if(SPECIAL_ATTACK_UTILITY) //+1 heal, +1 damage
			victim.combat_health--
			combat_health++
			playsound(src, 'sound/vehicles/mecha/mechmove01.ogg', 30, TRUE)
		if(SPECIAL_ATTACK_OTHER) //other
			super_special_attack(victim)
		else
			say("I FORGOT MY SPECIAL ATTACK...")

/**
 * Base proc for 'other' special attack moves.
 *
 * This one is only for inheritance, each mech with an 'other' type move has their procs below.
 * Arguments:
 * * victim - the toy being hit by the super special move (doesn't necessarily need to be used)
 */
/obj/item/toy/mecha/proc/super_special_attack(obj/item/toy/mecha/victim)
	visible_message(span_notice(loc_key("item-toymech-flip", list(item = src))))

/obj/item/toy/mecha/ripley
	name = "toy Ripley MK-I"
	icon_state = "ripleytoy"
	max_combat_health = 4 //200 integrity
	special_attack_type = SPECIAL_ATTACK_DAMAGE
	special_attack_cry = "CLAMP SMASH"

/obj/item/toy/mecha/ripleymkii
	name = "toy Ripley MK-II"
	icon_state = "ripleymkiitoy"
	max_combat_health = 5 //250 integrity
	special_attack_type = SPECIAL_ATTACK_DAMAGE
	special_attack_cry = "GIGA DRILL BREAK"

/obj/item/toy/mecha/hauler
	name = "toy Hauler"
	icon_state = "haulertoy"
	max_combat_health = 3 //100 integrity?
	special_attack_type = SPECIAL_ATTACK_UTILITY
	special_attack_cry = "HAUL AWAY"

/obj/item/toy/mecha/clarke
	name = "toy Clarke"
	icon_state = "clarketoy"
	max_combat_health = 4 //200 integrity
	special_attack_type = SPECIAL_ATTACK_UTILITY
	special_attack_cry = "ROLL OUT"

/obj/item/toy/mecha/odysseus
	name = "toy Odysseus"
	icon_state = "odysseustoy"
	max_combat_health = 4 //120 integrity
	special_attack_type = SPECIAL_ATTACK_HEAL
	special_attack_cry = "MECHA BEAM"

/obj/item/toy/mecha/gygax
	name = "toy Gygax"
	icon_state = "gygaxtoy"
	max_combat_health = 5 //250 integrity
	special_attack_type = SPECIAL_ATTACK_UTILITY
	special_attack_cry = "SUPER SERVOS"

/obj/item/toy/mecha/durand
	name = "toy Durand"
	icon_state = "durandtoy"
	max_combat_health = 6 //400 integrity
	special_attack_type = SPECIAL_ATTACK_HEAL
	special_attack_cry = "SHIELD OF PROTECTION"

/obj/item/toy/mecha/savannahivanov
	name = "toy Savannah-Ivanov"
	icon_state = "savannahivanovtoy"
	max_combat_health = 7 //450 integrity
	special_attack_type = SPECIAL_ATTACK_UTILITY
	special_attack_cry = "SKYFALL!! IVANOV STRIKE"

/obj/item/toy/mecha/phazon
	name = "toy Phazon"
	icon_state = "phazontoy"
	max_combat_health = 6 //200 integrity
	special_attack_type = SPECIAL_ATTACK_UTILITY
	special_attack_cry = "NO-CLIP"

/obj/item/toy/mecha/honk
	name = "toy H.O.N.K."
	icon_state = "honktoy"
	max_combat_health = 4 //140 integrity
	special_attack_type = SPECIAL_ATTACK_OTHER
	special_attack_type_message = LOC_KEY("item-toymech-effect-honk")
	special_attack_cry = "MEGA HORN"

/obj/item/toy/mecha/honk/super_special_attack(obj/item/toy/mecha/victim)
	playsound(src, 'sound/mobs/non-humanoids/honkbot/honkbot_evil_laugh.ogg', 20, TRUE)
	victim.special_attack_cooldown += 3 //Adds cooldown to the other mech and gives a minor self heal
	combat_health++

/obj/item/toy/mecha/darkgygax
	name = "toy Dark Gygax"
	icon_state = "darkgygaxtoy"
	max_combat_health = 6 //300 integrity
	special_attack_type = SPECIAL_ATTACK_UTILITY
	special_attack_cry = "ULTRA SERVOS"

/obj/item/toy/mecha/mauler
	name = "toy Mauler"
	icon_state = "maulertoy"
	max_combat_health = 7 //500 integrity
	special_attack_type = SPECIAL_ATTACK_DAMAGE
	special_attack_cry = "BULLET STORM"

/obj/item/toy/mecha/darkhonk
	name = "toy Dark H.O.N.K."
	icon_state = "darkhonktoy"
	max_combat_health = 5 //300 integrity
	special_attack_type = SPECIAL_ATTACK_DAMAGE
	special_attack_cry = "BOMBANANA SPREE"

/obj/item/toy/mecha/deathripley
	name = "toy Death-Ripley"
	icon_state = "deathripleytoy"
	max_combat_health = 5 //250 integrity
	special_attack_type = SPECIAL_ATTACK_OTHER
	special_attack_type_message = LOC_KEY("item-toymech-effect-deathripley")
	special_attack_cry = "KILLER CLAMP"

/obj/item/toy/mecha/deathripley/super_special_attack(obj/item/toy/mecha/victim)
	playsound(src, 'sound/items/weapons/sonic_jackhammer.ogg', 20, TRUE)
	if(victim.combat_health < combat_health) //Instantly kills the other mech if its health is below ours.
		say("EXECUTE!!")
		victim.combat_health = 0
	else //Otherwise, just deal one damage.
		victim.combat_health--

/obj/item/toy/mecha/reticence
	name = "toy Reticence"
	icon_state = "reticencetoy"
	quiet = TRUE
	max_combat_health = 4 //100 integrity
	special_attack_type = SPECIAL_ATTACK_OTHER
	special_attack_type_message = LOC_KEY("item-toymech-effect-reticence")
	special_attack_cry = "*wave"

/obj/item/toy/mecha/reticence/super_special_attack(obj/item/toy/mecha/victim)
	special_attack_cooldown-- //Has a lower cooldown...
	victim.special_attack_cooldown++ //and increases the opponent's cooldown by 1...
	victim.combat_health-- //and some free damage.

/obj/item/toy/mecha/marauder
	name = "toy Marauder"
	icon_state = "maraudertoy"
	max_combat_health = 7 //500 integrity
	special_attack_type = SPECIAL_ATTACK_DAMAGE
	special_attack_cry = "BEAM BLAST"

/obj/item/toy/mecha/seraph
	name = "toy Seraph"
	icon_state = "seraphtoy"
	max_combat_health = 8 //550 integrity
	special_attack_type = SPECIAL_ATTACK_DAMAGE
	special_attack_cry = "ROCKET BARRAGE"

/obj/item/toy/mecha/firefighter //rip
	name = "toy Firefighter"
	icon_state = "firefightertoy"
	max_combat_health = 5 //250 integrity?
	special_attack_type = SPECIAL_ATTACK_HEAL
	special_attack_cry = "FIRE SHIELD"

#undef SPECIAL_ATTACK_HEAL
#undef SPECIAL_ATTACK_DAMAGE
#undef SPECIAL_ATTACK_UTILITY
#undef SPECIAL_ATTACK_OTHER
#undef MAX_BATTLE_LENGTH
