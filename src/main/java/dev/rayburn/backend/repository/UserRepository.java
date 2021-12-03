package dev.rayburn.backend.repository;

import dev.rayburn.backend.entity.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends RepositoryInterface<User> {
    Optional<User> findByEmailIgnoreCase(String email);

    Long countAllByEnabledIsTrue();
    
}
