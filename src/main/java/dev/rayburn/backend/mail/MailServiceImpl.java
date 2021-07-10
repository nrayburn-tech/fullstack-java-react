package dev.rayburn.backend.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.mail.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class MailServiceImpl implements MailSender {

    @Value("${spring.mail.username:#{null}}")
    private String username;
    @Value("${spring.mail.from:#{null}}")
    private String from;

    /**
     * This is null if config values are not supplied
     * for {@link dev.rayburn.backend.mail.Config}
     */
    private final JavaMailSender mailSender;

    @Autowired
    public MailServiceImpl(@Nullable JavaMailSender mailSender){
        super();
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text){
        if (mailSender != null){
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from != null ? from : username);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            send(message);
        }
    }

    @Override
    public void send(@NonNull SimpleMailMessage simpleMessage) throws MailException {
        if (mailSender != null){
            mailSender.send(simpleMessage);
        }
    }

    @Override
    public void send(@NonNull SimpleMailMessage... simpleMessages) throws MailException {
        for (SimpleMailMessage message: simpleMessages){
            send(message);
        }
    }

}
