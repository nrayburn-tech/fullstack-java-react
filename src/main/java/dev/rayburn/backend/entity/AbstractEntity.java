package dev.rayburn.backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@MappedSuperclass
@NoArgsConstructor
public abstract class AbstractEntity {
    @Id
    @GeneratedValue
    private Long id;

    // TODO: Not working
    @CreatedDate
    private LocalDateTime createDate;

    // TODO: Not working
    @LastModifiedDate
    private LocalDateTime modifyDate;

}
