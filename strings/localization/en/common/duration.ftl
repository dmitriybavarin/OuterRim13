duration-now = right now

duration-join = { $head } and { $tail }

duration-second = { $count } { $count ->
    [one] second
   *[other] seconds
 }

duration-minute = { $count } { $count ->
    [one] minute
   *[other] minutes
 }

duration-hour = { $count } { $count ->
    [one] hour
   *[other] hours
 }

duration-day = { $count } { $count ->
    [one] day
   *[other] days
 }
