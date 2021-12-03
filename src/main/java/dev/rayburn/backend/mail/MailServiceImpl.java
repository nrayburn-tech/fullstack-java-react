package dev.rayburn.backend.mail;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

@Component
@Log4j2
public class MailServiceImpl implements MailSender {

    /**
     * This is null if config values are not supplied
     * for {@link dev.rayburn.backend.mail.Config}
     */
    private final JavaMailSenderImpl mailSender;

    @Autowired
    public MailServiceImpl(@Nullable JavaMailSenderImpl mailSender) {
        super();
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) {
        if (mailSender != null) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            send(message);
        }
    }

    @Override
    public void send(@NonNull SimpleMailMessage simpleMessage) throws MailException {
        if (mailSender != null) {
            mailSender.send(simpleMessage);
        }
    }

    @Override
    public void send(@NonNull SimpleMailMessage... simpleMessages) throws MailException {
        for (SimpleMailMessage message : simpleMessages) {
            send(message);
        }
    }

}
