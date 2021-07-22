package dev.rayburn.backend.auth;

import dev.rayburn.backend.entity.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class Utility {
    private Utility(){

    }

    public static UserPrincipal getAuth(){
        SecurityContext context = SecurityContextHolder.getContext();
        if (context == null){
            return null;
        }
        Authentication auth = context.getAuthentication();
        if (auth == null){
            return null;
        }
        if (auth.getPrincipal() instanceof UserPrincipal){
            return (UserPrincipal) auth.getPrincipal();
        }
        return null;
    }

    public static void setAuth(User user){
        SecurityContext context = SecurityContextHolder.getContext();
        if (context == null){
            throw new RuntimeException("No security context");
        }
        UserPrincipal userDetails = new UserPrincipal(user);
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        context.setAuthentication(authRequest);
    }

}
