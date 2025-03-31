package com.tnp.tnpbackend.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class DateTimeConverter {

    private static final ZoneId UTC_ZONE = ZoneId.of("UTC");

    public static LocalDateTime convertToIST(LocalDateTime utcDateTime) {
        if (utcDateTime == null) {
            return null;
        }
        // Convert UTC LocalDateTime to IST
        ZonedDateTime utcZoned = ZonedDateTime.of(utcDateTime, UTC_ZONE);
        return utcZoned.toLocalDateTime();
    }
}