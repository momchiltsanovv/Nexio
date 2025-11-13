package com.app.nexio.common.exception;

public class EmailAssociatedWithAnotherAccount extends RuntimeException {
    public EmailAssociatedWithAnotherAccount(String message) {
        super(message);
    }
}
