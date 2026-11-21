/mob/living/silicon/examine(mob/user) //Displays a silicon's laws to ghosts
	. = ..()
	if(laws && isobserver(user))
		. += "<b>[loc_key("examine-cyborg-laws-heading", list(silicon = src))]</b>"
		for(var/law in laws.get_law_list(include_zeroth = TRUE))
			. += law
