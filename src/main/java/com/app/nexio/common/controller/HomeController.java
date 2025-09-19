package com.app.nexio.common.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class HomeController {

    @GetMapping("/")
    public String getIndexPage() {

        return "index";
    }

    @GetMapping("/home")
    public String getHomePage() {

        return "home";
    }


}
