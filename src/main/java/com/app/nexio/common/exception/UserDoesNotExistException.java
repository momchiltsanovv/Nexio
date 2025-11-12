package com.app.nexio.common.exception;

public class UserDoesNotExistException extends RuntimeException{
    public UserDoesNotExistException(String message) {
        super(message);
    }
}
