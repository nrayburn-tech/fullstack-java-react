package dev.rayburn.backend.mail;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
@Log4j2
public class Config {

    @Value("${spring.mail.host:#{null}}")
    private String host;
    @Value("${spring.mail.port:#{null}}")
    private Integer port;
    @Value("${spring.mail.username:#{null}}")
    private String username;
    @Value("${spring.mail.password:#{null}}")
    private String password;
//    @Value("${spring.mail.properties}:#{null}")
//    private Properties properties;

    /**
     * Only activated if we have a host, username, and password.
     *
     */
    @Bean
    @ConditionalOnProperty({"spring.mail.host", "spring.mail.username", "spring.mail.password"})
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        if (port != null){
            mailSender.setPort(port);
        }
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        //TODO: This isn't currently working.  Need to figure out how to use
        // @Value to get all the properties under spring.mail.properties.*
//        if (properties != null){
//            for (Map.Entry<Object, Object> propEntry : properties.entrySet()){
//                System.out.println(propEntry.getKey() + " " + propEntry.getValue());
//                if (props.contains(propEntry.getKey())){
//                    log.info("Overriding property for " + propEntry.getKey());
//                }
//                props.setProperty((String) propEntry.getKey(), (String) propEntry.getValue());
//            }
//        }

        return mailSender;
    }
}
