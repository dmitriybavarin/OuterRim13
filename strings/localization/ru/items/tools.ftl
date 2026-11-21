item-pseudocircuit-examine-material = Материала хватит на <b>{ $count }</b> { $count ->
    [one] схему
    [few] схемы
   *[many] схем
 }. Используйте псевдосхему на существующих схемах, чтобы получить материал.

item-pseudocircuit-examine-substitute = Заменяет электронику <b>пожарной и воздушной тревоги</b>, <b>пожарного шлюза</b> и <b>ЛКП</b>.

item-pseudocircuit-examine-cell = Также его можно использовать на ЛКП без батареи, чтобы <b>изготовить батарею малой емкости</b> за большое количество энергии.

item-pseudocircuit-no-cell = Для этого нужна установленная батарея.

item-pseudocircuit-recharging = { $item } сначала нужно время на перезарядку.

item-pseudocircuit-no-energy = У вас не хватает энергии (нужно { $energy }).

item-pseudocircuit-no-material = Нужно больше материала. Используйте { ACC($item) } на существующих простых схемах, чтобы разобрать их.

item-pseudocircuit-recycle-others = Пользователь разбирает { ACC($target) } с помощью { GEN($item) }.

item-pseudocircuit-recycle-self = Вы пускаете { ACC($target) } на переработку в { ACC($item) }. Теперь материала хватит на схемы: <b>{ $count }</b>.

item-forcefield-projector-deactivate-one = Вы отключаете { ACC($target) }.

item-forcefield-projector-exists = В этом месте уже есть силовое поле!

item-forcefield-projector-too-close = Цель слишком близко, отмена!

item-forcefield-projector-limit = { $item } не может поддерживать больше силовых полей!

item-forcefield-projector-busy = { $item } занят созданием силового поля.

item-forcefield-projector-project-others = { $user } проецирует силовое поле!

item-forcefield-projector-project-self = Вы проецируете силовое поле.

item-forcefield-projector-deactivate-all = Вы отключаете { ACC($item) }, и все активные силовые поля пропадают.

item-forcefield-projector-examine = Сейчас поддерживает силовых полей: { $current }/{ $max }, заряд { $charge }%.

item-forcefield-projector-vanish = { $item } мерцает и исчезает!

item-geiger-examine-clear = Alt-клик сбрасывает сохраненные уровни радиации.

item-geiger-examine-safe = Счетчик фонового излучения сообщает, что все в порядке.

item-geiger-examine-low = Фоновая радиация немного выше среднего.

item-geiger-examine-medium = Фоновая радиация выше среднего.

item-geiger-examine-high = Фоновая радиация намного выше среднего.

item-geiger-examine-critical = Фоновая радиация достигает критического уровня!

item-geiger-switch-on = включено

item-geiger-switch-off = выключено

item-geiger-scan-others = { $user } сканирует { ACC($target) } с помощью { GEN($item) }.

item-geiger-scan-self = Вы сканируете уровень радиации { GEN($target) } с помощью { GEN($item) }...

item-geiger-clean-subject = Субъект не заражен радиацией.

item-geiger-clean-target = Цель не заражена радиацией.

item-geiger-reset-off = { $item } должен быть включен, чтобы сбросить уровень радиации!

item-geiger-reset-done = Вы сбрасываете показания радиации { GEN($item) } до нормы.

item-megaphone-suicide = { $user } произносит последние слова в { ACC($item) }! Похоже, это попытка суицида!

item-megaphone-recharge = { $item } нужно перезарядить!

item-megaphone-overloaded = синтезатор голоса перегружен

item-mulligan-kit-examine-identity = Если использовать этот набор после сыворотки Маллигана, для вашей новой внешности создастся фальшивая личность.

item-mulligan-kit-examine-effects = Вас внесут в разные списки станции, создадут ID-карту уровня ассистента и объявят о вашем прибытии по рации.

item-mulligan-kit-no-employee = не выдать себя за сотрудника!

item-mulligan-kit-records-exist = записи уже существуют!

item-mulligan-kit-drop-new = Вы роняете свою новую ID-карту на пол.

item-mulligan-kit-drop-old = Вы роняете свою старую ID-карту на пол.

item-mulligan-kit-eat-paperwork = Вы быстро съедаете оставшиеся бумаги, оставляя только сигнализатор, которым объявили о вашем прибытии на станцию.

item-mulligan-kit-no-records = записей не найдено!

item-multitool-examine-buffer = В его буфере хранится { $buffer }.

item-multitool-examine-empty = Его буфер пуст.

item-multitool-apc-missing = ЛКП не найден!

item-multitool-apc-found = ЛКП найден!

item-multitool-suicide = { $user } прикладывает { ACC($item) } к груди. Похоже, это попытка остановить себе сердце импульсом!

item-multitool-examine-scan = Щелкните правой кнопкой, чтобы просканировать скрытые места поблизости. Из-за ограничений батареи они будут показаны ровно 8 секунд.

item-multitool-examine-ai-clear = Сейчас на вас не должен смотреть ни один ИИ. Продолжайте свои тайные дела.

item-multitool-examine-ai-near = ИИ подбирается неприятно близко. Может, пора бросить то, чем вы занимаетесь.

item-multitool-examine-ai-watching = ИИ (скорее всего) смотрит на вас. Лучше это спрятать.

item-multitool-detection-on = Вы включаете обнаружение ИИ на { PRE($item) }.

item-multitool-detection-off = Вы выключаете обнаружение ИИ на { PRE($item) }.

item-multitool-recharging = перезарядка!

item-multitool-spots-shown = скрытые места поблизости показаны

item-pipe-painter-painted = покрашено в цвет: { $color }

item-pipe-painter-examine = Установлен цвет: { $color }.

item-polycircuit-direct = Использовать { ACC($item) } целиком нельзя, придется достать одну из схем вручную... осторожно.

item-polycircuit-avoid = Вы благоразумно держите руки подальше от { GEN($item) }.

item-polycircuit-remove-start = Вы замечаете нужную схему и осторожно пытаетесь достать ее из { GEN($item) }, не двигайтесь!

item-polycircuit-remove-last = Вы минуете острые края схем и достаете последнюю плату.

item-polycircuit-remove-one = Вы минуете острые края схем и достаете одну плату из { GEN($item) }

item-polycircuit-cut = Вы здорово режетесь об острые углы и края { GEN($item) }!

item-pressure-plate-click = Вы чувствуете, как под вами что-то щелкает!

item-pressure-plate-useless = { $tool } вряд ли что-то даст внутри { GEN($item) }...

item-pressure-plate-attach = Вы прикрепляете { ACC($tool) } к { DAT($item) }!

item-pressure-plate-detach = Вы достаете { ACC($assembly) } из { GEN($item) }.

item-pressure-plate-stuck = Похоже, эту нажимную плиту не выключить...

item-pressure-plate-on = Вы включаете { ACC($item) }.

item-pressure-plate-off = Вы выключаете { ACC($item) }.

item-quantum-keycard-examine-linked = Сейчас она привязана к квантовой площадке.

item-quantum-keycard-examine-area = Площадка находится в зоне: { $area }

item-quantum-keycard-examine-unlink = Alt-клик отвязывает карту.

item-quantum-keycard-examine-link = Вставьте { ACC($item) } в активную квантовую площадку, чтобы привязать.

item-quantum-keycard-unlink-start = Вы начинаете нажимать кнопку отвязки { GEN($item) }...

item-quantum-keycard-unlink-done = Карта дважды пищит и разрывает квантовую связь.
