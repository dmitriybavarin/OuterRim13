/**
 * Security levels
 *
 * These are used by the security level subsystem. Each one of these represents a security level that a player can set.
 *
 * Base type is abstract
 */

/datum/security_level
	/// The name of this security level.
	var/name = "not set"
	var/name_loc
	/// A three-letter shortform of the security level.
	var/name_shortform = "not set"
	/// The color of our announcement divider.
	var/announcement_color = "default"
	/// The numerical level of this security level, see defines for more information.
	var/number_level = -1
	/// Icon state that will be displayed on displays during this security level
	var/status_display_icon_state
	/// The color of the fire alarm light set when changed to this security level
	var/fire_alarm_light_color
	/// The sound that we will play when this security level is set
	var/sound
	/// The looping sound that will be played while the security level is set
	var/looping_sound
	/// The looping sound interval
	var/looping_sound_interval
	/// The shuttle call time modification of this security level
	var/shuttle_call_time_mod = 0
	/// Our announcement when lowering to this level
	var/lowering_to_announcement
	/// Our announcement when elevating to this level
	var/elevating_to_announcement
	/// if TRUE, stops mail shipments from being sent during this security level
	var/disables_mail = FALSE

/**
 * GREEN
 *
 * No threats
 */
/datum/security_level/green
	name = "green"
	name_loc = LOC_KEY("security-level-green-name")
	name_shortform = "GRN"
	announcement_color = "green"
	sound = 'sound/announcer/notice/notice2.ogg' // Friendly beep
	number_level = SEC_LEVEL_GREEN
	status_display_icon_state = "greenalert"
	fire_alarm_light_color = LIGHT_COLOR_BLUEGREEN
	lowering_to_announcement = LOC_KEY("security-level-green-lowered")
	shuttle_call_time_mod = ALERT_COEFF_GREEN

/**
 * BLUE
 *
 * Caution advised
 */
/datum/security_level/blue
	name = "blue"
	name_loc = LOC_KEY("security-level-blue-name")
	name_shortform = "BLU"
	announcement_color = "blue"
	sound = 'sound/announcer/notice/notice1.ogg' // Angry alarm
	number_level = SEC_LEVEL_BLUE
	status_display_icon_state = "bluealert"
	fire_alarm_light_color = LIGHT_COLOR_ELECTRIC_CYAN
	lowering_to_announcement = LOC_KEY("security-level-blue-lowered")
	elevating_to_announcement = LOC_KEY("security-level-blue-elevated")
	shuttle_call_time_mod = ALERT_COEFF_BLUE

/**
 * RED
 *
 * Hostile threats
 */
/datum/security_level/red
	name = "red"
	name_loc = LOC_KEY("security-level-red-name")
	name_shortform = "RED"
	announcement_color = "red"
	sound = 'sound/announcer/notice/notice3.ogg' // More angry alarm
	number_level = SEC_LEVEL_RED
	status_display_icon_state = "redalert"
	fire_alarm_light_color = LIGHT_COLOR_FLARE
	lowering_to_announcement = LOC_KEY("security-level-red-lowered")
	elevating_to_announcement = LOC_KEY("security-level-red-elevated")
	shuttle_call_time_mod = ALERT_COEFF_RED
	disables_mail = TRUE
/**
 * DELTA
 *
 * Station destruction is imminent
 */
/datum/security_level/delta
	name = "delta"
	name_loc = LOC_KEY("security-level-delta-name")
	name_shortform = "Δ"
	announcement_color = "purple"
	sound = 'sound/announcer/alarm/airraid.ogg' // Air alarm to signify importance
	number_level = SEC_LEVEL_DELTA
	status_display_icon_state = "deltaalert"
	fire_alarm_light_color = LIGHT_COLOR_INTENSE_RED
	elevating_to_announcement = LOC_KEY("security-level-delta-elevated")
	shuttle_call_time_mod = ALERT_COEFF_DELTA
	disables_mail = TRUE

/datum/security_level/epsilon
	name = "epsilon"
	name_loc = LOC_KEY("security-level-epsilon-name")
	name_shortform = "Ε"
	announcement_color = "pink"
	sound = 'sound/announcer/alarm/airraid.ogg'
	number_level = SEC_LEVEL_EPSILON
	status_display_icon_state = "deltaalert"
	fire_alarm_light_color = LIGHT_COLOR_INTENSE_RED
	elevating_to_announcement = LOC_KEY("security-level-epsilon-elevated")
	shuttle_call_time_mod = ALERT_COEFF_EPSILON
	disables_mail = TRUE

/datum/security_level/gamma
	name = "gamma"
	name_loc = LOC_KEY("security-level-gamma-name")
	name_shortform = "Γ"
	announcement_color = "yellow"
	sound = 'sound/announcer/alarm/airraid.ogg'
	number_level = SEC_LEVEL_GAMMA
	status_display_icon_state = "redalert"
	fire_alarm_light_color = LIGHT_COLOR_DIM_YELLOW
	elevating_to_announcement = LOC_KEY("security-level-gamma-elevated")
	lowering_to_announcement = LOC_KEY("security-level-gamma-lowered")
	shuttle_call_time_mod = ALERT_COEFF_GAMMA
	disables_mail = TRUE

/datum/security_level/eta
	name = "eta"
	name_loc = LOC_KEY("security-level-eta-name")
	name_shortform = "Η"
	announcement_color = "green"
	sound = 'sound/announcer/alarm/airraid.ogg'
	number_level = SEC_LEVEL_ETA
	status_display_icon_state = "greenalert"
	fire_alarm_light_color = LIGHT_COLOR_GREEN
	elevating_to_announcement = LOC_KEY("security-level-eta-elevated")
	lowering_to_announcement = LOC_KEY("security-level-eta-lowered")
	shuttle_call_time_mod = ALERT_COEFF_ETA
	disables_mail = TRUE

/datum/security_level/iota
	name = "iota"
	name_loc = LOC_KEY("security-level-iota-name")
	name_shortform = "Ι"
	announcement_color = "blue"
	sound = 'sound/announcer/alarm/airraid.ogg'
	number_level = SEC_LEVEL_IOTA
	status_display_icon_state = "bluealert"
	fire_alarm_light_color = LIGHT_COLOR_ELECTRIC_CYAN
	elevating_to_announcement = LOC_KEY("security-level-iota-elevated")
	lowering_to_announcement = LOC_KEY("security-level-iota-lowered")
	shuttle_call_time_mod = ALERT_COEFF_IOTA
	disables_mail = TRUE

/datum/security_level/zeta
	name = "zeta"
	name_loc = LOC_KEY("security-level-zeta-name")
	name_shortform = "Ζ"
	announcement_color = "white"
	sound = 'sound/announcer/alarm/airraid.ogg'
	number_level = SEC_LEVEL_ZETA
	status_display_icon_state = "deltaalert"
	fire_alarm_light_color = LIGHT_COLOR_HALOGEN
	elevating_to_announcement = LOC_KEY("security-level-zeta-elevated")
	lowering_to_announcement = LOC_KEY("security-level-zeta-lowered")
	shuttle_call_time_mod = ALERT_COEFF_ZETA
	disables_mail = TRUE

/datum/security_level/theta
	name = "theta"
	name_loc = LOC_KEY("security-level-theta-name")
	name_shortform = "Θ"
	announcement_color = "orange"
	sound = 'sound/announcer/alarm/airraid.ogg'
	number_level = SEC_LEVEL_THETA
	status_display_icon_state = "deltaalert"
	fire_alarm_light_color = LIGHT_COLOR_ORANGE
	elevating_to_announcement = LOC_KEY("security-level-theta-elevated")
	lowering_to_announcement = LOC_KEY("security-level-theta-lowered")
	shuttle_call_time_mod = ALERT_COEFF_THETA
	disables_mail = TRUE

/datum/security_level/kappa
	name = "kappa"
	name_loc = LOC_KEY("security-level-kappa-name")
	name_shortform = "Κ"
	announcement_color = "purple"
	sound = 'sound/announcer/alarm/airraid.ogg'
	number_level = SEC_LEVEL_KAPPA
	status_display_icon_state = "deltaalert"
	fire_alarm_light_color = LIGHT_COLOR_PURPLE
	elevating_to_announcement = LOC_KEY("security-level-kappa-elevated")
	lowering_to_announcement = LOC_KEY("security-level-kappa-lowered")
	shuttle_call_time_mod = ALERT_COEFF_KAPPA
	disables_mail = TRUE
