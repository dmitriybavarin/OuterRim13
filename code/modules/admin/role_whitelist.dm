#define ROLE_WHITELIST_FILE "data/role_whitelist.json"
#define ROLE_WHITELIST_CATEGORY_OTHER "Other"
#define ROLE_WHITELIST_CATEGORY_COLOR "#4c6fb0"
#define ROLE_WHITELIST_DEPARTMENT_PREFIX "department:"
#define ROLE_WHITELIST_NEW_CATEGORY "__new__"
#define ROLE_WHITELIST_CATEGORY_MAX_LENGTH 40
#define ROLE_WHITELIST_CATEGORY_SPECOPS "Департамент Специальных Операций"
#define ROLE_WHITELIST_CATEGORY_SPECOPS_LEGACY "Специальные операции"

GLOBAL_DATUM_INIT(role_whitelist, /datum/role_whitelist, new)

/datum/role_whitelist
	var/list/roles = list()
	var/list/grants = list()
	var/list/seeded = list()

/datum/role_whitelist/New()
	. = ..()
	load()

/datum/role_whitelist/proc/load()
	roles = list()
	grants = list()
	seeded = list()
	if(fexists(ROLE_WHITELIST_FILE))
		read_file()
	seed_defaults()

/datum/role_whitelist/proc/seed_defaults()
	var/changed = FALSE
	for(var/title in list(JOB_SPECIAL_OPS_OFFICER, JOB_SPECIAL_OPS_DIRECTOR))
		if(title in seeded)
			var/list/entry = roles[title]
			if(entry && entry["category"] == ROLE_WHITELIST_CATEGORY_SPECOPS_LEGACY)
				entry["category"] = ROLE_WHITELIST_CATEGORY_SPECOPS
				changed = TRUE
			continue
		seeded += title
		changed = TRUE
		if(!(title in roles))
			roles[title] = list("category" = ROLE_WHITELIST_CATEGORY_SPECOPS, "restricted" = TRUE, "hidden" = FALSE)
	if(changed)
		save()

/datum/role_whitelist/proc/read_file()
	var/list/stored = json_decode(file2text(ROLE_WHITELIST_FILE))
	if(!islist(stored))
		return
	var/list/stored_roles = stored["roles"]
	if(islist(stored_roles))
		for(var/title in stored_roles)
			var/list/entry = stored_roles[title]
			if(!islist(entry))
				continue
			roles[title] = list(
				"category" = istext(entry["category"]) ? entry["category"] : null,
				"restricted" = !!entry["restricted"],
				"hidden" = !!entry["hidden"],
			)
	var/list/stored_seeded = stored["seeded"]
	if(islist(stored_seeded))
		seeded = stored_seeded.Copy()
	var/list/stored_grants = stored["grants"]
	if(islist(stored_grants))
		for(var/ckey in stored_grants)
			var/list/titles = stored_grants[ckey]
			if(islist(titles) && length(titles))
				grants[ckey] = titles.Copy()

/datum/role_whitelist/proc/save()
	var/list/stored = list("roles" = roles, "grants" = grants, "seeded" = seeded)
	rustg_file_write(json_encode(stored), ROLE_WHITELIST_FILE)

/datum/role_whitelist/proc/department_catalog()
	var/static/list/catalog
	if(!catalog)
		catalog = list()
		for(var/path in subtypesof(/datum/job_department))
			var/datum/job_department/department = path
			catalog[initial(department.department_name)] = initial(department.ui_color)
	return catalog

/datum/role_whitelist/proc/normalize_category(raw)
	raw = trim(copytext(trim("[raw]"), 1, ROLE_WHITELIST_CATEGORY_MAX_LENGTH + length(ROLE_WHITELIST_DEPARTMENT_PREFIX) + 1))
	if(!length(raw) || raw == ROLE_WHITELIST_CATEGORY_OTHER || raw == ROLE_WHITELIST_NEW_CATEGORY)
		return ""
	var/list/catalog = department_catalog()
	if(findtext(raw, ROLE_WHITELIST_DEPARTMENT_PREFIX) == 1)
		var/name = copytext(raw, length(ROLE_WHITELIST_DEPARTMENT_PREFIX) + 1)
		return (name in catalog) ? raw : ""
	if(raw in catalog)
		return "[ROLE_WHITELIST_DEPARTMENT_PREFIX][raw]"
	return copytext(raw, 1, ROLE_WHITELIST_CATEGORY_MAX_LENGTH + 1)

/datum/role_whitelist/proc/is_department_category(raw)
	return istext(raw) && findtext(raw, ROLE_WHITELIST_DEPARTMENT_PREFIX) == 1

/datum/role_whitelist/proc/category_display(raw)
	if(is_department_category(raw))
		return copytext(raw, length(ROLE_WHITELIST_DEPARTMENT_PREFIX) + 1)
	return raw

/datum/role_whitelist/proc/raw_category(title)
	var/list/entry = roles[title]
	return entry?["category"]

/datum/role_whitelist/proc/explicit_category(title)
	var/raw = raw_category(title)
	return raw ? category_display(raw) : null

/datum/role_whitelist/proc/category_color(raw)
	if(is_department_category(raw))
		return department_catalog()[category_display(raw)] || ROLE_WHITELIST_CATEGORY_COLOR
	return ROLE_WHITELIST_CATEGORY_COLOR

/datum/role_whitelist/proc/category_of(title)
	return explicit_category(title) || ROLE_WHITELIST_CATEGORY_OTHER

/datum/role_whitelist/proc/is_restricted(title)
	var/list/entry = roles[title]
	return entry && (entry["restricted"] || entry["hidden"])

/datum/role_whitelist/proc/has_bypass(ckey)
	var/datum/admins/holder = GLOB.admin_datums[ckey] || GLOB.deadmins[ckey]
	return holder && (holder.rank_flags() & R_ROLEWHITELISTALL)

/datum/role_whitelist/proc/has_access(ckey, title)
	if(!is_restricted(title))
		return TRUE
	ckey = ckey(ckey)
	if(has_bypass(ckey))
		return TRUE
	return (title in grants[ckey])

/datum/role_whitelist/proc/is_hidden_for(ckey, title)
	var/list/entry = roles[title]
	if(!entry || !entry["hidden"])
		return FALSE
	return !has_access(ckey, title)

/datum/role_whitelist/proc/categories()
	var/list/result = list()
	for(var/title in roles)
		var/category = raw_category(title)
		if(category && !is_department_category(category))
			result |= category
	return result

/datum/role_whitelist/proc/set_role(title, category, restricted, hidden)
	if(!(title in SSjob.name_occupations))
		return FALSE
	category = normalize_category(category)
	restricted = !!restricted
	hidden = !!hidden
	if(!length(category) && !restricted && !hidden)
		roles -= title
	else
		roles[title] = list(
			"category" = length(category) ? category : null,
			"restricted" = restricted,
			"hidden" = hidden,
		)
	save()
	return TRUE

/datum/role_whitelist/proc/grant(ckey, title)
	ckey = ckey(ckey)
	if(!length(ckey) || !(title in roles))
		return FALSE
	LAZYINITLIST(grants[ckey])
	grants[ckey] |= title
	save()
	return TRUE

/datum/role_whitelist/proc/revoke(ckey, title)
	ckey = ckey(ckey)
	if(!length(grants[ckey]))
		return FALSE
	grants[ckey] -= title
	if(!length(grants[ckey]))
		grants -= ckey
	save()
	return TRUE

/datum/role_whitelist/proc/missing_roles_for(ckey, list/titles)
	var/list/missing = list()
	for(var/title in titles)
		if(is_restricted(title) && !has_access(ckey, title))
			missing += title
	return missing

/datum/role_whitelist/proc/hidden_roles_for(ckey, list/titles)
	var/list/result = list()
	for(var/title in titles)
		if(is_hidden_for(ckey, title))
			result += title
	return result

ADMIN_VERB(role_whitelist_panel, R_ROLEWHITELISTMENU|R_ROLEWHITELISTALL, "Role Whitelist", "Manage the role whitelist.", ADMIN_CATEGORY_MAIN)
	var/datum/role_whitelist_panel/panel = new
	panel.ui_interact(user.mob)

/datum/role_whitelist_panel

/datum/role_whitelist_panel/ui_state(mob/user)
	return ADMIN_STATE(R_ROLEWHITELISTMENU|R_ROLEWHITELISTALL)

/datum/role_whitelist_panel/ui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "RoleWhitelist")
		ui.open()

/datum/role_whitelist_panel/proc/default_department_of(title)
	var/datum/job/job = SSjob.get_job(title)
	var/datum/job_department/department_type = job?.department_for_prefs || job?.departments_list?[1]
	return department_type ? initial(department_type.department_name) : null

/datum/role_whitelist_panel/ui_data(mob/user)
	var/list/data = list()
	var/datum/role_whitelist/whitelist = GLOB.role_whitelist
	data["can_edit_all"] = check_rights_for(user.client, R_ROLEWHITELISTALL)
	var/list/holders = list()
	for(var/ckey in whitelist.grants)
		for(var/title in whitelist.grants[ckey])
			holders[title]++
	var/list/roles = list()
	for(var/title in sort_list(assoc_to_keys(SSjob.name_occupations)))
		var/list/entry = whitelist.roles[title]
		roles += list(list(
			"name" = title,
			"category" = whitelist.raw_category(title),
			"department" = default_department_of(title),
			"restricted" = !!entry?["restricted"],
			"hidden" = !!entry?["hidden"],
			"holders" = holders[title] || 0,
		))
	data["roles"] = roles
	data["categories"] = sort_list(whitelist.categories())
	var/list/department_options = list()
	for(var/name in sort_list(assoc_to_keys(whitelist.department_catalog())))
		department_options += list(list("value" = "[ROLE_WHITELIST_DEPARTMENT_PREFIX][name]", "name" = name))
	data["department_categories"] = department_options
	var/list/restricted = list()
	for(var/title in whitelist.roles)
		if(whitelist.is_restricted(title))
			restricted += title
	data["restricted_roles"] = sort_list(restricted)
	var/list/players = list()
	for(var/ckey in sort_list(assoc_to_keys(whitelist.grants)))
		players += list(list("ckey" = ckey, "roles" = whitelist.grants[ckey]))
	data["players"] = players
	return data

/datum/role_whitelist_panel/ui_act(action, list/params, datum/tgui/ui, datum/ui_state/state)
	. = ..()
	if(.)
		return
	var/mob/user = ui.user
	var/datum/role_whitelist/whitelist = GLOB.role_whitelist
	var/can_edit_all = check_rights_for(user.client, R_ROLEWHITELISTALL)
	switch(action)
		if("set_role")
			if(!can_edit_all)
				return TRUE
			var/category = params["category"]
			if(category == ROLE_WHITELIST_NEW_CATEGORY)
				category = tgui_input_text(user, "Enter the new category name.", "New category", max_length = ROLE_WHITELIST_CATEGORY_MAX_LENGTH)
				if(!length(trim(category)))
					return TRUE
				category = strip_html_full(category, ROLE_WHITELIST_CATEGORY_MAX_LENGTH)
			category = whitelist.normalize_category(category)
			if(whitelist.set_role(params["name"], category, params["restricted"], params["hidden"]))
				var/shown = length(category) ? "[whitelist.category_display(category)][whitelist.is_department_category(category) ? " (department)" : ""]" : ROLE_WHITELIST_CATEGORY_OTHER
				log_admin("[key_name(user)] set whitelist role [params["name"]] (category: [shown], restricted: [!!params["restricted"]], hidden: [!!params["hidden"]]).")
				GLOB.latejoin_menu.update_static_data_for_all_viewers()
			return TRUE
		if("grant")
			if(whitelist.grant(params["ckey"], params["role"]))
				log_admin("[key_name(user)] granted whitelist role [params["role"]] to [params["ckey"]].")
			return TRUE
		if("revoke")
			if(whitelist.revoke(params["ckey"], params["role"]))
				log_admin("[key_name(user)] revoked whitelist role [params["role"]] from [params["ckey"]].")
			return TRUE
