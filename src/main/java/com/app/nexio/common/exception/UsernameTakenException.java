package com.app.nexio.common.exception;

public class UsernameTakenException extends RuntimeException {
    public UsernameTakenException(String message) {
        super(message);
    }
}
