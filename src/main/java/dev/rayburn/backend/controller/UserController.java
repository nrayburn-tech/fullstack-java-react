package dev.rayburn.backend.controller;

import dev.rayburn.backend.entity.Address;
import dev.rayburn.backend.entity.User;
import dev.rayburn.backend.mapper.UserMapper;
import dev.rayburn.backend.repository.UserRepository;
import dev.rayburn.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;
import java.util.List;


@RequestMapping("/api/user")
@RestController
public class UserController implements ControllerInterface<User, UserRepository, UserService, UserMapper> {

    private final UserService userService;

    @Autowired
    UserController(UserService userService){
        this.userService = userService;
    }

    @Override
    public UserService getService() {
        return userService;
    }

    @GetMapping("/auth")
    public User getAuth(){
        return userService.getAuth();
    }

    @PostMapping("/register")
    @Transactional
    public User register(@RequestBody User user){
        return userService.register(user);
    }

    @GetMapping("/registerConfirm")
    public ModelAndView registerConfirm(HttpServletRequest request, @RequestParam String token){
        HttpSession session = request.getSession(true);
        userService.registerConfirmation(token, session);
        return new ModelAndView("redirect:/");
    }

    @GetMapping("/address/{id}")
    public List<Address> getUserAddressList(@PathVariable Long id){
        return userService.getUserAddressList(id);
    }

}
