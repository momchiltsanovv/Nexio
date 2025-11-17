package com.app.nexio.utils;

import jakarta.servlet.http.HttpSession;
import lombok.experimental.UtilityClass;
import org.springframework.ui.Model;

@UtilityClass
public class LoginErrorHandler {

    private static final String INACTIVE_USER_MESSAGE = "inactiveUserMessage";
    private static final String ERROR_MESSAGE = "errorMessage";
    private static final String INVALID_CREDENTIALS_MESSAGE = "Invalid username or password";


    public static void handleLoginErrors(Model model, HttpSession session, String errorParameter) {
        String inactiveUserMessage = (String) session.getAttribute(INACTIVE_USER_MESSAGE);
        if (inactiveUserMessage != null) {
            model.addAttribute(ERROR_MESSAGE, inactiveUserMessage);
            session.removeAttribute(INACTIVE_USER_MESSAGE);
        }
        else if (errorParameter != null) {
            model.addAttribute(ERROR_MESSAGE, INVALID_CREDENTIALS_MESSAGE);
        }
    }
}

