package dev.rayburn.backend.auth;

import dev.rayburn.backend.entity.User;
import dev.rayburn.backend.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class JpaUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public JpaUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Finding user with email {}", email);
        User user = this.userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new UsernameNotFoundException(email + " not found"));
        log.info("Found user {}", user);
        return new UserPrincipal(user);
    }

    public UserDetails loadUserByUser(User user) throws UsernameNotFoundException {
        return new UserPrincipal(user);
    }
}
