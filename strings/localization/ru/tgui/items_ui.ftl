stackcrafting-amount = Количество: { $amount }

stackcrafting-empty = Рецепты не найдены.

stackcrafting-sheets = { $count ->
    [one] { $count } лист
    [few] { $count } листа
   *[many] { $count } листов
 }

sparring-weapons = Оружие:

sparring-contract-tip = Божество капеллана требует честных поединков, поэтому используются контракты. Подпись под контрактом задает условия боя. Затем тот, с кем вы собираетесь драться, должен подписать другую сторону. Если условия изменить в уже подписанном контракте, подписи сотрутся, и условия придется согласовывать заново.

sparring-contract = Что за контракт?

sparring-weapon-1 = Кулачный бой

sparring-weapon-2 = Церемониальное оружие

sparring-weapon-3 = Только ближний бой

sparring-weapon-4 = Любое оружие

sparring-weapon-1-desc = Вы деретесь только кулаками. Любое оружие считается нарушением.

sparring-weapon-2-desc = Драться можно только церемониальным оружием. Без него вы окажетесь в тяжелом положении!

sparring-weapon-3-desc = Можно драться оружием, а если его нет, то кулаками. Дальнобойное оружие считается нарушением.

sparring-weapon-4-desc = Можно использовать любое оружие на ваше усмотрение. Постарайтесь только не убить противника, ладно?

sparring-arena = Арена:

sparring-arena-desc = Бой пройдет в зоне «{ $area }». Покинуть арену посреди боя считается нарушением.

sparring-stakes = Ставки:

sparring-stakes-1 = Без ставок

sparring-stakes-2 = Священный поединок

sparring-stakes-3 = Поединок на деньги

sparring-stakes-4 = Ваша душа

sparring-stakes-1-desc = Без ставок, просто для удовольствия. Кто не любит дружескую спарринг-схватку?

sparring-stakes-2-desc = Поединок во славу божества капеллана. Капеллан серьезно расплачивается за поражение, но победа укрепляет его секту.

sparring-stakes-3-desc = Поединок на деньги. Победитель забирает все деньги проигравшего.

sparring-stakes-4-desc = Смертельный поединок: душа проигравшего переходит во владение победителя.

sparring-sign = Подписать

sparring-vs = VS

sparring-fight = В БОЙ!

sparring-clear-tip = Если вы уже подписали контракт, но хотите пересмотреть условия, сотрите подписи этой кнопкой.

sparring-clear = Стереть

sparring-in-arena = Оба участника находятся в зоне «{ $area }».

sparring-need-arena = Оба участника должны быть на арене!

sparring-signed = Обе подписи на месте, условия согласованы.

sparring-need-signed = Нужны подписи обоих бойцов под условиями!

sparring-chaplain-present = Присутствует хотя бы один капеллан. Священные поединки разрешены.

sparring-chaplain-absent = На этом бою нет капеллана. Священные поединки запрещены!

sparring-arena-button = Арена

sparring-signatures = Подписи

sparring-chaplain = Капеллан

alertmodal-button-yes = Да

alertmodal-button-no = Нет

alertmodal-button-ok = ОК

alertmodal-button-cancel = Отмена

alertmodal-button-confirm = Подтвердить

alertmodal-button-accept = Принять

alertmodal-button-decline = Отклонить

alertmodal-button-deny = Отказать

alertmodal-button-continue = Продолжить

alertmodal-button-close = Закрыть

alertmodal-button-done = Готово

alertmodal-button-proceed = Продолжить

alertmodal-button-submit = Отправить

codexgigas-submit = Отправить

codexgigas-search = Искать

codexgigas-prefix = Приставка

codexgigas-title = Титул

codexgigas-name = Имя

codexgigas-suffix = Эпитет

codexgigas-prefix-dark = Темный

codexgigas-prefix-hellish = Адский

codexgigas-prefix-fallen = Падший

codexgigas-prefix-fiery = Огненный

codexgigas-prefix-sinful = Греховный

codexgigas-prefix-blood = Кровавый

codexgigas-prefix-fluffy = Пушистый

codexgigas-title-lord = Лорд

codexgigas-title-prelate = Прелат

codexgigas-title-count = Граф

codexgigas-title-viscount = Виконт

codexgigas-title-vizier = Визирь

codexgigas-title-elder = Старейшина

codexgigas-title-adept = Адепт

codexgigas-suffix-the_red = Красный

codexgigas-suffix-the_soulless = Бездушный

codexgigas-suffix-the_master = Мастер

codexgigas-suffix-the_lord_of_all_things = Повелитель всего сущего

codexgigas-suffix-jr = Младший

nukebomb-arm = ВЗВЕСТИ

nukebomb-anchor = ЗАКРЕПИТЬ

clipboard-title = Планшет с зажимом

clipboard-pen = Ручка

clipboard-integrated-pen = В зажим планшета встроена ручка.

clipboard-no-pen = Ручка не закреплена!

clipboard-empty = Планшет пуст!

signaler-frequency = Частота:

signaler-khz = кГц

signaler-reset = Сброс

signaler-code = Код:

signaler-cooldown = Перезарядка: { $seconds } с

signaler-send = Отправить сигнал

electropack-power = Питание

electropack-on = Вкл

electropack-off = Выкл

electropack-frequency = Частота

electropack-reset = Сброс

electropack-khz = кГц

electropack-code = Код

abandonedcrate-title = Замок с десятизначным кодом

abandonedcrate-hint = Код состоит из набора неповторяющихся цифр. После каждой неверной попытки вы узнаете, сколько цифр угадано на своих местах и сколько угадано, но стоит не на своих местах.

abandonedcrate-warning = { $attempts ->
    [1] Противовзломная бомба сработает при следующей неудачной попытке доступа.
    [one] Противовзломная бомба сработает после { $attempts } неудачной попытки доступа.
    [few] Противовзломная бомба сработает после { $attempts } неудачных попыток доступа.
   *[many] Противовзломная бомба сработает после { $attempts } неудачных попыток доступа.
 }

abandonedcrate-attempt = Попытка

abandonedcrate-correct = Верные цифры на верных местах

abandonedcrate-misplaced = Верные цифры не на своих местах

timer-title = Таймер

timer-repeating = Повтор включен

timer-repeat = Повтор

timer-stop = Стоп

timer-start = Старт

folder-title = Папка

folder-empty = Папка пуста!

filingcabinet-title = Картотечный шкаф

filingcabinet-empty = Здесь ничего нет: { $name } пуст!

terminal-title = Терминал
