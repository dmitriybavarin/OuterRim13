wires-title = { $name } Wire Configuration

wires-mend = Mend

wires-cut = Cut

wires-pulse = Pulse

wires-detach = Detach

wires-attach = Attach

seedextractor-scrap = Scrap

seedextractor-take = Take

ntnetrelay-title = NtNet Quantum Relay

ntnetrelay-buffer = Network Buffer

ntnetrelay-enabled = ENABLED

ntnetrelay-disabled = DISABLED

ntnetrelay-gq = GQ

ntnetrelay-overflow = NETWORK BUFFER OVERFLOW

ntnetrelay-recovery = OVERLOAD RECOVERY MODE

ntnetrelay-override = ADMINISTRATOR OVERRIDE

ntnetrelay-caution = CAUTION - DATA LOSS MAY OCCUR

ntnetrelay-purge = PURGE BUFFER

ntnetrelay-warning = This system is suffering temporary outage due to overflow of traffic buffers. Until buffered traffic is processed, all further requests will be dropped. Frequent occurences of this error may indicate insufficient hardware capacity of your network. Please contact your network planning department for instructions on how to resolve this issue.

destinationtagger-title = TagMaster 2.4

destinationtagger-select = Please Select A Location

destinationtagger-current = Current Destination: { $destination }

solar-status = Status

solar-output = Power output

solar-output-value = { $supply } of { $capacity } ({ $percent }%)

solar-panels = Solar panels

solar-tracker = Solar tracker

solar-tracker-ok = OK

solar-tracker-na = N/A

solar-controls = Controls

solar-scan = Scan for new hardware

solar-tracking = Tracking

solar-off = Off

solar-timed = Timed

solar-auto = Auto

solar-azimuth = Azimuth

solar-auto-note = (auto)

airlockelectronics-circuit-shell = Integrated Circuit Shell

airlockelectronics-shell-hint = Whether this airlock can have an integrated circuit placed inside of it or not.

airlockelectronics-shell = Shell

airlockelectronics-access = Access Required

airlockelectronics-one = One

airlockelectronics-all = All

airlockelectronics-unrestricted = Unrestricted Access

airlockelectronics-north = North

airlockelectronics-south = South

airlockelectronics-east = East

airlockelectronics-west = West

airlockelectronics-name = Airlock Name

airlockelectronics-cycle-id = Cycling Id

shieldgen-title = Modular Shield Generator

shieldgen-strength = Shield Strength

shieldgen-regen-radius = Regeneration and Radius

shieldgen-regeneration = Regeneration { $current }/{ $max }

shieldgen-radius = Radius { $current }/{ $max }

shieldgen-settings = Settings

shieldgen-set-radius = Set Radius

shieldgen-limitations = Limitations

shieldgen-external = External only

shieldgen-both = Internal & External

shieldgen-power = Toggle Power

shieldgen-on = On

shieldgen-off = Off

jukebox-player = Song Player

jukebox-stop = Stop

jukebox-play = Play

jukebox-repeat = Repeat

jukebox-track-selected = Track Selected

jukebox-select = Select a Track

jukebox-length = Track Length

jukebox-none = No Track Selected

jukebox-beat = Track Beat

jukebox-beats = { $count ->
    [one] beat
   *[other] beats
}

jukebox-settings = Machine Settings

jukebox-volume = Volume

crayon-basic = Basic

crayon-cap = Cap

crayon-on = On

crayon-off = Off

crayon-custom-color = Custom color

crayon-stencil = Stencil

crayon-text = Text

crayon-buffer = Current Buffer

crayon-new-text = New Text

decalpainter-category = Category

decalpainter-color = Color

decalpainter-custom = Custom

decalpainter-style = Style

fax-about = About Fax

fax-network-name = Network name

fax-network-id = Network ID

fax-visible = Visible to Network

fax-true = true

fax-false = false

fax-paper-title = Paper

fax-remove = Remove

fax-paper = Paper

fax-paper-in-tray = Paper in tray

fax-no-paper = No paper

fax-send = Send

fax-none = The fax couldn't detect any other faxes on the network.

fax-history = History

fax-clear = Clear

fax-history-send = Send

fax-history-receive = Receive

lightcontroller-title = { $name }: Lighting

lightcontroller-color = Change light color

lightcontroller-toggle = Enable/Disable the light

lightcontroller-isolate = Isolate this light for a bit

lightcontroller-direction = Direction

lightcontroller-angle = Angle

lightcontroller-tiles = tiles

lightcontroller-intensity = intensity

lightcontroller-template = Template: { $name }

lightcontroller-use-template = Use template

shuttlebp-visualization-hint = Toggle a visualization of shuttle frames you can use to construct a shuttle. Red tiles indicate frame parts built in invalid areas, or parts of suitable areas that need frame parts built on them.

shuttlebp-visualization = Visualization:

shuttlebp-direction = Shuttle Direction

shuttlebp-direction-hint = This specifies the direction that the shuttle being built is facing.

shuttlebp-new-description = Create a new shuttle using a shuttle frame.

shuttlebp-new-problem-header = The following problems prevent you from creating a shuttle with this frame.

shuttlebp-new-problem-no-frame = You are not on a shuttle frame.

shuttlebp-new-problem-too-many = There are too many custom shuttles currently.

shuttlebp-problem-too-large = This frame is too large.

shuttlebp-problem-apc-partial = This frame includes the APC of a custom area, but does not enclose the entire area. Remove the APC or add the rest of the area to the frame.

shuttlebp-problem-encroach = This frame encroaches on an area custom shuttles may not dock at.

shuttlebp-problem-apc-foreign = This frame includes an APC belonging to a non-custom area.

shuttlebp-build-new = Build New Shuttle

shuttlebp-master-exists = The master blueprint for this shuttle still exists. Whoever has it can copy it to this set of blueprints.

shuttlebp-need-custom = You must be on a custom shuttle to do this.

shuttlebp-connect = Connect To Existing Shuttle

shuttlebp-current-area = Current Area:

shuttlebp-default-area = Default Area

shuttlebp-not-on-shuttle = Not on Shuttle

shuttlebp-new-area-name = New Area Name

shuttlebp-designate-hint = Designate a room within the shuttle as its own area.

shuttlebp-designate-only-default = You can only designate a new area from the default area.

shuttlebp-need-linked = You must be on the linked shuttle to do this.

shuttlebp-designate = Designate New Area

shuttlebp-rename-default = You cannot rename the default area.

shuttlebp-rename = Rename Current Area

shuttlebp-select-area = Select Area

shuttlebp-expand-hint = Expand the selected area with the connected section of the default area.

shuttlebp-expand-both-apc = Both the selected area and the region that it would expand into have APCs. You must remove one first.

shuttlebp-expand-only-default = You can only expand the selected area into the default area.

shuttlebp-expand-area = Expand Area

shuttlebp-expand-description = Expand the linked shuttle with an adjacent shuttle frame.

shuttlebp-expand-problem-header = The following problems prevent you from expanding the shuttle.

shuttlebp-expand-problem-no-frame = You must be standing on the shuttle frame you wish to expand the shuttle with.

shuttlebp-expand-problem-not-adjacent = This frame is not adjacent to the linked shuttle.

shuttlebp-expand-frame = Expand Shuttle With Connected Frame

shuttlebp-undesignate-hint = Merge the current area into the default area.

shuttlebp-undesignate-already = You are already in the default area.

shuttlebp-undesignate-both-apc = Both the current and default areas have APCs. You must remove one first.

shuttlebp-undesignate = Undesignate Area

shuttlebp-cleanup-hint = Remove all empty space from the shuttle.

shuttlebp-cleanup-delete = This will delete any areas left without any space, and will decommission the shuttle entirely if there is nothing left of it.

shuttlebp-cleanup-idle = The shuttle must be idle to do this.

shuttlebp-cleanup-master = Only the master blueprint can do this.

shuttlebp-cleanup = Clean Up Empty Space

shuttlebp-none = None

shuttlebp-promote = Promote To Master Blueprint

quantum-title = Quantum Console

quantum-no-server = No server connected!

quantum-nothing-loaded = Nothing loaded

quantum-broadcast-hint = Toggles whether you broadcast your bitrun to station Entertainment Monitors.

quantum-broadcast = Broadcast

quantum-random-hint = Get a random domain for more rewards. Weighted towards your current points. Minimum: 1 point.

quantum-randomize = Randomize

quantum-points-hint = Accrued points for purchasing domains.

quantum-domains = Virtual Domains

quantum-peaceful = Peaceful

quantum-easy = Easy

quantum-medium = Medium

quantum-hard = Hard

quantum-stop-hint = Begins shutdown. Will notify anyone connected.

quantum-stop = Stop Domain

quantum-deployed = Deployed

quantum-deploy = Deploy

quantum-stop-first = Stop current domain first.

quantum-modular = (Modular)

quantum-secondary = (Secondary Objective Available)

quantum-ghost = (Ghost Interaction)

quantum-cost-hint = Points cost for deploying domain.

quantum-reward-hint = Reward for competing domain.

quantum-clients = Connected Clients

quantum-bandwidth-hint = Available bandwidth for new connections.

quantum-refresh-hint = Refresh avatar data.

quantum-refresh = Refresh

quantum-as = as

quantum-none = None
