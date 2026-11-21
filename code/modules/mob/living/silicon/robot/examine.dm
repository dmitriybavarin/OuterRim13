/mob/living/silicon/robot/examine(mob/user)
	. = list()
	if(desc)
		. += "[desc]"

	var/visible_gender = get_visible_gender()
	var/list/gender_args = list(gender = visible_gender)
	var/model_name = model ? "\improper [model.name]" : "\improper Default"
	var/model_with_article = "\a [model_name]"
	var/model_article = copytext(model_with_article, 1, length(model_with_article) - length(model_name) + 1)
	. += loc_key("examine-cyborg-type", list(gender = visible_gender, article = model_article, model = model_name))

	var/obj/act_module = get_active_held_item()
	if(act_module)
		. += loc_key("examine-cyborg-holding", list(gender = visible_gender, icon = icon2html(act_module, user), item = loc_entity(act_module, "\a [act_module]")))
	. += get_status_effect_examinations(user)
	if (get_brute_loss())
		if (get_brute_loss() < maxHealth*0.5)
			. += span_warning(loc_key("examine-cyborg-dented-light", gender_args))
		else
			. += span_boldwarning(loc_key("examine-cyborg-dented-heavy", gender_args))
	if (get_fire_loss() || get_tox_loss())
		var/overall_fireloss = get_fire_loss() + get_tox_loss()
		if (overall_fireloss < maxHealth * 0.5)
			. += span_warning(loc_key("examine-cyborg-charred-light", gender_args))
		else
			. += span_boldwarning(loc_key("examine-cyborg-charred-heavy", gender_args))
	if (health < -maxHealth*0.5)
		. += span_warning(loc_key("examine-cyborg-barely-operational", gender_args))
	if (fire_stacks < 0)
		. += span_warning(loc_key("examine-cyborg-wet", gender_args))
	else if (fire_stacks > 0)
		. += span_warning(loc_key("examine-cyborg-flammable", gender_args))

	if(opened)
		. += span_warning(loc_key("examine-cyborg-cover-open-[cell ? "cell" : "empty"]", gender_args))
	else
		var/cover_message = loc_key("examine-cyborg-cover-closed", gender_args)
		if(locked)
			if(user == src)
				cover_message = loc_key("examine-cyborg-cover-closed-self", list(gender = visible_gender, link = "<a href='byond://?src=[REF(src)];unlock_self=1'>[LOC_KEY("examine-cyborg-unlock-link")]</a>"))
		else
			cover_message = loc_key("examine-cyborg-cover-closed-unlocked", gender_args)
		. += span_notice(cover_message)

	if(cell && cell.charge <= 0)
		. += span_warning(loc_key("examine-cyborg-battery-dead", gender_args))

	if(IS_UNCONSCIOUS_AND_ALIVE(src))
		. += span_warning(loc_key("examine-cyborg-unresponsive", gender_args))

	switch(stat)
		if(STABLE)
			if(shell)
				. += loc_key("examine-cyborg-shell-[deployed ? "active" : "empty"]", gender_args)
			else if(!client)
				. += loc_key("examine-cyborg-standby", gender_args) //afk
		if(DEAD)
			. += span_deadsay(loc_key("examine-cyborg-corrupted", gender_args))

	. += ..()

/mob/living/silicon/robot/examine_descriptor(mob/user)
	return LOC_KEY("examine-descriptor-cyborg")
