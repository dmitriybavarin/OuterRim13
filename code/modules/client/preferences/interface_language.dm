/datum/preference/choiced/interface_language
	category = PREFERENCE_CATEGORY_GAME_PREFERENCES
	savefile_key = "interface_language"
	savefile_identifier = PREFERENCE_PLAYER

/datum/preference/choiced/interface_language/init_possible_values()
	return list(UI_LANGUAGE_RUSSIAN, UI_LANGUAGE_ENGLISH)

/datum/preference/choiced/interface_language/create_default_value()
	return UI_LANGUAGE_RUSSIAN

/datum/preference/choiced/interface_language/apply_to_client(client/client, value)
	client.apply_client_ui_language(value)

/proc/statpanel_tab_labels(language)
	return list(
		"Status" = localize(LOC_KEY("statpanel-tab-status"), language),
		"MC" = localize(LOC_KEY("statpanel-tab-mc"), language),
		"Admin" = localize(LOC_KEY("statpanel-tab-admin"), language),
		"Debug" = localize(LOC_KEY("statpanel-tab-debug"), language),
		"Mapping" = localize(LOC_KEY("statpanel-tab-mapping"), language),
		"OOC" = localize(LOC_KEY("statpanel-tab-ooc"), language),
		"Server" = localize(LOC_KEY("statpanel-tab-server"), language),
		"Tickets" = localize(LOC_KEY("statpanel-tab-tickets"), language),
	)

/client/proc/apply_client_ui_language(language)
	winset(src, null, list2params(list(
		"infobuttons.options.text" = localize(LOC_KEY("client-ui-menu"), language),
		"infobuttons.hotkeys.text" = localize(LOC_KEY("client-ui-hotkeys"), language),
		"infobuttons.emotes.text" = localize(LOC_KEY("client-ui-emotes"), language),
		"infobuttons.fullscreen-toggle.text" = localize(LOC_KEY("client-ui-fullscreen"), language),
		"infobuttons.reconnect.text" = localize(LOC_KEY("client-ui-reconnect"), language),
		"infobuttons.chat.text" = localize(LOC_KEY("client-ui-toggle-stat-panel"), language),
	)))
	if(stat_panel?.is_ready())
		stat_panel.send_message("set_tab_labels", statpanel_tab_labels(language))
		SSstatpanels.immediate_send_stat_data(src)
