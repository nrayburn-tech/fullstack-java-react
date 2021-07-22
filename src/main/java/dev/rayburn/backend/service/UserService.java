package dev.rayburn.backend.service;

import dev.rayburn.backend.auth.*;
import dev.rayburn.backend.entity.*;
import dev.rayburn.backend.mail.MailServiceImpl;
import dev.rayburn.backend.mapper.UserMapper;
import dev.rayburn.backend.repository.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Log4j2
@Service
public class UserService extends AbstractService<User, UserRepository, UserMapper> {

    @Value("${app.url:#{null}}")
    private String appUrl;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final MailServiceImpl mailService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final JpaUserDetailsService userDetailsService;
    private final AddressRepository addressRepository;

    @Autowired
    UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper, MailServiceImpl mailService, VerificationTokenRepository verificationTokenRepository, JpaUserDetailsService userDetailsService, AddressRepository addressRepository){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.mailService = mailService;
        this.verificationTokenRepository = verificationTokenRepository;
        this.userDetailsService = userDetailsService;
        this.addressRepository = addressRepository;
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

    @Override
    public User save(User user){
        if (user.getPassword() != null){
            log.info("Encoding user password.");
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return super.save(user);
    }

    public User register(User user){
        user = save(user);
        VerificationToken token = new VerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiration(LocalDateTime.now().plusDays(1L));
        verificationTokenRepository.save(token);
        log.info("Token created {}", token);

        mailService.sendEmail(user.getEmail(), "Registration Confirmation", appUrl + "/api/user/registerConfirm?token=" + token.getToken());
        return user;
    }

    public void registerConfirmation(String token, HttpSession session){
        VerificationToken vToken = verificationTokenRepository.findByToken(token).orElseThrow();
        if (vToken.getExpiration().isAfter(LocalDateTime.now())){
            log.info("Valid token.  User is being enabled and authenticated.");
            User user = vToken.getUser();
            user.setEnabled(true);
            userRepository.save(user);
            UserDetails userDetails = userDetailsService.loadUserByUser(user);
            try {
                UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContext context = SecurityContextHolder.getContext();
                context.setAuthentication(authRequest);
                session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
            } catch (Exception e){
                log.error(e);
            }
        } else {
            throw new RuntimeException("Token is expired");
        }
    }

    public User getAuth(){
        UserPrincipal userPrincipal = Utility.getAuth();
        if (userPrincipal == null || userPrincipal.getUser() == null) {
            throw new RuntimeException("User could not be found");
        }
        User user = getRepository().findById(userPrincipal.getUser().getId()).orElseThrow();
        Utility.setAuth(user);
        return user;
    }

    public List<Address> getUserAddressList(@NonNull Long userId){
        return addressRepository.findAllByUserId(userId);
    }
}
