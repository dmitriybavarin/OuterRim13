item-flashlight-toggle-disrupted = помехи!

item-flashlight-suicide-blind = { $user } подносит { ACC($item) } к глазам и включает... но слеп!

item-flashlight-suicide = { $user } подносит { ACC($item) } к глазам и включает! Похоже, это попытка суицида!

item-flashlight-eyes-covered = Сначала нужно снять { $cover ->
    [helmet] шлем
    [mask] маску
   *[other] очки
 }!

item-flashlight-eyes-missing = У { GEN($target) } нет глаз!

item-flashlight-eyes-shine-self = { $user } светит { INS($item) } себе в глаза.

item-flashlight-eyes-direct-self = Вы направляете { ACC($item) } себе в глаза:

item-flashlight-eyes-blind-self = Вы и сами не уверены, чего ожидали...

item-flashlight-eyes-trippy = Вот это да!

item-flashlight-eyes-direct-others = { $user } направляет { ACC($item) } в глаза { GEN($target) }.

item-flashlight-eyes-direct-target = Вы направляете { ACC($item) } в глаза { GEN($target) }:

item-flashlight-eyes-no-reaction = Зрачки не реагируют на свет!

item-flashlight-eyes-uneven = Зрачки сужаются неравномерно!

item-flashlight-eyes-narrow = Зрачки сужаются.

item-flashlight-eyes-glow = Зрачки жутко светятся!

item-flashlight-eyes-webbed = Глаза оплетены волокнистыми черными щупальцами!

item-flashlight-eyes-unfocused = Зрачки реагируют, но взгляд совершенно расфокусирован.

item-flashlight-eyes-bloodshot = Глаза широко раскрыты, вялые и налиты кровью.

item-flashlight-mouth-covered = Сначала нужно снять { $cover ->
    [helmet] шлем
   *[other] маску
 }!

item-flashlight-mouth-self-others = { $user } светит { INS($item) } себе в рот.

item-flashlight-mouth-point-self = Вы направляете { ACC($item) } себе в рот:

item-flashlight-mouth-no-mirror = Без зеркала вы ничего не увидите.

item-flashlight-mouth-organs-self = Во рту: { $organs }.

item-flashlight-mouth-empty-self = Во рту ничего нет.

item-flashlight-mouth-pills-self = У вас { $count } { $count ->
    [one] вживленная таблетка
    [few] вживленные таблетки
   *[many] вживленных таблеток
 }.

item-flashlight-mouth-direct-others = { $user } светит { INS($item) } в рот { GEN($target) }.

item-flashlight-mouth-point-target = Вы направляете { ACC($item) } в рот { GEN($target) }:

item-flashlight-mouth-organs-target = Во рту: { $organs }.

item-flashlight-mouth-empty-target = Во рту у { GEN($target) } нет органов.

item-flashlight-mouth-pills-target = В зубах у { GEN($target) } { $count ->
    [one] вживлена { $count } таблетка
    [few] вживлены { $count } таблетки
   *[many] вживлено { $count } таблеток
 }.

item-flashlight-lips-blue-self = Ваши губы синеют!

item-flashlight-lips-healthy-self = Ваши губы выглядят здоровыми.

item-flashlight-lips-blue-target = Губы синеют!

item-flashlight-lips-healthy-target = Губы выглядят здоровыми.

item-flashlight-gums-self = Вы прижимаете палец к своим деснам:

item-flashlight-gums-target = Вы прижимаете палец к деснам:

item-flashlight-color-slow = Цвет возвращается медленно!

item-flashlight-color-none = Цвет не возвращается!

item-flashlight-color-quick = Цвет возвращается быстро.

item-flashlight-no-dexterity = Вам не хватает ловкости для этого!

item-flashlight-no-head = У { GEN($target) } нет головы!

item-flashlight-too-dim = Света от { GEN($item) } недостаточно, чтобы что-то разглядеть!

item-penlight-holosign-not-ready = не готово!

item-penlight-holosign-warn = { $user } предлагает медицинскую помощь, пожалуйста, прекратите свои действия.

item-penlight-holosign-created = { $user } создает медицинскую голограмму!

item-flare-out-of-fuel = нет топлива!

item-flare-already-lit = уже горит!

item-flare-light-others = { $user } зажигает { ACC($item) }.

item-flare-light-self = Вы зажигаете { ACC($item) }!

item-candle-cigarette-held-others = { $user } подносит { ACC($cigarette) } к { DAT($item) } и закуривает, как настоящий романтик.

item-candle-cigarette-held-self = Вы подносите { ACC($cigarette) } к { DAT($item) } и закуриваете, как настоящий романтик.

item-candle-cigarette-others = { $user } поджигает { ACC($cigarette) } от { GEN($item) }, как настоящий романтик.

item-candle-cigarette-self = Вы поджигаете { ACC($cigarette) } от { GEN($item) }, как настоящий романтик.

item-candle-ignite-held = { $user } держит { ACC($target) } в пламени { GEN($item) }, давая ему загореться.

item-candle-ignite-target = { $user } поджигает { ACC($target) } с помощью { GEN($item) }, как настоящий романтик.

item-candle-snuff = { $user } гасит { ACC($item) }.

item-emp-flashlight-blink-others = { $user } мигает { INS($item) } в сторону { GEN($target) }.

item-emp-flashlight-blink-target = { $user } мигает { INS($item) } в вашу сторону.

item-emp-flashlight-charges = В { PRE($item) } теперь { $count } { $count ->
    [one] заряд
    [few] заряда
   *[many] зарядов
 }.

item-emp-flashlight-recharging = { DAT($item) } нужно время на перезарядку!

item-glowstick-spent = химсвет израсходован!

item-glowstick-crack-others = { $user } ломает и встряхивает { ACC($item) }.

item-glowstick-crack-self = Вы ломаете и встряхиваете { ACC($item) }, и он загорается!

item-glowstick-suicide-empty = { $user } пытается выдавить жидкость из { GEN($item) } себе в глаза... но он пуст!

item-glowstick-suicide-no-eyes = { $user } пытается выдавить жидкость из { GEN($item) } себе в глаза... но глаз нет!

item-glowstick-suicide = { $user } выдавливает жидкость из { GEN($item) } себе в глаза! Похоже, это попытка суицида!

item-space-furnace-core-inserted = ядро установлено

item-space-furnace-core-missing = нет ядра!

item-space-furnace-no-pressure = нет давления!

item-space-furnace-low-pressure = низкое давление!

item-space-furnace-dies-down = затухает...
