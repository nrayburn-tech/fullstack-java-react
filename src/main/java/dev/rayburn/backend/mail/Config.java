package dev.rayburn.backend.mail;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
@Log4j2
public class Config {

    @Autowired
    @Qualifier("mailProperties")
    private MailProperties properties;

    /**
     * Only activated if we have a host, username, and password.
     */
    @Bean
    @ConditionalOnProperty({"spring.mail.host", "spring.mail.username", "spring.mail.password"})
    public JavaMailSenderImpl getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(properties.getHost());
        mailSender.setPort(properties.getPort());
        mailSender.setUsername(properties.getUsername());
        mailSender.setPassword(properties.getPassword());
        mailSender.setProtocol(properties.getProtocol());

        Properties props = new Properties();
        props.putAll(properties.getProperties());
        mailSender.setJavaMailProperties(props);

        return mailSender;
    }

    @Bean
    @ConfigurationProperties(prefix = "spring.mail")
    @Qualifier("mailProperties")
    public MailProperties mailProperties() {
        return new MailProperties();
    }
}
