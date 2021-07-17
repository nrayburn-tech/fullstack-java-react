package dev.rayburn.backend.repository;


import dev.rayburn.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@Profile("dev")
public class InitData {

    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @EventListener
    public void handleContextRefresh(ContextRefreshedEvent event){
        User userOne = new User();
        userOne.setFirstName("Nick");
        userOne.setLastName("Rayburn");
        userOne.setEnabled(true);
        userOne.setEmail("nrayburn@email.com");
        userOne.setRoles(Set.of("USER"));
        userRepository.save(userOne);
    }

}
