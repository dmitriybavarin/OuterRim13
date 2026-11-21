## /obj/machinery

# desc: A gas circulator pump and heat exchanger.
ent-obj-machinery-atmospherics-components-binary-circulator = циркулятор/теплообменник
    .desc = Газовый циркуляционный насос и теплообменник.

# name: crystallizer
# desc: Used to crystallize or solidify gases.
ent-obj-machinery-atmospherics-components-binary-crystallizer = кристаллизатор
    .gen = кристаллизатора
    .dat = кристаллизатору
    .ins = кристаллизатором
    .pre = кристаллизаторе
    .desc = Используется для кристаллизации или отверждения газов.

# name: dual-port air vent
# desc: Has a valve and pump attached to it. There are two ports.
ent-obj-machinery-atmospherics-components-binary-dp_vent_pump = двухпортовая вентиляция
    .gen = двухпортовой вентиляции
    .dat = двухпортовой вентиляции
    .acc = двухпортовую вентиляцию
    .ins = двухпортовой вентиляцией
    .pre = двухпортовой вентиляции
    .desc = К ней подсоединены клапан и насос. Есть два порта.

# name: large dual-port air vent
ent-obj-machinery-atmospherics-components-binary-dp_vent_pump-high_volume = большая двухпортовая вентиляция
    .gen = большей двухпортовой вентиляции
    .dat = большей двухпортовой вентиляции
    .acc = большую двухпортовую вентиляцию
    .ins = большей двухпортовой вентиляцией
    .pre = большей двухпортовой вентиляции

# name: passive gate
# desc: A one-way air valve that does not require power. Passes gas when the output pressure is lower than the target pressure.
ent-obj-machinery-atmospherics-components-binary-passive_gate = пассивный затвор
    .gen = пассивного затвора
    .dat = пассивному затвору
    .ins = пассивным затвором
    .pre = пассивном затворе
    .desc = Односторонний воздушный клапан, не требующий питания. Пропускает газ, когда давление на выходе ниже заданного.

# name: pressure gate
# desc: An activable one way valve that let gas pass through if the pressure on the input side is higher than the set pressure.
ent-obj-machinery-atmospherics-components-binary-pressure_valve = напорный затвор
    .gen = напорного затвора
    .dat = напорному затвору
    .ins = напорным затвором
    .pre = напорном затворе
    .desc = Включаемый односторонний клапан, пропускающий газ, если давление на входе выше заданного.

# name: pressure pump
# desc: A pump that moves gas by pressure.
ent-obj-machinery-atmospherics-components-binary-pump = насос давления
    .gen = насоса давления
    .dat = насосу давления
    .ins = насосом давления
    .pre = насосе давления
    .desc = Насос, перекачивающий газ по давлению.

# name: Tank Compressor
# desc: Heavy duty shielded air compressor designed to pressurize tanks above the safe limit.
ent-obj-machinery-atmospherics-components-binary-tank_compressor = Компрессор баллонов
    .gen = Компрессора баллонов
    .dat = Компрессору баллонов
    .ins = Компрессором баллонов
    .pre = Компрессоре баллонов
    .desc = Мощный экранированный воздушный компрессор, предназначенный для нагнетания в баллоны давления выше безопасного предела.

# name: temperature gate
# desc: An activable gate that compares the input temperature with the interface set temperature to check if the gas can flow from the input side to the output side or not.
ent-obj-machinery-atmospherics-components-binary-temperature_gate = температурный затвор
    .gen = температурного затвора
    .dat = температурному затвору
    .ins = температурным затвором
    .pre = температурном затворе
    .desc = Включаемый затвор, сравнивающий температуру на входе с заданной в интерфейсе и определяющий, может ли газ течь со входа на выход.

# name: temperature pump
# desc: A pump that moves heat from one pipeline to another. The input will get cooler, and the output will get hotter.
ent-obj-machinery-atmospherics-components-binary-temperature_pump = температурный насос
    .gen = температурного насоса
    .dat = температурному насосу
    .ins = температурным насосом
    .pre = температурном насосе
    .desc = Насос, перекачивающий тепло из одной магистрали в другую. Вход будет остывать, а выход — нагреваться.

# name: manual valve
# desc: A pipe with a valve that can be used to disable flow of gas through it.
ent-obj-machinery-atmospherics-components-binary-valve = ручной вентиль
    .gen = ручного вентиля
    .dat = ручному вентилю
    .ins = ручным вентилем
    .pre = ручном вентиле
    .desc = Труба с клапаном, которым можно перекрыть поток газа.

# name: digital valve
# desc: A digitally controlled valve.
ent-obj-machinery-atmospherics-components-binary-valve-digital = цифровой вентиль
    .gen = цифрового вентиля
    .dat = цифровому вентилю
    .ins = цифровым вентилем
    .pre = цифровом вентиле
    .desc = Вентиль с цифровым управлением.

# name: volume pump
# desc: A pump that moves gas by volume.
ent-obj-machinery-atmospherics-components-binary-volume_pump = объемный насос
    .gen = объемного насоса
    .dat = объемному насосу
    .acc = объемный насос
    .ins = объемным насосом
    .pre = объемном насосе
    .desc = Насос, перекачивающий газ по объему.

# name: pressure tank
# desc: A large vessel containing pressurized gas.
ent-obj-machinery-atmospherics-components-tank = баллон высокого давления
    .gen = баллона высокого давления
    .dat = баллону высокого давления
    .ins = баллоном высокого давления
    .pre = баллоне высокого давления
    .desc = Большая емкость со сжатым газом.

# name: pressure tank (Air)
ent-obj-machinery-atmospherics-components-tank-air = баллон высокого давления (воздух)
    .gen = баллона высокого давления (воздух)
    .dat = баллону высокого давления (воздух)
    .ins = баллоном высокого давления (воздух)
    .pre = баллоне высокого давления (воздух)

# name: gas filter
# desc: Very useful for filtering gasses.
ent-obj-machinery-atmospherics-components-trinary-filter = газовый фильтр
    .gen = газового фильтра
    .dat = газовому фильтру
    .ins = газовым фильтром
    .pre = газовом фильтре
    .desc = Очень полезен для фильтрации газов.

# name: anti-noblium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-antinoblium = фильтр антинобелия
    .gen = фильтра антинобелия
    .dat = фильтру антинобелия
    .ins = фильтром антинобелия
    .pre = фильтре антинобелия

# name: bz filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-bz = фильтр BZ
    .gen = фильтра BZ
    .dat = фильтру BZ
    .ins = фильтром BZ
    .pre = фильтре BZ

# name: carbon dioxide filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-co2 = фильтр углекислого газа
    .gen = фильтра углекислого газа
    .dat = фильтру углекислого газа
    .ins = фильтром углекислого газа
    .pre = фильтре углекислого газа

# name: anti-noblium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-antinoblium = фильтр антинобелия
    .gen = фильтра антинобелия
    .dat = фильтру антинобелия
    .ins = фильтром антинобелия
    .pre = фильтре антинобелия

# name: bz filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-bz = фильтр BZ
    .gen = фильтра BZ
    .dat = фильтру BZ
    .ins = фильтром BZ
    .pre = фильтре BZ

# name: carbon dioxide filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-co2 = фильтр углекислого газа
    .gen = фильтра углекислого газа
    .dat = фильтру углекислого газа
    .ins = фильтром углекислого газа
    .pre = фильтре углекислого газа

# name: freon filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-freon = фильтр фреона
    .gen = фильтра фреона
    .dat = фильтру фреона
    .ins = фильтром фреона
    .pre = фильтре фреона

# name: hydrogen filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-h2 = фильтр водорода
    .gen = фильтра водорода
    .dat = фильтру водорода
    .ins = фильтром водорода
    .pre = фильтре водорода

# name: water vapor filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-h2o = фильтр водяного пара
    .gen = фильтра водяного пара
    .dat = фильтру водяного пара
    .ins = фильтром водяного пара
    .pre = фильтре водяного пара

# name: halon filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-halon = фильтр галона
    .gen = фильтра галона
    .dat = фильтру галона
    .ins = фильтром галона
    .pre = фильтре галона

# name: healium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-healium = фильтр хилиума
    .gen = фильтра хилиума
    .dat = фильтру хилиума
    .ins = фильтром хилиума
    .pre = фильтре хилиума

# name: helium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-helium = фильтр гелия
    .gen = фильтра гелия
    .dat = фильтру гелия
    .ins = фильтром гелия
    .pre = фильтре гелия

# name: hyper-noblium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-hypernoblium = фильтр гипер-нобелия
    .gen = фильтра гипер-нобелия
    .dat = фильтру гипер-нобелия
    .ins = фильтром гипер-нобелия
    .pre = фильтре гипер-нобелия

# name: miasma filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-miasma = фильтр миазмы
    .gen = фильтра миазмы
    .dat = фильтру миазмы
    .ins = фильтром миазмы
    .pre = фильтре миазмы

# name: nitrogen filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-n2 = фильтр азота
    .gen = фильтра азота
    .dat = фильтру азота
    .ins = фильтром азота
    .pre = фильтре азота

# name: nitrous oxide filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-n2o = фильтр закиси азота
    .gen = фильтра закиси азота
    .dat = фильтру закиси азота
    .ins = фильтром закиси азота
    .pre = фильтре закиси азота

# name: nitrium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-no2 = фильтр нитриума
    .gen = фильтра нитриума
    .dat = фильтру нитриума
    .ins = фильтром нитриума
    .pre = фильтре нитриума

# name: oxygen filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-o2 = фильтр кислорода
    .gen = фильтра кислорода
    .dat = фильтру кислорода
    .ins = фильтром кислорода
    .pre = фильтре кислорода

# name: plasma filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-plasma = фильтр плазмы
    .gen = фильтра плазмы
    .dat = фильтру плазмы
    .ins = фильтром плазмы
    .pre = фильтре плазмы

# name: pluoxium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-pluoxium = фильтр плуоксиума
    .gen = фильтра плуоксиума
    .dat = фильтру плуоксиума
    .ins = фильтром плуоксиума
    .pre = фильтре плуоксиума

# name: proto-nitrate filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-proto_nitrate = фильтр прото-нитрата
    .gen = фильтра прото-нитрата
    .dat = фильтру прото-нитрата
    .ins = фильтром прото-нитрата
    .pre = фильтре прото-нитрата

# name: tritium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-tritium = фильтр трития
    .gen = фильтра трития
    .dat = фильтру трития
    .ins = фильтром трития
    .pre = фильтре трития

# name: zauker filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-flipped-zauker = фильтр заукера
    .gen = фильтра заукера
    .dat = фильтру заукера
    .ins = фильтром заукера
    .pre = фильтре заукера

# name: freon filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-freon = фильтр фреона
    .gen = фильтра фреона
    .dat = фильтру фреона
    .ins = фильтром фреона
    .pre = фильтре фреона

# name: hydrogen filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-h2 = фильтр водорода
    .gen = фильтра водорода
    .dat = фильтру водорода
    .ins = фильтром водорода
    .pre = фильтре водорода

# name: water vapor filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-h2o = фильтр водяного пара
    .gen = фильтра водяного пара
    .dat = фильтру водяного пара
    .ins = фильтром водяного пара
    .pre = фильтре водяного пара

# name: halon filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-halon = фильтр галона
    .gen = фильтра галона
    .dat = фильтру галона
    .ins = фильтром галона
    .pre = фильтре галона

# name: healium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-healium = фильтр хилиума
    .gen = фильтра хилиума
    .dat = фильтру хилиума
    .ins = фильтром хилиума
    .pre = фильтре хилиума

# name: helium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-helium = фильтр гелия
    .gen = фильтра гелия
    .dat = фильтру гелия
    .ins = фильтром гелия
    .pre = фильтре гелия

# name: hyper-noblium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-hypernoblium = фильтр гипер-нобелия
    .gen = фильтра гипер-нобелия
    .dat = фильтру гипер-нобелия
    .ins = фильтром гипер-нобелия
    .pre = фильтре гипер-нобелия

# name: miasma filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-miasma = фильтр миазмы
    .gen = фильтра миазмы
    .dat = фильтру миазмы
    .ins = фильтром миазмы
    .pre = фильтре миазмы

# name: nitrogen filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-n2 = фильтр азота
    .gen = фильтра азота
    .dat = фильтру азота
    .ins = фильтром азота
    .pre = фильтре азота

# name: nitrous oxide filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-n2o = фильтр закиси азота
    .gen = фильтра закиси азота
    .dat = фильтру закиси азота
    .ins = фильтром закиси азота
    .pre = фильтре закиси азота

# name: nitrium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-no2 = фильтр нитриума
    .gen = фильтра нитриума
    .dat = фильтру нитриума
    .ins = фильтром нитриума
    .pre = фильтре нитриума

# name: oxygen filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-o2 = фильтр кислорода
    .gen = фильтра кислорода
    .dat = фильтру кислорода
    .ins = фильтром кислорода
    .pre = фильтре кислорода

# name: plasma filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-plasma = фильтр плазмы
    .gen = фильтра плазмы
    .dat = фильтру плазмы
    .ins = фильтром плазмы
    .pre = фильтре плазмы

# name: pluoxium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-pluoxium = фильтр плуоксиума
    .gen = фильтра плуоксиума
    .dat = фильтру плуоксиума
    .ins = фильтром плуоксиума
    .pre = фильтре плуоксиума

# name: proto-nitrate filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-proto_nitrate = фильтр прото-нитрата
    .gen = фильтра прото-нитрата
    .dat = фильтру прото-нитрата
    .ins = фильтром прото-нитрата
    .pre = фильтре прото-нитрата

# name: tritium filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-tritium = фильтр трития
    .gen = фильтра трития
    .dat = фильтру трития
    .ins = фильтром трития
    .pre = фильтре трития

# name: zauker filter
ent-obj-machinery-atmospherics-components-trinary-filter-atmos-zauker = фильтр заукера
    .gen = фильтра заукера
    .dat = фильтру заукера
    .ins = фильтром заукера
    .pre = фильтре заукера

# name: gas mixer
# desc: Very useful for mixing gasses.
ent-obj-machinery-atmospherics-components-trinary-mixer = газовый смеситель
    .gen = газового смесителя
    .dat = газовому смесителю
    .ins = газовым смесителем
    .pre = газовом смесителе
    .desc = Очень полезен для смешивания газов.

# name: air mixer
ent-obj-machinery-atmospherics-components-trinary-mixer-airmix = воздушный смеситель
    .gen = воздушного смесителя
    .dat = воздушному смесителю
    .ins = воздушным смесителем
    .pre = воздушном смесителе

# name: external airlock pump
# desc: A pump for cycling an external airlock controlled by the connected doors.
ent-obj-machinery-atmospherics-components-unary-airlock_pump = внешний шлюзовой насос
    .gen = внешнего шлюзового насоса
    .dat = внешнему шлюзовому насосу
    .acc = внешний шлюзовый насос
    .ins = внешним шлюзовым насосом
    .pre = внешнем шлюзовом насосе
    .desc = Насос для цикличной работы внешнего шлюза, управляется подключенными дверями.

# name: heat exchanger
# desc: Exchanges heat between two input gases. Set up for fast heat transfer.
ent-obj-machinery-atmospherics-components-unary-heat_exchanger = теплообменник
    .gen = теплообменника
    .dat = теплообменнику
    .ins = теплообменником
    .pre = теплообменнике
    .desc = Обменивает тепло между двумя входящими газами. Настроен на быструю теплопередачу.

# name: thermomachine
# desc: Heats or cools gas in connected pipes.
ent-obj-machinery-atmospherics-components-unary-hypertorus = термомашина
    .dat = термомашину
    .ins = термомашиным
    .pre = термомашине
    .desc = Нагревает или охлаждает газ в подключенных трубах.

# name: HFR core
# desc: This is the Hypertorus Fusion Reactor core, an advanced piece of technology to finely tune the reaction inside of the machine. It has I/O for cooling gases.
ent-obj-machinery-atmospherics-components-unary-hypertorus-core = ядро HFR
    .gen = ядра HFR
    .dat = ядру HFR
    .ins = ядром HFR
    .pre = ядре HFR
    .desc = Ядро гипертороидного термоядерного реактора — передовое устройство для тонкой настройки реакции внутри машины. Имеет порты для охлаждающих газов.

# name: HFR fuel input port
# desc: Input port for the Hypertorus Fusion Reactor, designed to take in fuels with the optimal fuel mix being a 50/50 split.
ent-obj-machinery-atmospherics-components-unary-hypertorus-fuel_input = топливный входной порт HFR
    .gen = топливного входного порта HFR
    .dat = топливному входному порту HFR
    .ins = топливным входным портом HFR
    .pre = топливном входном порте HFR
    .desc = Входной порт гипертороидного термоядерного реактора, предназначенный для подачи топлива; оптимальная топливная смесь — 50/50.

# name: HFR moderator input port
# desc: Moderator port for the Hypertorus Fusion Reactor, designed to move gases inside the machine to cool and control the flow of the reaction.
ent-obj-machinery-atmospherics-components-unary-hypertorus-moderator_input = входной порт модератора HFR
    .gen = входного порта модератора HFR
    .dat = входному порту модератора HFR
    .ins = входным портом модератора HFR
    .pre = входном порте модератора HFR
    .desc = Порт модератора гипертороидного термоядерного реактора, предназначенный для перемещения газов внутри машины для охлаждения и управления ходом реакции.

# name: HFR waste output port
# desc: Waste port for the Hypertorus Fusion Reactor, designed to output the hot waste gases coming from the core of the machine.
ent-obj-machinery-atmospherics-components-unary-hypertorus-waste_output = выходной порт отходов HFR
    .gen = выходного порта отходов HFR
    .dat = выходному порту отходов HFR
    .ins = выходным портом отходов HFR
    .pre = выходном порте отходов HFR
    .desc = Порт отходов гипертороидного термоядерного реактора, предназначенный для вывода горячих отходящих газов из ядра машины.

# name: air injector
# desc: Has a valve and pump attached to it.
ent-obj-machinery-atmospherics-components-unary-outlet_injector = воздушный инжектор
    .gen = воздушного инжектора
    .dat = воздушному инжектору
    .ins = воздушным инжектором
    .pre = воздушном инжекторе
    .desc = К нему подсоединены клапан и насос.

# name: air mix tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-air_input = входной инжектор воздушно-смесительного баллона
    .gen = входного инжектора воздушно-смесительного баллона
    .dat = входному инжектору воздушно-смесительного баллона
    .ins = входным инжектором воздушно-смесительного баллона
    .pre = входном инжекторе воздушно-смесительного баллона

# name: antinoblium tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-antinoblium_input = входной инжектор баллона с антинобелием
    .gen = входного инжектора баллона с антинобелием
    .dat = входному инжектору баллона с антинобелием
    .ins = входным инжектором баллона с антинобелием
    .pre = входном инжекторе баллона с антинобелием

# name: bz tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-bz_input = входной инжектор баллона с BZ
    .gen = входного инжектора баллона с BZ
    .dat = входному инжектору баллона с BZ
    .ins = входным инжектором баллона с BZ
    .pre = входном инжекторе баллона с BZ

# name: carbon dioxide tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-carbon_input = входной инжектор баллона с углекислым газом
    .gen = входного инжектора баллона с углекислым газом
    .dat = входному инжектору баллона с углекислым газом
    .ins = входным инжектором баллона с углекислым газом
    .pre = входном инжекторе баллона с углекислым газом

# name: freon tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-freon_input = входной инжектор баллона с фреоном
    .gen = входного инжектора баллона с фреоном
    .dat = входному инжектору баллона с фреоном
    .ins = входным инжектором баллона с фреоном
    .pre = входном инжекторе баллона с фреоном

# name: halon tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-halon_input = входной инжектор баллона с галоном
    .gen = входного инжектора баллона с галоном
    .dat = входному инжектору баллона с галоном
    .ins = входным инжектором баллона с галоном
    .pre = входном инжекторе баллона с галоном

# name: healium tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-healium_input = входной инжектор баллона с хилиумом
    .gen = входного инжектора баллона с хилиумом
    .dat = входному инжектору баллона с хилиумом
    .ins = входным инжектором баллона с хилиумом
    .pre = входном инжекторе баллона с хилиумом

# name: helium tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-helium_input = входной инжектор баллона с гелием
    .gen = входного инжектора баллона с гелием
    .dat = входному инжектору баллона с гелием
    .ins = входным инжектором баллона с гелием
    .pre = входном инжекторе баллона с гелием

# name: hydrogen tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-hydrogen_input = входной инжектор баллона с водородом
    .gen = входного инжектора баллона с водородом
    .dat = входному инжектору баллона с водородом
    .ins = входным инжектором баллона с водородом
    .pre = входном инжекторе баллона с водородом

# name: hypernoblium tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-hypernoblium_input = входной инжектор баллона с гипер-нобелием
    .gen = входного инжектора баллона с гипер-нобелием
    .dat = входному инжектору баллона с гипер-нобелием
    .ins = входным инжектором баллона с гипер-нобелием
    .pre = входном инжекторе баллона с гипер-нобелием

# name: incinerator chamber input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-incinerator_input = входной инжектор камеры инсинератора
    .gen = входного инжектора камеры инсинератора
    .dat = входному инжектору камеры инсинератора
    .ins = входным инжектором камеры инсинератора
    .pre = входном инжекторе камеры инсинератора

# name: miasma tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-miasma_input = входной инжектор баллона с миазмой
    .gen = входного инжектора баллона с миазмой
    .dat = входному инжектору баллона с миазмой
    .ins = входным инжектором баллона с миазмой
    .pre = входном инжекторе баллона с миазмой

# name: mix tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-mix_input = входной инжектор смесительного баллона
    .gen = входного инжектора смесительного баллона
    .dat = входному инжектору смесительного баллона
    .ins = входным инжектором смесительного баллона
    .pre = входном инжекторе смесительного баллона

# name: nitrium tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-nitrium_input = входной инжектор баллона с нитриумом
    .gen = входного инжектора баллона с нитриумом
    .dat = входному инжектору баллона с нитриумом
    .ins = входным инжектором баллона с нитриумом
    .pre = входном инжекторе баллона с нитриумом

# name: nitrogen tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-nitrogen_input = входной инжектор баллона с азотом
    .gen = входного инжектора баллона с азотом
    .dat = входному инжектору баллона с азотом
    .ins = входным инжектором баллона с азотом
    .pre = входном инжекторе баллона с азотом

# name: nitrous oxide tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-nitrous_input = входной инжектор баллона с закисью азота
    .gen = входного инжектора баллона с закисью азота
    .dat = входному инжектору баллона с закисью азота
    .ins = входным инжектором баллона с закисью азота
    .pre = входном инжекторе баллона с закисью азота

# name: ordnance burn chamber input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-ordnance_burn_chamber_input = входной инжектор камеры сжигания лаборатории боеприпасов
    .gen = входного инжектора камеры сжигания лаборатории боеприпасов
    .dat = входному инжектору камеры сжигания лаборатории боеприпасов
    .ins = входным инжектором камеры сжигания лаборатории боеприпасов
    .pre = входном инжекторе камеры сжигания лаборатории боеприпасов

# name: ordnance freezer chamber input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-ordnance_freezer_chamber_input = входной инжектор камеры заморозки лаборатории боеприпасов
    .gen = входного инжектора камеры заморозки лаборатории боеприпасов
    .dat = входному инжектору камеры заморозки лаборатории боеприпасов
    .ins = входным инжектором камеры заморозки лаборатории боеприпасов
    .pre = входном инжекторе камеры заморозки лаборатории боеприпасов

# name: oxygen tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-oxygen_input = входной инжектор баллона с кислородом
    .gen = входного инжектора баллона с кислородом
    .dat = входному инжектору баллона с кислородом
    .ins = входным инжектором баллона с кислородом
    .pre = входном инжекторе баллона с кислородом

# name: plasma tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-plasma_input = входной инжектор баллона с плазмой
    .gen = входного инжектора баллона с плазмой
    .dat = входному инжектору баллона с плазмой
    .ins = входным инжектором баллона с плазмой
    .pre = входном инжекторе баллона с плазмой

# name: pluoxium tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-pluoxium_input = входной инжектор баллона с плуоксиумом
    .gen = входного инжектора баллона с плуоксиумом
    .dat = входному инжектору баллона с плуоксиумом
    .ins = входным инжектором баллона с плуоксиумом
    .pre = входном инжекторе баллона с плуоксиумом

# name: proto-nitrate tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-proto_nitrate_input = входной инжектор баллона с прото-нитратом
    .gen = входного инжектора баллона с прото-нитратом
    .dat = входному инжектору баллона с прото-нитратом
    .ins = входным инжектором баллона с прото-нитратом
    .pre = входном инжекторе баллона с прото-нитратом

# name: tritium tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-tritium_input = входной инжектор баллона с тритием
    .gen = входного инжектора баллона с тритием
    .dat = входному инжектору баллона с тритием
    .ins = входным инжектором баллона с тритием
    .pre = входном инжекторе баллона с тритием

# name: water vapor tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-water_vapor_input = входной инжектор баллона с водяным паром
    .gen = входного инжектора баллона с водяным паром
    .dat = входному инжектору баллона с водяным паром
    .ins = входным инжектором баллона с водяным паром
    .pre = входном инжекторе баллона с водяным паром

# name: zauker tank input injector
ent-obj-machinery-atmospherics-components-unary-outlet_injector-monitored-zauker_input = входной инжектор баллона с заукером
    .gen = входного инжектора баллона с заукером
    .dat = входному инжектору баллона с заукером
    .ins = входным инжектором баллона с заукером
    .pre = входном инжекторе баллона с заукером

# name: passive vent
# desc: It is an open vent.
ent-obj-machinery-atmospherics-components-unary-passive_vent = пассивная вентиляция
    .gen = пассивной вентиляции
    .dat = пассивной вентиляции
    .acc = пассивную вентиляцию
    .ins = пассивной вентиляцией
    .pre = пассивной вентиляции
    .desc = Это открытая вентиляционная решетка.

# name: connector port
# desc: For connecting portables devices related to atmospherics control.
ent-obj-machinery-atmospherics-components-unary-portables_connector = соединительный порт
    .gen = соединительного порта
    .dat = соединительному порту
    .ins = соединительным портом
    .pre = соединительном порте
    .desc = Для подключения переносных устройств, связанных с управлением атмосферой.

# name: Temperature control unit
# desc: Heats or cools gas in connected pipes.
ent-obj-machinery-atmospherics-components-unary-thermomachine = Блок контроля температуры
    .gen = Блока контроля температуры
    .dat = Блоку контроля температуры
    .ins = Блоком контроля температуры
    .pre = Блоке контроля температуры
    .desc = Нагревает или охлаждает газ в подключенных трубах.

# name: Cold room temperature control unit
ent-obj-machinery-atmospherics-components-unary-thermomachine-freezer-on-coldroom = Блок контроля температуры холодной комнаты
    .gen = Блока контроля температуры холодной комнаты
    .dat = Блоку контроля температуры холодной комнаты
    .ins = Блоком контроля температуры холодной комнаты
    .pre = Блоке контроля температуры холодной комнаты

# name: air vent
# desc: Has a valve and pump attached to it.
ent-obj-machinery-atmospherics-components-unary-vent_pump = воздушная вентиляция
    .gen = воздушной вентиляции
    .dat = воздушной вентиляции
    .acc = воздушную вентиляцию
    .ins = воздушной вентиляцией
    .pre = воздушной вентиляции
    .desc = К ней подсоединены клапан и насос.

# name: large air vent
ent-obj-machinery-atmospherics-components-unary-vent_pump-high_volume = большая воздушная вентиляция
    .gen = большей воздушной вентиляции
    .dat = большей воздушной вентиляции
    .acc = большую воздушную вентиляцию
    .ins = большей воздушной вентиляцией
    .pre = большей воздушной вентиляции

# name: air mix tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-high_volume-siphon-monitored-air_output = выпускное отверстие воздушно-смесительного баллона
    .gen = выпускного отверстия воздушно-смесительного баллона
    .dat = выпускному отверстию воздушно-смесительного баллона
    .ins = выпускным отверстием воздушно-смесительного баллона
    .pre = выпускном отверстии воздушно-смесительного баллона

# name: antinoblium tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-antinoblium_output = выпускное отверстие баллона с антинобелием
    .gen = выпускного отверстия баллона с антинобелием
    .dat = выпускному отверстию баллона с антинобелием
    .ins = выпускным отверстием баллона с антинобелием
    .pre = выпускном отверстии баллона с антинобелием

# name: bz tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-bz_output = выпускное отверстие баллона с BZ
    .gen = выпускного отверстия баллона с BZ
    .dat = выпускному отверстию баллона с BZ
    .ins = выпускным отверстием баллона с BZ
    .pre = выпускном отверстии баллона с BZ

# name: carbon dioxide tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-carbon_output = выпускное отверстие баллона с углекислым газом
    .gen = выпускного отверстия баллона с углекислым газом
    .dat = выпускному отверстию баллона с углекислым газом
    .ins = выпускным отверстием баллона с углекислым газом
    .pre = выпускном отверстии баллона с углекислым газом

# name: freon tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-freon_output = выпускное отверстие баллона с фреоном
    .gen = выпускного отверстия баллона с фреоном
    .dat = выпускному отверстию баллона с фреоном
    .ins = выпускным отверстием баллона с фреоном
    .pre = выпускном отверстии баллона с фреоном

# name: halon tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-halon_output = выпускное отверстие баллона с галоном
    .gen = выпускного отверстия баллона с галоном
    .dat = выпускному отверстию баллона с галоном
    .ins = выпускным отверстием баллона с галоном
    .pre = выпускном отверстии баллона с галоном

# name: healium tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-healium_output = выпускное отверстие баллона с хилиумом
    .gen = выпускного отверстия баллона с хилиумом
    .dat = выпускному отверстию баллона с хилиумом
    .ins = выпускным отверстием баллона с хилиумом
    .pre = выпускном отверстии баллона с хилиумом

# name: helium tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-helium_output = выпускное отверстие баллона с гелием
    .gen = выпускного отверстия баллона с гелием
    .dat = выпускному отверстию баллона с гелием
    .ins = выпускным отверстием баллона с гелием
    .pre = выпускном отверстии баллона с гелием

# name: hydrogen tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-hydrogen_output = выпускное отверстие баллона с водородом
    .gen = выпускного отверстия баллона с водородом
    .dat = выпускному отверстию баллона с водородом
    .ins = выпускным отверстием баллона с водородом
    .pre = выпускном отверстии баллона с водородом

# name: hypernoblium tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-hypernoblium_output = выпускное отверстие баллона с гипер-нобелием
    .gen = выпускного отверстия баллона с гипер-нобелием
    .dat = выпускному отверстию баллона с гипер-нобелием
    .ins = выпускным отверстием баллона с гипер-нобелием
    .pre = выпускном отверстии баллона с гипер-нобелием

# name: incinerator chamber output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-incinerator_output = выпускное отверстие камеры инсинератора
    .gen = выпускного отверстия камеры инсинератора
    .dat = выпускному отверстию камеры инсинератора
    .ins = выпускным отверстием камеры инсинератора
    .pre = выпускном отверстии камеры инсинератора

# name: miasma tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-miasma_output = выпускное отверстие баллона с миазмой
    .gen = выпускного отверстия баллона с миазмой
    .dat = выпускному отверстию баллона с миазмой
    .ins = выпускным отверстием баллона с миазмой
    .pre = выпускном отверстии баллона с миазмой

# name: mix tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-mix_output = выпускное отверстие смесительного баллона
    .gen = выпускного отверстия смесительного баллона
    .dat = выпускному отверстию смесительного баллона
    .ins = выпускным отверстием смесительного баллона
    .pre = выпускном отверстии смесительного баллона

# name: nitrium tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-nitrium_output = выпускное отверстие баллона с нитриумом
    .gen = выпускного отверстия баллона с нитриумом
    .dat = выпускному отверстию баллона с нитриумом
    .ins = выпускным отверстием баллона с нитриумом
    .pre = выпускном отверстии баллона с нитриумом

# name: nitrogen tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-nitrogen_output = выпускное отверстие баллона с азотом
    .gen = выпускного отверстия баллона с азотом
    .dat = выпускному отверстию баллона с азотом
    .ins = выпускным отверстием баллона с азотом
    .pre = выпускном отверстии баллона с азотом

# name: nitrous oxide tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-nitrous_output = выпускное отверстие баллона с закисью азота
    .gen = выпускного отверстия баллона с закисью азота
    .dat = выпускному отверстию баллона с закисью азота
    .ins = выпускным отверстием баллона с закисью азота
    .pre = выпускном отверстии баллона с закисью азота

# name: ordnance burn chamber output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-ordnance_burn_chamber_output = выпускное отверстие камеры сжигания лаборатории боеприпасов
    .gen = выпускного отверстия камеры сжигания лаборатории боеприпасов
    .dat = выпускному отверстию камеры сжигания лаборатории боеприпасов
    .ins = выпускным отверстием камеры сжигания лаборатории боеприпасов
    .pre = выпускном отверстии камеры сжигания лаборатории боеприпасов

# name: ordnance freezer chamber output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-ordnance_freezer_chamber_output = выпускное отверстие камеры заморозки лаборатории боеприпасов
    .gen = выпускного отверстия камеры заморозки лаборатории боеприпасов
    .dat = выпускному отверстию камеры заморозки лаборатории боеприпасов
    .ins = выпускным отверстием камеры заморозки лаборатории боеприпасов
    .pre = выпускном отверстии камеры заморозки лаборатории боеприпасов

# name: oxygen tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-oxygen_output = выпускное отверстие баллона с кислородом
    .gen = выпускного отверстия баллона с кислородом
    .dat = выпускному отверстию баллона с кислородом
    .ins = выпускным отверстием баллона с кислородом
    .pre = выпускном отверстии баллона с кислородом

# name: plasma tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-plasma_output = выпускное отверстие баллона с плазмой
    .gen = выпускного отверстия баллона с плазмой
    .dat = выпускному отверстию баллона с плазмой
    .ins = выпускным отверстием баллона с плазмой
    .pre = выпускном отверстии баллона с плазмой

# name: pluoxium tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-pluoxium_output = выпускное отверстие баллона с плуоксиумом
    .gen = выпускного отверстия баллона с плуоксиумом
    .dat = выпускному отверстию баллона с плуоксиумом
    .ins = выпускным отверстием баллона с плуоксиумом
    .pre = выпускном отверстии баллона с плуоксиумом

# name: proto-nitrate tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-proto_nitrate_output = выпускное отверстие баллона с прото-нитратом
    .gen = выпускного отверстия баллона с прото-нитратом
    .dat = выпускному отверстию баллона с прото-нитратом
    .ins = выпускным отверстием баллона с прото-нитратом
    .pre = выпускном отверстии баллона с прото-нитратом

# name: tritium tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-tritium_output = выпускное отверстие баллона с тритием
    .gen = выпускного отверстия баллона с тритием
    .dat = выпускному отверстию баллона с тритием
    .ins = выпускным отверстием баллона с тритием
    .pre = выпускном отверстии баллона с тритием

# name: water vapor tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-water_vapor_output = выпускное отверстие баллона с водяным паром
    .gen = выпускного отверстия баллона с водяным паром
    .dat = выпускному отверстию баллона с водяным паром
    .ins = выпускным отверстием баллона с водяным паром
    .pre = выпускном отверстии баллона с водяным паром

# name: zauker tank output inlet
ent-obj-machinery-atmospherics-components-unary-vent_pump-siphon-monitored-zauker_output = выпускное отверстие баллона с заукером
    .gen = выпускного отверстия баллона с заукером
    .dat = выпускному отверстию баллона с заукером
    .ins = выпускным отверстием баллона с заукером
    .pre = выпускном отверстии баллона с заукером

# name: air scrubber
# desc: Has a valve and pump attached to it.
ent-obj-machinery-atmospherics-components-unary-vent_scrubber = воздушный скруббер
    .gen = воздушного скруббера
    .dat = воздушному скрубберу
    .ins = воздушным скруббером
    .pre = воздушном скруббере
    .desc = К нему подсоединены клапан и насос.

# name: gas miner
# desc: Gasses mined from the gas giant below (above?) flow out through this massive vent.
ent-obj-machinery-atmospherics-miner = газодобытчик
    .gen = газодобытчика
    .dat = газодобытчику
    .acc = газодобытчика
    .ins = газодобытчиком
    .pre = газодобытчике
    .desc = Газы, добытые из газового гиганта внизу (вверху?), вытекают через эту массивную вентиляционную решетку.

# name: Antinoblium Gas Miner
ent-obj-machinery-atmospherics-miner-antinoblium = Газодобытчик антинобелия
    .gen = Газодобытчика антинобелия
    .dat = Газодобытчику антинобелия
    .acc = Газодобытчика антинобелия
    .ins = Газодобытчиком антинобелия
    .pre = Газодобытчике антинобелия

# name: BZ Gas Miner
ent-obj-machinery-atmospherics-miner-bz = Газодобытчик BZ
    .gen = Газодобытчика BZ
    .dat = Газодобытчику BZ
    .acc = Газодобытчика BZ
    .ins = Газодобытчиком BZ
    .pre = Газодобытчике BZ

# name: CO2 Gas Miner
ent-obj-machinery-atmospherics-miner-carbon_dioxide = Газодобытчик CO2
    .gen = Газодобытчика CO2
    .dat = Газодобытчику CO2
    .acc = Газодобытчика CO2
    .ins = Газодобытчиком CO2
    .pre = Газодобытчике CO2

# name: Freon Gas Miner
ent-obj-machinery-atmospherics-miner-freon = Газодобытчик фреона
    .gen = Газодобытчика фреона
    .dat = Газодобытчику фреона
    .acc = Газодобытчика фреона
    .ins = Газодобытчиком фреона
    .pre = Газодобытчике фреона

# name: Halon Gas Miner
ent-obj-machinery-atmospherics-miner-halon = Газодобытчик галона
    .gen = Газодобытчика галона
    .dat = Газодобытчику галона
    .acc = Газодобытчика галона
    .ins = Газодобытчиком галона
    .pre = Газодобытчике галона

# name: Healium Gas Miner
ent-obj-machinery-atmospherics-miner-healium = Газодобытчик хилиума
    .gen = Газодобытчика хилиума
    .dat = Газодобытчику хилиума
    .acc = Газодобытчика хилиума
    .ins = Газодобытчиком хилиума
    .pre = Газодобытчике хилиума

# name: Helium Gas Miner
ent-obj-machinery-atmospherics-miner-helium = Газодобытчик гелия
    .gen = Газодобытчика гелия
    .dat = Газодобытчику гелия
    .acc = Газодобытчика гелия
    .ins = Газодобытчиком гелия
    .pre = Газодобытчике гелия

# name: Hydrogen Gas Miner
ent-obj-machinery-atmospherics-miner-hydrogen = Газодобытчик водорода
    .gen = Газодобытчика водорода
    .dat = Газодобытчику водорода
    .acc = Газодобытчика водорода
    .ins = Газодобытчиком водорода
    .pre = Газодобытчике водорода

# name: Hypernoblium Gas Miner
ent-obj-machinery-atmospherics-miner-hypernoblium = Газодобытчик гипер-нобелия
    .gen = Газодобытчика гипер-нобелия
    .dat = Газодобытчику гипер-нобелия
    .acc = Газодобытчика гипер-нобелия
    .ins = Газодобытчиком гипер-нобелия
    .pre = Газодобытчике гипер-нобелия

# name: Miasma Gas Miner
ent-obj-machinery-atmospherics-miner-miasma = Газодобытчик миазмы
    .gen = Газодобытчика миазмы
    .dat = Газодобытчику миазмы
    .acc = Газодобытчика миазмы
    .ins = Газодобытчиком миазмы
    .pre = Газодобытчике миазмы

# name: N2O Gas Miner
ent-obj-machinery-atmospherics-miner-n2o = Газодобытчик N2O
    .gen = Газодобытчика N2O
    .dat = Газодобытчику N2O
    .acc = Газодобытчика N2O
    .ins = Газодобытчиком N2O
    .pre = Газодобытчике N2O

# name: Nitrium Gas Miner
ent-obj-machinery-atmospherics-miner-nitrium = Газодобытчик нитриума
    .gen = Газодобытчика нитриума
    .dat = Газодобытчику нитриума
    .acc = Газодобытчика нитриума
    .ins = Газодобытчиком нитриума
    .pre = Газодобытчике нитриума

# name: N2 Gas Miner
ent-obj-machinery-atmospherics-miner-nitrogen = Газодобытчик N2
    .gen = Газодобытчика N2
    .dat = Газодобытчику N2
    .acc = Газодобытчика N2
    .ins = Газодобытчиком N2
    .pre = Газодобытчике N2

# name: O2 Gas Miner
ent-obj-machinery-atmospherics-miner-oxygen = Газодобытчик O2
    .gen = Газодобытчика O2
    .dat = Газодобытчику O2
    .acc = Газодобытчика O2
    .ins = Газодобытчиком O2
    .pre = Газодобытчике O2

# name: Plasma Gas Miner
ent-obj-machinery-atmospherics-miner-plasma = Газодобытчик плазмы
    .gen = Газодобытчика плазмы
    .dat = Газодобытчику плазмы
    .acc = Газодобытчика плазмы
    .ins = Газодобытчиком плазмы
    .pre = Газодобытчике плазмы

# name: Pluoxium Gas Miner
ent-obj-machinery-atmospherics-miner-pluoxium = Газодобытчик плуоксиума
    .gen = Газодобытчика плуоксиума
    .dat = Газодобытчику плуоксиума
    .acc = Газодобытчика плуоксиума
    .ins = Газодобытчиком плуоксиума
    .pre = Газодобытчике плуоксиума

# name: Proto-Nitrate Gas Miner
ent-obj-machinery-atmospherics-miner-proto_nitrate = Газодобытчик прото-нитрата
    .gen = Газодобытчика прото-нитрата
    .dat = Газодобытчику прото-нитрата
    .acc = Газодобытчика прото-нитрата
    .ins = Газодобытчиком прото-нитрата
    .pre = Газодобытчике прото-нитрата

# name: Tritium Gas Miner
ent-obj-machinery-atmospherics-miner-tritium = Газодобытчик трития
    .gen = Газодобытчика трития
    .dat = Газодобытчику трития
    .acc = Газодобытчика трития
    .ins = Газодобытчиком трития
    .pre = Газодобытчике трития

# name: Water Vapor Gas Miner
ent-obj-machinery-atmospherics-miner-water_vapor = Газодобытчик водяного пара
    .gen = Газодобытчика водяного пара
    .dat = Газодобытчику водяного пара
    .acc = Газодобытчика водяного пара
    .ins = Газодобытчиком водяного пара
    .pre = Газодобытчике водяного пара

# name: Zauker Gas Miner
ent-obj-machinery-atmospherics-miner-zauker = Газодобытчик заукера
    .gen = Газодобытчика заукера
    .dat = Газодобытчику заукера
    .acc = Газодобытчика заукера
    .ins = Газодобытчиком заукера
    .pre = Газодобытчике заукера

# name: bridge pipe
# desc: A one meter section of regular pipe used to connect pipenets over pipes.
ent-obj-machinery-atmospherics-pipe-bridge_pipe = мостовая труба
    .gen = мостовая трубы
    .dat = мостовая трубе
    .acc = мостовая трубу
    .ins = мостовая трубой
    .pre = мостовая трубе
    .desc = Метровый отрезок обычной трубы для соединения трубных сетей поверх других труб.

# name: color adapter
# desc: A one meter section of regular pipe used to connect different colored pipes.
ent-obj-machinery-atmospherics-pipe-color_adapter = цветовой адаптер
    .gen = цветового адаптера
    .dat = цветовому адаптеру
    .ins = цветовым адаптером
    .pre = цветовом адаптере
    .desc = Метровый отрезок обычной трубы для соединения труб разных цветов.

# name: junction
# desc: A one meter junction that connects regular and heat-exchanging pipe.
ent-obj-machinery-atmospherics-pipe-heat_exchanging-junction = переходник
    .gen = переходника
    .dat = переходнику
    .ins = переходником
    .pre = переходнике
    .desc = Метровый переходник, соединяющий обычные и теплообменные трубы.

# name: pipe manifold
# desc: A manifold composed of regular pipes.
ent-obj-machinery-atmospherics-pipe-heat_exchanging-manifold = трубный коллектор
    .gen = трубного коллектора
    .dat = трубному коллектору
    .ins = трубным коллектором
    .pre = трубном коллекторе
    .desc = Коллектор из обычных труб.

# name: 4-way pipe manifold
# desc: A manifold composed of heat-exchanging pipes.
ent-obj-machinery-atmospherics-pipe-heat_exchanging-manifold4w = 4-сторонний трубный коллектор
    .gen = 4-стороннего трубного коллектора
    .dat = 4-стороннему трубному коллектору
    .ins = 4-сторонним трубным коллектором
    .pre = 4-стороннем трубном коллекторе
    .desc = Коллектор из теплообменных труб.

# name: pipe
# desc: A one meter section of heat-exchanging pipe.
ent-obj-machinery-atmospherics-pipe-heat_exchanging-simple = труба
    .gen = трубы
    .dat = трубе
    .acc = трубу
    .ins = трубой
    .pre = трубе
    .desc = Метровый отрезок теплообменной трубы.

# name: layer adaptor
# desc: A special pipe to bridge pipe layers with.
ent-obj-machinery-atmospherics-pipe-layer_manifold = адаптер слоев
    .gen = адаптера слоев
    .dat = адаптеру слоев
    .ins = адаптером слоев
    .pre = адаптере слоев
    .desc = Специальная труба для перехода между слоями труб.

# name: multi deck pipe adapter
# desc: An adapter which allows pipes to connect to other pipenets on different decks.
ent-obj-machinery-atmospherics-pipe-multiz = межпалубный трубный адаптер
    .gen = межпалубного трубного адаптера
    .dat = межпалубному трубному адаптеру
    .ins = межпалубным трубным адаптером
    .pre = межпалубном трубном адаптере
    .desc = Адаптер, позволяющий трубам соединяться с другими трубными сетями на разных палубах.

# name: pipe
# desc: A one meter section of regular pipe.
ent-obj-machinery-atmospherics-pipe-smart = труба
    .gen = трубы
    .dat = трубе
    .acc = трубу
    .ins = трубой
    .pre = трубе
    .desc = Метровый отрезок обычной трубы.
