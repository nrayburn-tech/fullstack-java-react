package dev.rayburn.backend.repository;


import dev.rayburn.backend.entity.Address;
import dev.rayburn.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Autowired
    private PasswordEncoder passwordEncoder;

    @EventListener
    public void handleContextRefresh(ContextRefreshedEvent event){
        User userOne = new User();
        userOne.setFirstName("Nick");
        userOne.setLastName("Rayburn");
        userOne.setEnabled(true);
        userOne.setEmail("nrayburn@email.com");
        userOne.setPassword(passwordEncoder.encode("password"));
        userOne.setRoles(Set.of("USER"));
        userRepository.save(userOne);

        Address addressOne = new Address();
        addressOne.setLineOne("1234 Street One");
        addressOne.setUser(userOne);
        addressRepository.save(addressOne);
    }

}
