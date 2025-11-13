package com.app.nexio.common.controller;

import com.app.nexio.common.exception.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;

@ControllerAdvice
public class GlobalControllerAdvice {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler({NoResourceFoundException.class,
            AccessDeniedException.class})
    public String handleNotFoundException(Exception e) {

        return "not-found";
    }


    @ExceptionHandler(UsernameTakenException.class)
    public String handleUsernameTakenException(UsernameTakenException exception, RedirectAttributes redirectAttributes) {

        redirectAttributes.addFlashAttribute("errorMessage", exception.getMessage());

        return "redirect:/auth/register";
    }

    @ExceptionHandler(EmailAssociatedWithAnotherAccount.class)
    public String handleEmailAssociatedWithAnotherAccountException(EmailAssociatedWithAnotherAccount e, RedirectAttributes redirectAttributes) {

        redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());

        return "redirect:/auth/register";
    }

    @ExceptionHandler({AccountDeleted.class,
            AuthenticationException.class})
    public String handleAccountDeletedException(AccountDeleted e, RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        return "redirect:/auth/login";
    }

    @ExceptionHandler(Exception.class)
    public String handleGeneralException() {
        return "internal-server-error";
    }

}
