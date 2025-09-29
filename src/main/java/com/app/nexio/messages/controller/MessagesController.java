package com.app.nexio.messages.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/messages")
public class MessagesController {

    @GetMapping
    public String getMessagesPage(Model model) {
        model.addAttribute("active", "messages");
        return "messages";
    }
}
