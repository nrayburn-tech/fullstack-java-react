package dev.rayburn.backend.config.auth;

import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

// Trying to fix AbstractEntity CreatedDate and LastModifiedDate.
public class NullAuditorAware implements AuditorAware<Object> {
    @Override
    public Optional<Object> getCurrentAuditor() {
        return Optional.empty();
    }
}
