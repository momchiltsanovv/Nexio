package com.app.nexio.common.exception;

public class DeactivatedAccount extends RuntimeException {
    public DeactivatedAccount(String s) {
        super(s);
    }
}
