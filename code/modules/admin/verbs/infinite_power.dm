#define INFINITE_POWER_INTERVAL (5 SECONDS)

GLOBAL_VAR(infinite_power_timer)

/proc/refill_station_power()
	for(var/obj/machinery/power/apc/apc as anything in SSmachines.get_machines_by_type_and_subtypes(/obj/machinery/power/apc))
		if(apc.cell && is_station_level(apc.z))
			apc.cell.charge = apc.cell.maxcharge
			COOLDOWN_RESET(apc, failure_timer)
	for(var/obj/machinery/power/smes/smes as anything in SSmachines.get_machines_by_type_and_subtypes(/obj/machinery/power/smes))
		if(!is_station_level(smes.z))
			continue
		smes.adjust_charge(INFINITY)
		smes.output_level = smes.output_level_max
		smes.output_attempt = TRUE
		smes.update_appearance()
		smes.power_change()

ADMIN_VERB(toggle_infinite_power, R_DEBUG|R_FUN, "Toggle Infinite Station Power", "Keeps every station APC and SMES fully charged until toggled off.", ADMIN_CATEGORY_DEBUG)
	if(GLOB.infinite_power_timer)
		deltimer(GLOB.infinite_power_timer)
		GLOB.infinite_power_timer = null
		message_admins("[key_name_admin(user)] disabled infinite station power.")
		log_admin("[key_name(user)] disabled infinite station power.")
		return
	refill_station_power()
	GLOB.infinite_power_timer = addtimer(CALLBACK(GLOBAL_PROC, GLOBAL_PROC_REF(refill_station_power)), INFINITE_POWER_INTERVAL, TIMER_STOPPABLE|TIMER_LOOP)
	message_admins("[key_name_admin(user)] enabled infinite station power.")
	log_admin("[key_name(user)] enabled infinite station power.")

#undef INFINITE_POWER_INTERVAL
