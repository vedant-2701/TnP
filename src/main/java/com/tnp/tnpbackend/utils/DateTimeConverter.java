package com.tnp.tnpbackend.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class DateTimeConverter {

    private static final ZoneId UTC_ZONE = ZoneId.of("UTC");
    private static final ZoneId IST_ZONE = ZoneId.of("UTC+05:30");

   
    public static LocalDate convertToIST(LocalDate utcDate) {
        if (utcDate == null) {
            return null;
        }
        // Assume the LocalDate is in UTC, convert it to IST
        ZonedDateTime utcZoned = utcDate.atStartOfDay(UTC_ZONE);
        ZonedDateTime istZoned = utcZoned.withZoneSameInstant(IST_ZONE);
        return istZoned.toLocalDate();
    }

   
    public static LocalDateTime convertToIST(LocalDateTime utcDateTime) {
        if (utcDateTime == null) {
            return null;
        }
        // Convert UTC LocalDateTime to IST
        ZonedDateTime utcZoned = utcDateTime.atZone(UTC_ZONE);
        ZonedDateTime istZoned = utcZoned.withZoneSameInstant(IST_ZONE);
        return istZoned.toLocalDateTime();
    }
}