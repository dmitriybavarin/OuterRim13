## /obj/item

# desc: Gets the position being viewed through the console.
ent-obj-item-circuit_component-advanced_camera =
    .desc = Получает позицию, на которую смотрят через консоль.

# desc: Allows the user to target an entity or position with the console.
ent-obj-item-circuit_component-advanced_camera_intercept =
    .desc = Позволяет пользователю нацелиться на сущность или позицию с помощью консоли.

# desc: Controls levels of gases and their temperature as well as all vents and scrubbers in the room.
ent-obj-item-circuit_component-air_alarm =
    .desc = Управляет уровнями газов и их температурой, а также всеми вентиляциями и скрубберами в помещении.

# desc: Outputs basic information that the air alarm has recorded
ent-obj-item-circuit_component-air_alarm_general =
    .desc = Выводит основную информацию, записанную воздушной сигнализацией.

# desc: Controls the scrubbers in the room.
ent-obj-item-circuit_component-air_alarm_scrubbers =
    .desc = Управляет скрубберами в помещении.

# desc: Controls the vents in the room.
ent-obj-item-circuit_component-air_alarm_vents =
    .desc = Управляет вентиляциями в помещении.

# desc: The general interface with an airlock. Includes general statuses of the airlock
ent-obj-item-circuit_component-airlock =
    .desc = Общий интерфейс со шлюзом. Включает общие состояния шлюза.

# desc: An event that can be handled through circuit components to determine if the door should open or not for an entity that might be trying to access it.
ent-obj-item-circuit_component-airlock_access_event =
    .desc = Событие, которое можно обработать с помощью компонентов схемы, чтобы определить, должна ли дверь открыться для сущности, пытающейся получить доступ.

# desc: Perform a single animation step. The input of this component should be connected, directly or indirectly, to the "Perform Animation" port of a "Begin Animation" component.
ent-obj-item-circuit_component-animation_step =
    .desc = Выполняет один шаг анимации. Вход этого компонента должен быть подключен, прямо или косвенно, к порту «Выполнить анимацию» компонента «Начать анимацию».

# desc: A two parameter arctan2 component, for calculating any angle you want.
ent-obj-item-circuit_component-arctan2 =
    .desc = Компонент arctan2 с двумя параметрами для вычисления любого нужного угла.

# desc: General arithmetic component with arithmetic capabilities.
ent-obj-item-circuit_component-arithmetic =
    .desc = Общий арифметический компонент с арифметическими возможностями.

# desc: Receives a table to use to set people's arrest status. Table should be from the security records data component. If New Status port isn't set, the status will be decided by the options.
ent-obj-item-circuit_component-arrest_console_arrest =
    .desc = Получает таблицу для установки статуса ареста людей. Таблица должна быть из компонента данных охранных записей. Если порт «Новый статус» не задан, статус будет определен опциями.

# desc: Outputs the security records data, where it can then be filtered with a Select Query component
ent-obj-item-circuit_component-arrest_console_data =
    .desc = Выводит данные охранных записей, которые затем можно отфильтровать компонентом «Выборочный запрос».

# desc: Triggers when pulsed by an attached wire or assembly.
ent-obj-item-circuit_component-assembly_input =
    .desc = Срабатывает при импульсе от подключенного провода или сборки.

# desc: Pulses an attached wire or assembly when triggered.
ent-obj-item-circuit_component-assembly_output =
    .desc = Посылает импульс на подключенный провод или сборку при срабатывании.

# desc: A component that returns an associative list consisting of the inputs.
ent-obj-item-circuit_component-assoc_literal =
    .desc = Компонент, возвращающий ассоциативный список, состоящий из входных значений.

# desc: Allows to read the pressure and temperature of the pipenet.
ent-obj-item-circuit_component-atmos_meter =
    .desc = Позволяет считывать давление и температуру сети труб.

# desc: The interface for communicating with a pump.
ent-obj-item-circuit_component-atmos_pump =
    .desc = Интерфейс для связи с насосом.

# desc: The interface for communicating with a temperature pump.
ent-obj-item-circuit_component-atmos_temperature_pump =
    .desc = Интерфейс для связи с температурным насосом.

# desc: The interface for communicating with a volume pump.
ent-obj-item-circuit_component-atmos_volume_pump =
    .desc = Интерфейс для связи с объемным насосом.

# desc: Controls the core operations of the BCI.
ent-obj-item-circuit_component-bci_core =
    .desc = Управляет основными операциями ИМК.

# desc: Begins an animation on the target. Create animation steps by chaining "Animation Step" components off of the "Perform Animation" port.
ent-obj-item-circuit_component-begin_animation =
    .desc = Начинает анимацию на цели. Создавайте шаги анимации, соединяя компоненты «Шаг анимации» с портом «Выполнить анимацию».

# desc: Splits a decimal number into an array of binary digits, or bits, represented as 1 or 0 and often used in boolean or binary operations like AND, OR and XOR.
ent-obj-item-circuit_component-binary_conversion =
    .desc = Разбивает десятичное число на массив двоичных цифр, или битов, представленных как 1 или 0 и часто используемых в булевых или двоичных операциях, таких как И, ИЛИ и XOR.

# desc: Allows you to construct bitflags for BYOND animation and filter parameters without having to manually search for the corresponding values.
ent-obj-item-circuit_component-bitflag_helper =
    .desc = Позволяет создавать битовые флаги для параметров анимации и фильтров BYOND без необходимости вручную искать соответствующие значения.

# desc: Teleports anything to and from any location on the station. Doesn't use actual GPS coordinates, but rather offsets from the launchpad itself. Can only go as far as the launchpad can go, which depends on its parts.
ent-obj-item-circuit_component-bluespace_launchpad =
    .desc = Телепортирует что угодно в любое место станции и обратно. Не использует настоящие GPS-координаты, а смещения относительно самой площадки. Может достать лишь настолько далеко, насколько позволяет площадка, что зависит от ее деталей.

# desc: Teleports anything to and from any location on the station. Doesn't use actual GPS coordinates, but rather offsets from the launchpad itself. Can only go as far as the launchpad can go, which depends on its parts.
ent-obj-item-circuit_component-bluespace_launchpad-console =
    .desc = Телепортирует что угодно в любое место станции и обратно. Не использует настоящие GPS-координаты, а смещения относительно самой площадки. Может достать лишь настолько далеко, насколько позволяет площадка, что зависит от ее деталей.

# desc: Triggers when someone interacts with the bot.
ent-obj-item-circuit_component-bot =
    .desc = Срабатывает, когда кто-то взаимодействует с ботом.

# desc: Used to send movement output signals to the drone shell.
ent-obj-item-circuit_component-bot_circuit =
    .desc = Используется для отправки сигналов движения на оболочку дрона.

# desc: A polaroid camera that takes pictures when triggered. The picture coordinate ports are relative to the position of the camera.
ent-obj-item-circuit_component-camera =
    .desc = Полароидная камера, делающая снимки при срабатывании. Порты координат снимка задаются относительно позиции камеры.

# desc: A component that repeatedly fires.
ent-obj-item-circuit_component-clock =
    .desc = Компонент, который срабатывает повторно.

# desc: Used to receive inputs from the compact remote shell. Use the shell in hand to trigger the output signal.
ent-obj-item-circuit_component-compact_remote =
    .desc = Используется для получения входных данных от оболочки компактного пульта. Используйте оболочку в руке, чтобы вызвать выходной сигнал.

# desc: Performs a basic comparison between two lists of strings, with additional functions that help in using it to check access on IDs.
ent-obj-item-circuit_component-compare-access =
    .desc = Выполняет базовое сравнение двух списков строк с дополнительными функциями, помогающими использовать его для проверки доступа на ID.

# desc: A component that compares two objects.
ent-obj-item-circuit_component-compare-comparison =
    .desc = Компонент, сравнивающий два объекта.

# desc: Checks if a string contains a word/letter
ent-obj-item-circuit_component-compare-contains =
    .desc = Проверяет, содержит ли строка слово/букву.

# desc: Replace any instance of a word/letter in a string with another
ent-obj-item-circuit_component-compare-contains-replace =
    .desc = Заменяет любое вхождение слова/буквы в строке на другое.

# desc: A component that compares the health state of an organism, and returns true or false.
ent-obj-item-circuit_component-compare-health_state =
    .desc = Компонент, сравнивающий состояние здоровья организма и возвращающий истину или ложь.

# desc: A component with 'and' and 'or' capabilities.
ent-obj-item-circuit_component-compare-logic =
    .desc = Компонент с возможностями «и» и «или».

# desc: A component that toggles between on and off when triggered. All input ports (except for set toggle) will trigger the component.
ent-obj-item-circuit_component-compare-toggle =
    .desc = Компонент, переключающийся между включенным и выключенным состоянием при срабатывании. Все входные порты (кроме установки переключателя) запускают компонент.

# desc: A component that checks the type of its input.
ent-obj-item-circuit_component-compare-typecheck =
    .desc = Компонент, проверяющий тип своего входного значения.

# desc: A component that combines strings.
ent-obj-item-circuit_component-concat =
    .desc = Компонент, объединяющий строки.

# desc: A component that joins up a list with a separator into a single string.
ent-obj-item-circuit_component-concat_list =
    .desc = Компонент, склеивающий список с разделителем в одну строку.

# desc: Used to receive inputs from the controller shell. Use the shell in hand to trigger the output signal.
ent-obj-item-circuit_component-controller =
    .desc = Используется для получения входных данных от оболочки контроллера. Используйте оболочку в руке, чтобы вызвать выходной сигнал.

# desc: Allows to control connected conveyor belts.
ent-obj-item-circuit_component-conveyor_switch =
    .desc = Позволяет управлять подключенными конвейерными лентами.

# desc: A component that shows a three-digit counter. Requires a BCI shell.
ent-obj-item-circuit_component-counter_overlay =
    .desc = Компонент, показывающий трехзначный счетчик. Требует оболочку ИМК.

# desc: Merges an array of binary digits, or bits, represented as 1 or 0 and often used in boolean or binary operations, into a decimal number.
ent-obj-item-circuit_component-decimal_conversion =
    .desc = Объединяет массив двоичных цифр, или битов, представленных как 1 или 0 и часто используемых в булевых или двоичных операциях, в десятичное число.

# desc: A component that delays a signal by a specified duration. Timer gets reset when triggered again.
ent-obj-item-circuit_component-delay =
    .desc = Компонент, задерживающий сигнал на заданное время. Таймер сбрасывается при повторном срабатывании.

# desc: The interface for communicating with a digital valve.
ent-obj-item-circuit_component-digital_valve =
    .desc = Интерфейс для связи с цифровым клапаном.

# desc: A component that returns the direction of itself and an entity.
ent-obj-item-circuit_component-direction =
    .desc = Компонент, возвращающий направление от себя к сущности.

# desc: A dispenser bot that can dispense items
ent-obj-item-circuit_component-dispenser_bot =
    .desc = Бот-раздатчик, способный выдавать предметы.

# desc: Allows you to manually fire and get the ready status of an emitter. Must be unlocked to use fired signal.
ent-obj-item-circuit_component-emitter =
    .desc = Позволяет вручную стрелять и получать статус готовности эмиттера. Для использования сигнала выстрела должен быть разблокирован.

# desc: Represents an action the user can take when using supported shells.
ent-obj-item-circuit_component-equipment_action =
    .desc = Представляет действие, которое пользователь может совершить при использовании поддерживаемых оболочек.

# desc: Adds a filter to the target atom.
ent-obj-item-circuit_component-filter_adder =
    .desc = Добавляет фильтр целевому атому.

# desc: Constructs a list of filter parameters from the inputs.
ent-obj-item-circuit_component-filter_helper =
    .desc = Составляет список параметров фильтра из входных данных.

# desc: A component that loops through each element in a list and filters them.
ent-obj-item-circuit_component-filter_list =
    .desc = Компонент, перебирающий каждый элемент списка и фильтрующий их.

# desc: Removes the specified filter from the target.
ent-obj-item-circuit_component-filter_remover =
    .desc = Удаляет указанный фильтр у цели.

# desc: Allows you to interface with the Fire Alarm.
ent-obj-item-circuit_component-firealarm =
    .desc = Позволяет взаимодействовать с пожарной сигнализацией.

# desc: A component that loops through each element in a list.
ent-obj-item-circuit_component-foreach =
    .desc = Компонент, перебирающий каждый элемент списка в цикле.

# desc: A component that formats lists, replacing %n in the format string with corresponding nth list item.
ent-obj-item-circuit_component-format =
    .desc = Компонент, форматирующий списки: заменяет %n в строке формата на соответствующий n-й элемент списка.

# desc: Gets the column of a table and returns it as a regular list.
ent-obj-item-circuit_component-get_column =
    .desc = Получает столбец таблицы и возвращает его в виде обычного списка.

# desc: A component that gets a variable on an object.
ent-obj-item-circuit_component-get_variable =
    .desc = Компонент, получающий переменную объекта.

# desc: A component that returns the xyz co-ordinates of itself.
ent-obj-item-circuit_component-gps =
    .desc = Компонент, возвращающий xyz-координаты самого себя.

# desc: A component that returns the health of an organism.
ent-obj-item-circuit_component-health =
    .desc = Компонент, возвращающий здоровье организма.

# desc: A component that listens for messages. Requires a shell.
ent-obj-item-circuit_component-hear =
    .desc = Компонент, прослушивающий сообщения. Требует оболочку.

# desc: Output text to a signboard, insert <br> in the message field to linebreak. Set the color to 0, 0, 0 to reset to default.
ent-obj-item-circuit_component-holo_signboard =
    .desc = Выводит текст на табло. Вставьте <br> в поле сообщения для переноса строки. Установите цвет 0, 0, 0 для сброса на стандартный.

# desc: Automate the means of botanical production. Trigger to toggle auto-grow.
ent-obj-item-circuit_component-hydroponics =
    .desc = Автоматизируйте средства ботанического производства. Активируйте для переключения автороста.

# desc: A component that reads the access on an ID.
ent-obj-item-circuit_component-id_access_reader =
    .desc = Компонент, считывающий доступ с ID-карты.

# desc: A component that returns the first available ID card on an organism.
ent-obj-item-circuit_component-id_getter =
    .desc = Компонент, возвращающий первую доступную ID-карту организма.

# desc: A component that reads the name, job, and age on an ID.
ent-obj-item-circuit_component-id_info_reader =
    .desc = Компонент, считывающий имя, должность и возраст с ID-карты.

# desc: Controls the core operations of the implant.
ent-obj-item-circuit_component-implant_core =
    .desc = Управляет основными операциями импланта.

# desc: A component that returns the value of a list at a given index.
ent-obj-item-circuit_component-index =
    .desc = Компонент, возвращающий значение списка по заданному индексу.

# desc: A component that is commonly used to access a row from a table. Accesses data from a key, value list.
ent-obj-item-circuit_component-index-assoc_string =
    .desc = Компонент, обычно используемый для получения строки из таблицы. Получает данные из списка «ключ-значение».

# desc: Gets the row of a table as an associative list using the index inputted. Will return no value if the index is invalid or a proper table is not returned.
ent-obj-item-circuit_component-index_table =
    .desc = Получает строку таблицы в виде ассоциативного списка по введенному индексу. Не вернет значения, если индекс неверен или таблица некорректна.

# desc: Converts a string into a typepath. Useful for adding components.
ent-obj-item-circuit_component-input_request =
    .desc = Преобразует строку в путь типа. Полезно для добавления компонентов.

# desc: A component that detects when the circuit is installed or removed from its user.
ent-obj-item-circuit_component-install_detector =
    .desc = Компонент, определяющий, когда схема устанавливается или извлекается у пользователя.

# desc: A handheld shell that allows the user to input a string. Use the shell in hand to open the input panel.
ent-obj-item-circuit_component-keyboard_shell =
    .desc = Ручная оболочка, позволяющая пользователю ввести строку. Используйте оболочку в руке, чтобы открыть панель ввода.

# desc: A component that shines a high powered light at a target.
ent-obj-item-circuit_component-laserpointer =
    .desc = Компонент, направляющий мощный луч света на цель.

# desc: A component that returns the length of its input.
ent-obj-item-circuit_component-length =
    .desc = Компонент, возвращающий длину своего входа.

# desc: A component that emits a light of a specific brightness and colour. Requires a shell.
ent-obj-item-circuit_component-light =
    .desc = Компонент, излучающий свет определенной яркости и цвета. Требует оболочку.

# desc: Allows to control the lights of an area.
ent-obj-item-circuit_component-light_switch =
    .desc = Позволяет управлять освещением зоны.

# desc: A component that creates a list from whatever input you give it.
ent-obj-item-circuit_component-list_literal =
    .desc = Компонент, создающий список из любых введенных вами данных.

# desc: Creates a list literal data package and sends it through NFC. If Encryption Key is set then transmitted data will be only picked up by receivers with the same Encryption Key.
ent-obj-item-circuit_component-list_literal-nfc_send =
    .desc = Создает пакет данных списка и отправляет его по NFC. Если задан ключ шифрования, переданные данные получат только приемники с тем же ключом.

# desc: Creates a list literal data package and sends it through NTNet. If Encryption Key is set then transmitted data will be only picked up by receivers with the same Encryption Key.
ent-obj-item-circuit_component-list_literal-ntnet_send =
    .desc = Создает пакет данных списка и отправляет его через NTNet. Если задан ключ шифрования, переданные данные получат только приемники с тем же ключом.

# desc: Creates a list literal data package and sends it through the connected cable network. If Encryption Key is set then transmitted data will be only picked up by receivers with the same Encryption Key.
ent-obj-item-circuit_component-list_literal-wirenet_send =
    .desc = Создает пакет данных списка и отправляет его по подключенной кабельной сети. Если задан ключ шифрования, переданные данные получат только приемники с тем же ключом.

# desc: A component that lets a user pick 1 element from a list. Returns the selected element.
ent-obj-item-circuit_component-list_pick =
    .desc = Компонент, позволяющий пользователю выбрать 1 элемент из списка. Возвращает выбранный элемент.

# desc: A component that lets a user pick 1 element from an associative list. Returns the selected element.
ent-obj-item-circuit_component-list_pick-assoc =
    .desc = Компонент, позволяющий пользователю выбрать 1 элемент из ассоциативного списка. Возвращает выбранный элемент.

# desc: Checks if an element is in a list and returns the index it is as if it is. Index is set to 0 on failure.
ent-obj-item-circuit_component-listin =
    .desc = Проверяет, есть ли элемент в списке, и возвращает его индекс, если есть. При неудаче индекс равен 0.

# desc: Outputs the material composition of the inputted entity.
ent-obj-item-circuit_component-matscanner =
    .desc = Выводит материальный состав введенного объекта.

# desc: Outputs the medical statuses of people on the crew monitoring computer, where it can then be filtered with a Select Query component.
ent-obj-item-circuit_component-medical_console_data =
    .desc = Выводит медицинские статусы людей с консоли мониторинга экипажа, где их затем можно отфильтровать компонентом «Select Query».

# desc: A component that allows an MMI or B.O.R.I.S. module to be inserted into the shell, allowing a brain or artificial intelligence to output signals.
ent-obj-item-circuit_component-mmi =
    .desc = Компонент, позволяющий вставить в оболочку МКИ или модуль B.O.R.I.S., чтобы мозг или искусственный интеллект мог выдавать сигналы.

# desc: Provides a reference to the MODsuit's occupant and allows the circuit to toggle the MODsuit.
ent-obj-item-circuit_component-mod_adapter_core =
    .desc = Предоставляет ссылку на владельца МОД-скафандра и позволяет схеме переключать МОД-скафандр.

# desc: I've spent lot of time thinking how to get this to work. If you see this, I either failed or someone else did, so report it.
ent-obj-item-circuit_component-mod_program =
    .desc = Я потратил кучу времени, пытаясь заставить это работать. Если вы это видите, то либо у меня не вышло, либо у кого-то другого, так что сообщите об этом.

# desc: Circuit for basic functions of a modular computer.
ent-obj-item-circuit_component-modpc =
    .desc = Схема для базовых функций модульного компьютера.

# desc: A component that has other components within it, acting like a function. Use it in your hand to control the amount of input and output ports it has, as well as being able to access the integrated circuit contained inside.
ent-obj-item-circuit_component-module =
    .desc = Компонент, содержащий внутри другие компоненты и работающий как функция. Используйте в руке, чтобы настроить количество его входных и выходных портов, а также получить доступ к встроенной интегральной схеме.

# desc: A component that receives data from the module it is attached to
ent-obj-item-circuit_component-module_input =
    .desc = Компонент, получающий данные от модуля, к которому он подключен.

# desc: A component that outputs data to the module it is attached to.
ent-obj-item-circuit_component-module_output =
    .desc = Компонент, передающий данные модулю, к которому он подключен.

# desc: Used to receive input signals when money is inserted into the money bot shell and also keep track of the total money in the shell.
ent-obj-item-circuit_component-money_bot =
    .desc = Используется для получения входных сигналов при вставке денег в оболочку денежного бота, а также для учета общей суммы денег в оболочке.

# desc: Used to dispense money from the money bot. Money is taken from the internal storage of money.
ent-obj-item-circuit_component-money_dispenser =
    .desc = Используется для выдачи денег из денежного бота. Деньги берутся из внутреннего хранилища.

# desc: Receives data packages through NFC. If Encryption Key is set then only signals with the same Encryption Key will be received.
ent-obj-item-circuit_component-nfc_receive =
    .desc = Принимает пакеты данных по NFC. Если задан ключ шифрования, будут приняты только сигналы с тем же ключом.

# desc: Sends a data package through NTNet. If Encryption Key is set then transmitted data will be only picked up by receivers with the same Encryption Key.
ent-obj-item-circuit_component-nfc_send =
    .desc = Отправляет пакет данных через NTNet. Если задан ключ шифрования, переданные данные получат только приемники с тем же ключом.

# desc: A component that inverts its input.
ent-obj-item-circuit_component-not =
    .desc = Компонент, инвертирующий свой вход.

# desc: Receives data packages through NTNet. If Encryption Key is set then only signals with the same Encryption Key will be received.
ent-obj-item-circuit_component-ntnet_receive =
    .desc = Принимает пакеты данных через NTNet. Если задан ключ шифрования, будут приняты только сигналы с тем же ключом.

# desc: Sends a data package through NTNet. If Encryption Key is set then transmitted data will be only picked up by receivers with the same Encryption Key.
ent-obj-item-circuit_component-ntnet_send =
    .desc = Отправляет пакет данных через NTNet. Если задан ключ шифрования, переданные данные получат только приемники с тем же ключом.

# desc: Requires a BCI shell. A component that shows an overlay on top of an object.
ent-obj-item-circuit_component-object_overlay =
    .desc = Требует оболочку МКИ. Компонент, показывающий наложение поверх объекта.

# desc: Requires a BCI shell. A component that shows a bar overlay atop an object, ranging from 0 to 100.
ent-obj-item-circuit_component-object_overlay-bar =
    .desc = Требует оболочку МКИ. Компонент, показывающий полосу-наложение поверх объекта в диапазоне от 0 до 100.

# desc: When triggered, the next step to the target's location as an entity. This can be used with the direction component and the drone shell to make it move on its own. The Id Card input port is for considering ID access when pathing, it does not give the shell actual access.
ent-obj-item-circuit_component-pathfind =
    .desc = При активации выдает следующий шаг к местоположению цели в виде сущности. Можно использовать с компонентом направления и оболочкой дрона, чтобы тот двигался сам. Порт ID-карты нужен для учета доступа при прокладке пути, он не дает оболочке настоящего доступа.

# desc: A component that returns the xyz co-ordinates of its entity input, as long as its in view.
ent-obj-item-circuit_component-pinpointer =
    .desc = Компонент, возвращающий xyz-координаты сущности на входе, пока она находится в поле зрения.

# desc: Outputs the current pressure of the tile
ent-obj-item-circuit_component-pressuresensor =
    .desc = Выводит текущее давление на тайле.

# desc: A component that calls a proc on an object.
ent-obj-item-circuit_component-proccall =
    .desc = Компонент, вызывающий процедуру объекта.

# desc: A component that can force the shell to pull entities. Only works for drone shells.
ent-obj-item-circuit_component-pull =
    .desc = Компонент, способный заставить оболочку тянуть сущности. Работает только с оболочками дронов.

# desc: A bluespace quantum-linked telepad used for teleporting objects to other quantum pads.
ent-obj-item-circuit_component-quantumpad =
    .desc = Блюспейс-телепад с квантовой связью, используемый для телепортации объектов на другие квантовые площадки.

# desc: A component that can listen and send frequencies. If set to private, the component will only receive signals from other components attached to circuitboards with the same owner id.
ent-obj-item-circuit_component-radio =
    .desc = Компонент, способный слушать и передавать на частотах. Если установлен приватный режим, компонент будет принимать сигналы только от других компонентов на платах с тем же ID владельца.

# desc: A component that returns random values.
ent-obj-item-circuit_component-random =
    .desc = Компонент, возвращающий случайные значения.

# desc: A component that can inject reagents from the circuit's reagent storage.
ent-obj-item-circuit_component-reagent_injector =
    .desc = Компонент, способный вводить реагенты из хранилища реагентов схемы.

# desc: Outputs the reagents found inside the inputted entity.
ent-obj-item-circuit_component-reagentscanner =
    .desc = Выводит реагенты, найденные внутри введенной сущности.

# desc: Allows you to adjust the angle of a reflector.
ent-obj-item-circuit_component-reflector =
    .desc = Позволяет регулировать угол отражателя.

# desc: This is the abstract parent type - do not use this directly!
ent-obj-item-circuit_component-remotecam =
    .desc = Это абстрактный родительский тип — не используйте его напрямую!

# desc: A peephole camera that captures both sides of the airlock. Network field is used for camera network.
ent-obj-item-circuit_component-remotecam-airlock =
    .desc = Камера-глазок, снимающая обе стороны шлюза. Поле сети используется для сети камер.

# desc: Digitizes user's sight for surveillance-on-the-go. User must have fully functional eyes for digitizer to work. Camera range input is either 0 (near) or 1 (far). Network field is used for camera network.
ent-obj-item-circuit_component-remotecam-bci =
    .desc = Оцифровывает зрение пользователя для наблюдения на ходу. Для работы оцифровщика у пользователя должны быть полностью исправные глаза. Дальность камеры на входе равна 0 (близко) или 1 (далеко). Поле сети используется для сети камер.

# desc: Capture the surrounding environment for surveillance-on-the-go. Camera range input is either 0 (near) or 1 (far). Network field is used for camera network.
ent-obj-item-circuit_component-remotecam-drone =
    .desc = Снимает окружающую обстановку для наблюдения на ходу. Дальность камеры на входе равна 0 (близко) или 1 (далеко). Поле сети используется для сети камер.

# desc: Relays a polaroid camera's feed as a digital stream for surveillance-on-the-go. The camera stream will not work if stored inside of a container like a backpack/box. Network field is used for camera network.
ent-obj-item-circuit_component-remotecam-polaroid =
    .desc = Передает изображение с поляроидной камеры в виде цифрового потока для наблюдения на ходу. Поток не будет работать, если камера лежит в контейнере вроде рюкзака или коробки. Поле сети используется для сети камер.

# desc: Copies the input chosen by "Input Selector" to the output chosen by "Output Selector".
ent-obj-item-circuit_component-router =
    .desc = Копирует вход, выбранный «Input Selector», на выход, выбранный «Output Selector».

# desc: Copies the input chosen by "Input Selector" to the output.
ent-obj-item-circuit_component-router-multiplexer =
    .desc = Копирует вход, выбранный «Input Selector», на выход.

# desc: A component that saves a shell.
ent-obj-item-circuit_component-save_shell =
    .desc = Компонент, сохраняющий оболочку.

# desc: A gate able to perform mid-depth scans on any object that pass through it.
ent-obj-item-circuit_component-scanner_gate =
    .desc = Ворота, способные проводить сканирование средней глубины любого проходящего через них объекта.

# desc: A component that performs an SDQL operation when invoked.
ent-obj-item-circuit_component-sdql_operation =
    .desc = Компонент, выполняющий операцию SDQL при вызове.

# desc: A component used with USB cables that can perform select queries on a list based on the column name selected. The values are then compared with the comparison input.
ent-obj-item-circuit_component-select =
    .desc = Компонент, используемый с USB-кабелями, который может выполнять выборочные запросы по списку на основе выбранного названия столбца. Затем значения сравниваются со входом сравнения.

# desc: A component that returns the current shell.
ent-obj-item-circuit_component-self =
    .desc = Компонент, возвращающий текущую оболочку.

# desc: A component that sets a variable on an object.
ent-obj-item-circuit_component-set_variable =
    .desc = Компонент, задающий переменную объекта.

# desc: A component that listens for signals on an object.
ent-obj-item-circuit_component-signal_handler =
    .desc = Компонент, прослушивающий сигналы на объекте.

# desc: Allows to activate process and get the amount of processor contents.
ent-obj-item-circuit_component-slime_processor =
    .desc = Позволяет запускать обработку и получать количество содержимого процессора.

# desc: A component that emits a sound when it receives an input. The frequency is a multiplier which determines the speed at which the sound is played
ent-obj-item-circuit_component-soundemitter =
    .desc = Компонент, издающий звук при получении входа. Частота является множителем, определяющим скорость воспроизведения звука.

# desc: Spawns an atom at a desired location
ent-obj-item-circuit_component-spawn_atom =
    .desc = Создает атом в желаемом месте.

# desc: A component that returns the species of its input.
ent-obj-item-circuit_component-species =
    .desc = Компонент, возвращающий расу своего входа.

# desc: A component that sends a message. Requires a shell.
ent-obj-item-circuit_component-speech =
    .desc = Компонент, отправляющий сообщение. Требует оболочку.

# desc: Splits a string by the separator, turning it into a list
ent-obj-item-circuit_component-split =
    .desc = Разделяет строку по разделителю, превращая ее в список.

# desc: Output text and pictures to a status display.
ent-obj-item-circuit_component-status_display =
    .desc = Выводит текст и изображения на информационное табло.

# desc: An advanced electronic synthesizer that can be used as various instruments.
ent-obj-item-circuit_component-synth =
    .desc = Продвинутый электронный синтезатор, который можно использовать как различные инструменты.

# desc: An advanced electronic device that plays music into your ears.
ent-obj-item-circuit_component-synth-headphones =
    .desc = Продвинутое электронное устройство, играющее музыку прямо в ваши уши.

# desc: Requires a BCI shell. When activated, this component will allow user to target an object using their brain and will output the reference to said object.
ent-obj-item-circuit_component-target_intercept =
    .desc = Требует оболочку МКИ. При активации этот компонент позволит пользователю выбрать объект силой мысли и выведет ссылку на него.

# desc: Used to control a linked teleportation Hub and Station.
ent-obj-item-circuit_component-teleporter_control_console =
    .desc = Используется для управления связанными телепортационным хабом и станцией.

# desc: Outputs the current temperature of the tile
ent-obj-item-circuit_component-tempsensor =
    .desc = Выводит текущую температуру на тайле.

# desc: A component that makes its input uppercase or lowercase.
ent-obj-item-circuit_component-textcase =
    .desc = Компонент, переводящий свой вход в верхний или нижний регистр.

# desc: The interface for communicating with a temperature control unit.
ent-obj-item-circuit_component-thermomachine =
    .desc = Интерфейс для связи с блоком контроля температуры.

# desc: A component that allows the user to input a string using their mind. Requires a BCI shell.
ent-obj-item-circuit_component-thought_listener =
    .desc = Компонент, позволяющий пользователю вводить строку силой мысли. Требует оболочку МКИ.

# desc: A component that outputs the current station time. The text output port is used for time formats while the numerical output port is used for units of time.
ent-obj-item-circuit_component-timepiece =
    .desc = Компонент, выводящий текущее время станции. Текстовый порт используется для форматов времени, а числовой — для единиц времени.

# desc: Converts a string into a typepath. Useful for adding components.
ent-obj-item-circuit_component-to_type =
    .desc = Преобразует строку в путь типа. Полезно для добавления компонентов.

# desc: A component that converts its input (a string) to a number. If there's text in the input, it'll only consider it if it starts with a number. It will take that number and ignore the rest.
ent-obj-item-circuit_component-tonumber =
    .desc = Компонент, преобразующий свой вход (строку) в число. Если во входе есть текст, он учитывается, только если начинается с числа. Берется это число, остальное игнорируется.

# desc: A component that converts its input to text.
ent-obj-item-circuit_component-tostring =
    .desc = Компонент, преобразующий свой вход в текст.

# desc: General trigonometry component with main and inverse trigonometry functions.
ent-obj-item-circuit_component-trigonometry =
    .desc = Общий тригонометрический компонент с основными и обратными тригонометрическими функциями.

# desc: A component that casts a value to a type if it matches or outputs null.
ent-obj-item-circuit_component-typecast =
    .desc = Компонент, приводящий значение к типу, если оно ему соответствует, иначе выводящий null.

# desc: You shouldn't be seeing this.
ent-obj-item-circuit_component-variable =
    .desc = Вы не должны этого видеть.

# desc: Removes a key from an associative list variable.
ent-obj-item-circuit_component-variable-assoc_list-list_remove =
    .desc = Удаляет ключ из переменной ассоциативного списка.

# desc: Sets a string key on an associative list to a specific value.
ent-obj-item-circuit_component-variable-assoc_list-list_set =
    .desc = Устанавливает строковый ключ ассоциативного списка в определенное значение.

# desc: A component that gets a variable globally on the circuit.
ent-obj-item-circuit_component-variable-getter =
    .desc = Компонент, глобально получающий переменную схемы.

# desc: Adds an element to a list variable.
ent-obj-item-circuit_component-variable-list-listadd =
    .desc = Добавляет элемент в переменную-список.

# desc: Clears a list variable.
ent-obj-item-circuit_component-variable-list-listclear =
    .desc = Очищает переменную-список.

# desc: Removes an element from a list variable.
ent-obj-item-circuit_component-variable-list-listremove =
    .desc = Удаляет элемент из переменной-списка.

# desc: A component that sets a variable globally on the circuit.
ent-obj-item-circuit_component-variable-setter =
    .desc = Компонент, глобально задающий переменную схемы.

# desc: A component that sets a variable globally on the circuit. This one requires input signals and also provides an output signal
ent-obj-item-circuit_component-variable-setter-trigger =
    .desc = Компонент, глобально задающий переменную схемы. Этот требует входных сигналов, а также выдает выходной сигнал.

# desc: A component used to vend out specific objects from the dispenser bot.
ent-obj-item-circuit_component-vendor_component =
    .desc = Компонент, используемый для выдачи определенных предметов из бота-раздатчика.

# desc: Outputs a list with all movable objects in it's view. Requires a shell. Max range of 5 tiles.
ent-obj-item-circuit_component-view_sensor =
    .desc = Выводит список всех подвижных объектов в поле зрения. Требует оболочку. Максимальная дальность — 5 тайлов.

# desc: Allows you to interface with a vitals monitor to read a patient's status.
ent-obj-item-circuit_component-vitals_monitor =
    .desc = Позволяет взаимодействовать с монитором жизненных показателей для считывания состояния пациента.

# desc: A component that plays a local VOX Announcement for the user. Requires a BCI shell.
ent-obj-item-circuit_component-vox =
    .desc = Компонент, проигрывающий пользователю локальное объявление VOX. Требует оболочку МКИ.

# desc: A bundle of exposed wires that assemblies can be attached to. Ports will only show up once the circuit is inserted into a shell.
ent-obj-item-circuit_component-wire_bundle =
    .desc = Пучок оголенных проводов, к которому можно подключать сборки. Порты появятся, только когда схема будет вставлена в оболочку.

# desc: Used to receive entities hit by projectiles from a gun.
ent-obj-item-circuit_component-wiremod_gun =
    .desc = Используется для получения сущностей, пораженных снарядами из оружия.

# desc: Used to receive scanned entities from the scanner.
ent-obj-item-circuit_component-wiremod_scanner =
    .desc = Используется для получения отсканированных сущностей от сканера.

# desc: Receives data packets through the connected cable network. If Encryption Key is set then only signals with the same Encryption Key will be received.
ent-obj-item-circuit_component-wirenet_receive =
    .desc = Принимает пакеты данных по подключенной кабельной сети. Если задан ключ шифрования, будут приняты только сигналы с тем же ключом.

# desc: Sends a data package through the connected cable network. If Encryption Key is set then transmitted data will be only picked up by receivers with the same Encryption Key.
ent-obj-item-circuit_component-wirenet_send =
    .desc = Отправляет пакет данных по подключенной кабельной сети. Если задан ключ шифрования, переданные данные получат только приемники с тем же ключом.
