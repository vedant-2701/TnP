package com.tnp.tnpbackend.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int status;            // HTTP status code (e.g., 400, 404)
    private String error;          // HTTP status name (e.g., "Bad Request", "Not Found")
    private String message;        // Detailed error message
    private String path;           // Request URI where the error occurred
    private LocalDateTime timestamp; // Time of the error
}