duration-now = прямо сейчас

duration-join = { $head } и { $tail }

duration-second = { $count } { $count ->
    [one] секунда
    [few] секунды
   *[many] секунд
 }

duration-minute = { $count } { $count ->
    [one] минута
    [few] минуты
   *[many] минут
 }

duration-hour = { $count } { $count ->
    [one] час
    [few] часа
   *[many] часов
 }

duration-day = { $count } { $count ->
    [one] день
    [few] дня
   *[many] дней
 }
