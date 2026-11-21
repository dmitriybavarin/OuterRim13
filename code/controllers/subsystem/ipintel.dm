SUBSYSTEM_DEF(ipintel)
	name = "XKeyScore"
	ss_flags = SS_NO_INIT|SS_NO_FIRE
	/// The threshold for probability to be considered a VPN and/or bad IP
	var/probability_threshold

	/// Cache for previously queried IP addresses and those stored in the database
	var/list/datum/ip_intel/cached_queries = list()
	/// The store for rate limiting
	var/rate_limit_minute
	var/list/history = list()

/// The ip intel for a given address
/datum/ip_intel
	/// If this intel was just queried, the status of the query
	var/query_status
	var/result
	var/address
	var/date

/datum/controller/subsystem/ipintel/OnConfigLoad()
	var/list/fail_messages = list()

	var/contact_email = CONFIG_GET(string/ipintel_email)

	if(!length(contact_email))
		fail_messages += "No contact email"

	if(!findtext(contact_email, "@"))
		fail_messages += "Invalid contact email"

	if(!length(CONFIG_GET(string/ipintel_base)))
		fail_messages += "Invalid query base"

	if (!CONFIG_GET(flag/sql_enabled))
		fail_messages += "The database is not enabled"

	if(length(fail_messages))
		message_admins("IPIntel: Initialization failed check logs!")
		logger.Log(LOG_CATEGORY_GAME_ACCESS, "IPIntel is not enabled because the configs are not valid.", list(
			"fail_messages" = fail_messages,
		))

/datum/controller/subsystem/ipintel/stat_entry(msg)
	msg = "M:[CONFIG_GET(number/ipintel_rate_minute) - rate_limit_minute]"
	return ..()


/datum/controller/subsystem/ipintel/proc/is_enabled()
	return length(CONFIG_GET(string/ipintel_email)) && length(CONFIG_GET(string/ipintel_base)) && CONFIG_GET(flag/sql_enabled)

/datum/controller/subsystem/ipintel/proc/get_address_intel_state(address, probability_override)
	if (!is_enabled())
		return IPINTEL_GOOD_IP
	var/datum/ip_intel/intel = query_address(address)
	if(isnull(intel))
		stack_trace("query_address did not return an ip intel response")
		return IPINTEL_UNKNOWN_INTERNAL_ERROR

	if(istext(intel))
		return intel

	if(!(intel.query_status in list("success", "cached")))
		return IPINTEL_UNKNOWN_QUERY_ERROR
	var/check_probability = probability_override || CONFIG_GET(number/ipintel_rating_bad)
	if(intel.result >= check_probability)
		return IPINTEL_BAD_IP
	return IPINTEL_GOOD_IP

/datum/controller/subsystem/ipintel/proc/is_rate_limited()
	var/static/minute_key
	var/expected_minute_key = floor(REALTIMEOFDAY / 1 MINUTES)

	if(minute_key != expected_minute_key)
		minute_key = expected_minute_key
		rate_limit_minute = 0

	if(rate_limit_minute >= CONFIG_GET(number/ipintel_rate_minute))
		return IPINTEL_RATE_LIMITED_MINUTE
	return FALSE

/datum/controller/subsystem/ipintel/proc/query_address(address, allow_cached = TRUE)
	if (!is_enabled())
		return
	if(allow_cached && fetch_cached_ip_intel(address))
		return cached_queries[address]
	var/is_rate_limited = is_rate_limited()
	if(is_rate_limited)
		return is_rate_limited
	rate_limit_minute += 1

	var/query_base = "https://[CONFIG_GET(string/ipintel_base)]/check.php?ip="
	var/query = "[query_base][address]&contact=[CONFIG_GET(string/ipintel_email)]&flags=b&format=json"

	var/datum/http_request/request = new
	request.prepare(RUSTG_HTTP_METHOD_GET, query)
	request.execute_blocking()
	var/datum/http_response/response = request.into_response()
	var/list/data = json_decode(response.body)
	// Log the response
	logger.Log(LOG_CATEGORY_DEBUG, "ip check response body", data)

	var/datum/ip_intel/intel = new
	intel.query_status = data["status"]
	if(intel.query_status != "success")
		return intel
	intel.result = data["result"]
	if(istext(intel.result))
		intel.result = text2num(intel.result)
	intel.date = ISOtime()
	intel.address = address
	cached_queries[address] = intel
	add_intel_to_database(intel)
	return intel

/datum/controller/subsystem/ipintel/proc/add_intel_to_database(datum/ip_intel/intel)
	set waitfor = FALSE //no need to make the client connection wait for this step.
	if (!SSdbcore.Connect())
		return
	var/datum/db_query/query = SSdbcore.NewQuery(
		"INSERT INTO [format_table_name("ipintel")] ( \
			ip, \
			intel \
		) VALUES ( \
			INET_ATON(:address), \
			:result \
		)", list(
			"address" = intel.address,
			"result" = intel.result,
		)
	)
	query.warn_execute()
	query.sync()
	QDEL_NULL(query)

/datum/controller/subsystem/ipintel/proc/fetch_cached_ip_intel(address)
	if (!SSdbcore.Connect())
		return
	var/ipintel_cache_length = CONFIG_GET(number/ipintel_cache_length)
	var/date_restrictor = ""
	var/sql_args = list("address" = address)
	if(ipintel_cache_length > 1)
		date_restrictor = " AND date > DATE_SUB(NOW(), INTERVAL :ipintel_cache_length DAY)"
		sql_args["ipintel_cache_length"] = ipintel_cache_length
	var/datum/db_query/query = SSdbcore.NewQuery(
		"SELECT * FROM [format_table_name("ipintel")] WHERE ip = INET_ATON(:address)[date_restrictor]",
		sql_args
	)
	query.warn_execute()
	query.sync()
	if(query.status == DB_QUERY_BROKEN)
		qdel(query)
		return null

	query.NextRow()
	var/list/data = query.item
	QDEL_NULL(query)
	if(isnull(data))
		return null

	var/datum/ip_intel/intel = new
	intel.query_status = "cached"
	intel.result = data[3]
	if(istext(intel.result))
		intel.result = text2num(intel.result)
	intel.date = data[2]
	intel.address = address
	cached_queries[address] = intel
	return TRUE

/datum/controller/subsystem/ipintel/proc/is_exempt(client/player)
	if(player.holder || GLOB.deadmins[player.ckey])
		return TRUE
	var/exempt_living_playtime = CONFIG_GET(number/ipintel_exempt_playtime_living)
	if(exempt_living_playtime > 0)
		var/list/play_records = player.prefs.exp
		if (!play_records.len)
			player.set_exp_from_db()
			play_records = player.prefs.exp
		if(length(play_records) && play_records[EXP_TYPE_LIVING] > exempt_living_playtime)
			return TRUE
	return FALSE

/datum/controller/subsystem/ipintel/proc/record_history(ckey, address, state, score, admin)
	history.Insert(1, list(list(
		"time" = ISOtime(),
		"ckey" = ckey,
		"address" = address,
		"state" = state,
		"score" = score,
		"admin" = admin,
	)))
	if(length(history) > IPINTEL_HISTORY_LIMIT)
		history.Cut(IPINTEL_HISTORY_LIMIT + 1)

/datum/controller/subsystem/ipintel/proc/whitelist_add(ckey, admin_ckey)
	var/datum/db_query/query = SSdbcore.NewQuery(
		"INSERT INTO [format_table_name("ipintel_whitelist")] ( \
			ckey, \
			admin_ckey \
		) VALUES ( \
			:ckey, \
			:admin_ckey \
		)", list(
			"ckey" = ckey,
			"admin_ckey" = admin_ckey,
		)
	)
	query.warn_execute()
	query.sync()
	QDEL_NULL(query)

/datum/controller/subsystem/ipintel/proc/whitelist_remove(ckey)
	var/datum/db_query/query = SSdbcore.NewQuery(
		"DELETE FROM [format_table_name("ipintel_whitelist")] WHERE ckey = :ckey", list(
			"ckey" = ckey
		)
	)
	query.warn_execute()
	query.sync()
	QDEL_NULL(query)

/datum/controller/subsystem/ipintel/proc/is_whitelisted(ckey)
	var/datum/db_query/query = SSdbcore.NewQuery(
		"SELECT * FROM [format_table_name("ipintel_whitelist")] WHERE ckey = :ckey", list(
			"ckey" = ckey
		)
	)
	query.warn_execute()
	query.sync()
	if(query.status == DB_QUERY_BROKEN)
		qdel(query)
		return FALSE
	query.NextRow()
	. = !!query.item // if they have a row, they are whitelisted
	QDEL_NULL(query)


ADMIN_VERB(ipintel_allow, R_BAN, "Whitelist Player VPN", "Allow a player to connect even if they are using a VPN.", ADMIN_CATEGORY_IPINTEL)
	VERB_ARG(ckey, VERB_ARG_TYPE_TEXT, VERB_ARG_SOURCE_INPUT)
	if (!SSipintel.is_enabled())
		to_chat(user, "The ipintel system is not currently enabled but you can still edit the whitelists")
	if(SSipintel.is_whitelisted(ckey))
		to_chat(user, "Player is already whitelisted.")
		return

	SSipintel.whitelist_add(ckey, user.ckey)
	message_admins("IPINTEL: [key_name_admin(user)] has whitelisted '[ckey]'")

ADMIN_VERB(ipintel_revoke, R_BAN, "Revoke Player VPN Whitelist", "Revoke a player's VPN whitelist.", ADMIN_CATEGORY_IPINTEL)
	VERB_ARG(ckey, VERB_ARG_TYPE_TEXT, VERB_ARG_SOURCE_INPUT)
	if (!SSipintel.is_enabled())
		to_chat(user, "The ipintel system is not currently enabled but you can still edit the whitelists")
	if(!SSipintel.is_whitelisted(ckey))
		to_chat(user, "Player is not whitelisted.")
		return
	SSipintel.whitelist_remove(ckey)
	message_admins("IPINTEL: [key_name_admin(user)] has revoked the VPN whitelist for '[ckey]'")

/client/proc/check_ip_intel()
	if (!SSipintel.is_enabled())
		return
	if(SSipintel.is_exempt(src) || SSipintel.is_whitelisted(ckey))
		return

	var/intel_state = SSipintel.get_address_intel_state(address)
	var/reject_bad_intel = CONFIG_GET(flag/ipintel_reject_bad)
	var/reject_unknown_intel = CONFIG_GET(flag/ipintel_reject_unknown)
	var/reject_rate_limited = CONFIG_GET(flag/ipintel_reject_rate_limited)

	var/connection_rejected = FALSE
	var/datum/ip_intel/intel = SSipintel.cached_queries[address]
	SSipintel.record_history(ckey, address, intel_state, intel?.result)
	switch(intel_state)
		if(IPINTEL_BAD_IP)
			log_access("IPINTEL: [ckey] was flagged as a VPN with [intel.result * 100]% likelihood.")
			if(reject_bad_intel)
				to_chat_immediate(src, span_boldnotice("Your connection has been detected as a VPN."))
				connection_rejected = TRUE
			else
				message_admins("IPINTEL: [key_name_admin(src)] has been flagged as a VPN with [intel.result * 100]% likelihood.")

		if(IPINTEL_RATE_LIMITED_DAY, IPINTEL_RATE_LIMITED_MINUTE)
			log_access("IPINTEL: [ckey] was unable to be checked due to the rate limit.")
			if(reject_rate_limited)
				to_chat_immediate(src, span_boldnotice("New connections are not being allowed at this time."))
				connection_rejected = TRUE
			else
				message_admins("IPINTEL: [key_name_admin(src)] was unable to be checked due to rate limiting.")

		if(IPINTEL_UNKNOWN_INTERNAL_ERROR, IPINTEL_UNKNOWN_QUERY_ERROR)
			log_access("IPINTEL: [ckey] unable to be checked due to an error.")
			if(reject_unknown_intel)
				to_chat_immediate(src, span_boldnotice("Your connection cannot be processed at this time."))
				connection_rejected = TRUE
			else
				message_admins("IPINTEL: [key_name_admin(src)] was unable to be checked due to an error.")

	if(!connection_rejected)
		return

	var/list/contact_where = list()
	var/forum_url = CONFIG_GET(string/forumurl)
	if(forum_url)
		contact_where += list("<a href='[forum_url]'>Forums</a>")
	var/appeal_url = CONFIG_GET(string/banappeals)
	if(appeal_url)
		contact_where += list("<a href='[appeal_url]'>Ban Appeals</a>")

	var/message_string = "Your connection has been rejected at this time. If you believe this is in error or have any questions please contact an admin"
	if(length(contact_where))
		message_string += " at [english_list(contact_where)]"
	else
		message_string += " somehow."
	message_string += "."

	to_chat_immediate(src, span_userdanger(message_string))
	qdel(src)

ADMIN_VERB(ipintel_panel, R_BAN, "IPIntel Panel", "Inspect the IP intel status, look up players and manage the VPN whitelist.", ADMIN_CATEGORY_IPINTEL)
	var/datum/ipintel_panel/panel = new
	panel.ui_interact(user.mob)

/datum/ipintel_panel
	var/list/result
	var/list/whitelist = list()
	var/cache_rows = 0
	var/db_online = FALSE
	var/feedback
	var/last_query = ""

/datum/ipintel_panel/New()
	. = ..()
	load_database_stats()

/datum/ipintel_panel/proc/load_database_stats()
	whitelist = list()
	cache_rows = 0
	db_online = !!SSdbcore.Connect()
	if(!db_online)
		return
	var/datum/db_query/count_query = SSdbcore.NewQuery("SELECT COUNT(*) FROM [format_table_name("ipintel")]")
	if(count_query.Execute() && count_query.NextRow())
		cache_rows = text2num(count_query.item[1])
	qdel(count_query)
	var/datum/db_query/list_query = SSdbcore.NewQuery("SELECT ckey, admin_ckey FROM [format_table_name("ipintel_whitelist")] ORDER BY ckey")
	if(list_query.Execute())
		while(list_query.NextRow())
			whitelist += list(list("ckey" = list_query.item[1], "admin" = list_query.item[2]))
	qdel(list_query)

/datum/ipintel_panel/proc/is_valid_address(text)
	var/list/parts = splittext(text, ".")
	if(length(parts) != 4)
		return FALSE
	for(var/part in parts)
		var/number = text2num(part)
		if(!length(part) || length(part) > 3 || isnull(number) || number < 0 || number > 255)
			return FALSE
	return TRUE

/datum/ipintel_panel/proc/resolve_address(text)
	var/found_ckey
	var/address
	if(is_valid_address(text))
		address = text
	else
		found_ckey = ckey(text)
		var/client/online = GLOB.directory[found_ckey]
		if(online)
			address = online.address
		else if(db_online)
			var/datum/db_query/query = SSdbcore.NewQuery("SELECT INET_NTOA(ip) FROM [format_table_name("player")] WHERE ckey = :ckey", list("ckey" = found_ckey))
			if(query.Execute() && query.NextRow())
				address = query.item[1]
			qdel(query)
	return list(found_ckey, address)

/datum/ipintel_panel/proc/stored_intel(address)
	if(!db_online)
		return null
	var/datum/db_query/query = SSdbcore.NewQuery("SELECT intel, date FROM [format_table_name("ipintel")] WHERE ip = INET_ATON(:address)", list("address" = address))
	var/list/found
	if(query.Execute() && query.NextRow())
		found = list("score" = text2num(query.item[1]), "date" = "[query.item[2]]")
	qdel(query)
	return found

/datum/ipintel_panel/proc/delete_stored_intel(address)
	SSipintel.cached_queries -= address
	if(!db_online)
		return
	var/datum/db_query/query = SSdbcore.NewQuery("DELETE FROM [format_table_name("ipintel")] WHERE ip = INET_ATON(:address)", list("address" = address))
	query.Execute()
	qdel(query)

/datum/ipintel_panel/proc/build_result(search_text, found_ckey, address)
	var/list/new_result = list(
		"query" = search_text,
		"ckey" = found_ckey,
		"address" = address,
		"found" = FALSE,
		"score" = null,
		"date" = null,
		"checked_by" = null,
		"bad" = FALSE,
		"whitelisted" = found_ckey ? SSipintel.is_whitelisted(found_ckey) : FALSE,
	)
	var/list/stored = stored_intel(address)
	if(stored)
		new_result["found"] = TRUE
		new_result["score"] = stored["score"]
		new_result["date"] = stored["date"]
		new_result["bad"] = stored["score"] >= CONFIG_GET(number/ipintel_rating_bad)
	for(var/list/entry as anything in SSipintel.history)
		if(entry["address"] == address)
			new_result["checked_by"] = entry["admin"] || "auto"
			break
	return new_result

/datum/ipintel_panel/proc/mask_email(email)
	var/at_position = findtext(email, "@")
	if(!at_position)
		return ""
	return "[copytext(email, 1, min(at_position, 3))]***[copytext(email, at_position)]"

/datum/ipintel_panel/ui_state(mob/user)
	return ADMIN_STATE(R_BAN)

/datum/ipintel_panel/ui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "IPIntel")
		ui.open()

/datum/ipintel_panel/ui_data(mob/user)
	var/list/data = list()
	var/contact_email = CONFIG_GET(string/ipintel_email)
	var/list/problems = list()
	if(!length(contact_email) || !findtext(contact_email, "@"))
		problems += "email"
	if(!length(CONFIG_GET(string/ipintel_base)))
		problems += "base"
	if(!CONFIG_GET(flag/sql_enabled))
		problems += "sql"
	SSipintel.is_rate_limited()
	data["enabled"] = !!SSipintel.is_enabled()
	data["problems"] = problems
	data["email"] = mask_email(contact_email)
	data["base"] = CONFIG_GET(string/ipintel_base)
	data["db_online"] = db_online
	data["rate_limit"] = CONFIG_GET(number/ipintel_rate_minute)
	data["rate_used"] = SSipintel.rate_limit_minute || 0
	data["cache_days"] = CONFIG_GET(number/ipintel_cache_length)
	data["cache_memory"] = length(SSipintel.cached_queries)
	data["cache_rows"] = cache_rows
	data["threshold"] = CONFIG_GET(number/ipintel_rating_bad)
	data["reject_bad"] = !!CONFIG_GET(flag/ipintel_reject_bad)
	data["reject_unknown"] = !!CONFIG_GET(flag/ipintel_reject_unknown)
	data["reject_rate_limited"] = !!CONFIG_GET(flag/ipintel_reject_rate_limited)
	data["exempt_playtime"] = CONFIG_GET(number/ipintel_exempt_playtime_living)
	data["result"] = result
	data["feedback"] = feedback
	data["last_query"] = last_query
	data["whitelist"] = whitelist
	data["history"] = SSipintel.history
	return data

/datum/ipintel_panel/ui_act(action, list/params, datum/tgui/ui, datum/ui_state/state)
	. = ..()
	if(.)
		return
	var/mob/user = ui.user
	feedback = null
	switch(action)
		if("search")
			var/search_text = trim(copytext("[params["query"]]", 1, 65))
			last_query = search_text
			result = null
			if(!length(search_text))
				return TRUE
			if(!db_online)
				load_database_stats()
			var/list/resolved = resolve_address(search_text)
			if(!resolved[2])
				feedback = "no-address"
				return TRUE
			log_admin("[key_name(user)] looked up IP intel for '[search_text]'.")
			result = build_result(search_text, resolved[1], resolved[2])
			return TRUE
		if("reset")
			if(!result)
				return TRUE
			var/address = result["address"]
			delete_stored_intel(address)
			log_admin("[key_name(user)] reset the IP intel record of '[result["query"]]'.")
			message_admins("IPINTEL: [key_name_admin(user)] has reset the IP intel record of '[result["query"]]'")
			result = build_result(result["query"], result["ckey"], address)
			load_database_stats()
			return TRUE
		if("refresh")
			if(!result)
				return TRUE
			if(!SSipintel.is_enabled())
				feedback = "disabled"
				return TRUE
			if(SSipintel.is_rate_limited())
				feedback = "rate-limited"
				return TRUE
			var/address = result["address"]
			delete_stored_intel(address)
			var/datum/ip_intel/intel = SSipintel.query_address(address, FALSE)
			log_admin("[key_name(user)] refreshed the IP intel record of '[result["query"]]'.")
			message_admins("IPINTEL: [key_name_admin(user)] has refreshed the IP intel record of '[result["query"]]'")
			if(istext(intel))
				feedback = "rate-limited"
			else if(isnull(intel) || intel.query_status != "success")
				feedback = "query-failed"
				SSipintel.record_history(result["ckey"], address, IPINTEL_UNKNOWN_QUERY_ERROR, null, user.ckey)
			else
				SSipintel.record_history(result["ckey"], address, intel.result >= CONFIG_GET(number/ipintel_rating_bad) ? IPINTEL_BAD_IP : IPINTEL_GOOD_IP, intel.result, user.ckey)
			result = build_result(result["query"], result["ckey"], address)
			load_database_stats()
			return TRUE
		if("whitelist_add")
			var/target_ckey = ckey(params["ckey"])
			if(!length(target_ckey) || !SSdbcore.Connect())
				return TRUE
			if(SSipintel.is_whitelisted(target_ckey))
				feedback = "already-whitelisted"
				return TRUE
			SSipintel.whitelist_add(target_ckey, user.ckey)
			log_admin("[key_name(user)] whitelisted '[target_ckey]' for IPIntel.")
			message_admins("IPINTEL: [key_name_admin(user)] has whitelisted '[target_ckey]'")
			load_database_stats()
			if(result?["ckey"] == target_ckey)
				result["whitelisted"] = TRUE
			return TRUE
		if("whitelist_remove")
			var/target_ckey = ckey(params["ckey"])
			if(!length(target_ckey) || !SSdbcore.Connect())
				return TRUE
			if(!SSipintel.is_whitelisted(target_ckey))
				feedback = "not-whitelisted"
				return TRUE
			SSipintel.whitelist_remove(target_ckey)
			log_admin("[key_name(user)] revoked the IPIntel whitelist of '[target_ckey]'.")
			message_admins("IPINTEL: [key_name_admin(user)] has revoked the VPN whitelist for '[target_ckey]'")
			load_database_stats()
			if(result?["ckey"] == target_ckey)
				result["whitelisted"] = FALSE
			return TRUE
		if("reload")
			load_database_stats()
			return TRUE
