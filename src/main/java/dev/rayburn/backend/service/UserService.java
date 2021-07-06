package dev.rayburn.backend.service;

import dev.rayburn.backend.entity.User;
import dev.rayburn.backend.mapper.UserMapper;
import dev.rayburn.backend.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Log4j2
@Service
public class UserService extends AbstractService<User, UserRepository, UserMapper> {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Autowired
    UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        // Create a default user, mainly just for testing.
        User existingUser = userRepository.findByEmailIgnoreCase("nrayburn@email.com").orElse(null);
        if (existingUser == null){
            User user = new User();
            user.setFirstName("nick");
            user.setLastName("rayburn");
            user.setEmail("nrayburn@email.com");
            user.setEnabled(true);
            user.setPassword(passwordEncoder.encode("Nick123"));
            user.setRoles(Set.of("USER"));
            userRepository.save(user);
        }
    }

    @Override
    public UserRepository getRepository() {
        return userRepository;
    }

    @Override
    public UserMapper getMapper() {
        return userMapper;
    }

    @Override
    public User update(User user) {
        if (user.getPassword() != null){
            log.info("User password cannot be updated with a regular update, ignoring value.");
            user.setPassword(null);
        }
        return super.update(user);
    }
}
