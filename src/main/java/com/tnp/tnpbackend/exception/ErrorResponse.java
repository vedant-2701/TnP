package com.tnp.tnpbackend.exception;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
//Builder
public class ErrorResponse {
    private int status_code;
    private String message;
}
