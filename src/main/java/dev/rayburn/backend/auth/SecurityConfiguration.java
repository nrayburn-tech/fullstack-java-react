package dev.rayburn.backend.auth;

import dev.rayburn.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.*;

import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Value("${spring.security.rememberme.cookie.name}")
    private String rememberMeCookieName;
    @Value("${spring.security.rememberme.cookie.length}")
    private int rememberMeCookieLength;
    @Value("${spring.security.rememberme.cookie.key}")
    private String rememberMeCookieKey;
    @Value("${server.servlet.session.cookie.name}")
    private String cookieName;
    @Value("${spring.security.admin.user:#{null}}")
    private String adminUser;
    @Value("${spring.security.admin.pass:#{null}}")
    private String adminPass;

    private final UserRepository userRepository;

    @Autowired
    SecurityConfiguration(UserRepository userRepository){
        super(false);
        this.userRepository = userRepository;
    }

    @Autowired
    public void configure(AuthenticationManagerBuilder auth){
        auth.authenticationProvider(daoAuthenticationProvider());
        try {
            if (adminUser != null && adminPass != null){
                auth.inMemoryAuthentication()
                        .withUser("admin")
                        .password(passwordEncoder().encode("admin"))
                        .roles("USER", "ADMIN");
            }
        } catch (Exception e){
            System.err.println("Error configuring local admin user.");
            e.printStackTrace();
        }
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(corsConfigurationSource())
                .and()
            .csrf().disable()
            .authorizeRequests()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                .antMatchers("/assets/**", "/login", "/api/login", "/api/user/register", "/api/user/registerConfirm").permitAll()
                .antMatchers("/admin").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .loginProcessingUrl("/api/login")
                .defaultSuccessUrl("/", true)
                .failureUrl("/login?error=true")
                .permitAll()
                .and()
            .logout()
                .permitAll()
                .deleteCookies(cookieName, rememberMeCookieName)
                .and()
            .rememberMe()
                .rememberMeCookieName(rememberMeCookieName)
                .key(rememberMeCookieKey)
                .tokenValiditySeconds(rememberMeCookieLength);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return new JpaUserDetailsService(userRepository);
    }
}
