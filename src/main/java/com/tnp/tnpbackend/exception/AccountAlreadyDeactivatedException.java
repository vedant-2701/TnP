package com.tnp.tnpbackend.exception;

public class AccountAlreadyDeactivatedException extends RuntimeException {
    public AccountAlreadyDeactivatedException(String message) {
        super(message);
    }

    public AccountAlreadyDeactivatedException(String message, Throwable cause) {
        super(message, cause);
    }

}
