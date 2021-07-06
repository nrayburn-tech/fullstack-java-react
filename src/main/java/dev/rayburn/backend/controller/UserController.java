package dev.rayburn.backend.controller;

import dev.rayburn.backend.entity.User;
import dev.rayburn.backend.mapper.UserMapper;
import dev.rayburn.backend.repository.UserRepository;
import dev.rayburn.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RequestMapping("/api/user")
@RestController
public class UserController implements ControllerInterface<User, UserRepository, UserService, UserMapper> {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @Autowired
    UserController(PasswordEncoder passwordEncoder, UserService userService){
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Override
    public UserService getService() {
        return userService;
    }

}
