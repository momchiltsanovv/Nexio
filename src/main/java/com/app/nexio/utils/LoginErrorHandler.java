package com.app.nexio.utils;

import jakarta.servlet.http.HttpSession;
import org.springframework.ui.Model;

public class LoginErrorHandler {

    private static final String INACTIVE_USER_MESSAGE = "inactiveUserMessage";
    private static final String ERROR_MESSAGE = "errorMessage";
    private static final String INVALID_CREDENTIALS_MESSAGE = "Invalid username or password";

    /**
     * Handles login error messages from session attributes and Spring Security error parameter.
     * Priority: blocked account message > invalid credentials message
     *
     * @param model the model to add error messages to
     * @param session the HTTP session to check for blocked account messages
     * @param errorParameter the error parameter from Spring Security (null if no error)
     */
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

