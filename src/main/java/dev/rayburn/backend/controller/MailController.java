package dev.rayburn.backend.controller;

import dev.rayburn.backend.mail.MailServiceImpl;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RequestMapping("/api/mail")
@RestController
public class MailController {

    private final MailServiceImpl mailService;

    public MailController(MailServiceImpl mailService){
        this.mailService = mailService;
    }

    //TODO: Should be a post with a body instead.
    //TODO: If a mailSender isn't configured, we need to let the user know.
    @GetMapping
    public void sendMail(@RequestParam String to, @RequestParam String subject, @RequestParam String text){
        mailService.sendEmail(to, subject, text);
    }
}
