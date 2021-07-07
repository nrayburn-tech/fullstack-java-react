package dev.rayburn.backend.auth;

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

}
