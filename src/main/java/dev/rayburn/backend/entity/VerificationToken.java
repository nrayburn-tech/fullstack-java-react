package dev.rayburn.backend.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.time.LocalDateTime;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class VerificationToken extends AbstractEntity {
    private String token;
    @OneToOne
    private User user;
    private LocalDateTime expiration;
}
