package dev.rayburn.backend.repository;

import dev.rayburn.backend.entity.VerificationToken;

import java.util.Optional;

public interface VerificationTokenRepository extends RepositoryInterface<VerificationToken> {
    Optional<VerificationToken> findByToken(String token);
}
