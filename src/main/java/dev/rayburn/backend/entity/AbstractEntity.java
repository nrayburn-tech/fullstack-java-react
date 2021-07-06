package dev.rayburn.backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
// Trying to fix CreatedDate and LastModifiedDate
//@EntityListeners(NullAuditorAware.class)
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

    public AbstractEntity(AbstractEntity abstractEntity){
        this.id = abstractEntity.getId();
        this.createDate = abstractEntity.getCreateDate();
        this.modifyDate = abstractEntity.getModifyDate();
    }

    public AbstractEntity(AbstractEntity incoming, AbstractEntity existing){
        this(existing);
        if (isNotNull(incoming.getId())){
            this.id = incoming.getId();
        }
        if (isNotNull(incoming.getCreateDate())){
            this.createDate = incoming.getCreateDate();
        }
        if (isNotNull(incoming.getModifyDate())){
            this.modifyDate = incoming.getModifyDate();
        }
    }

    protected boolean isNotNull(Object obj){
        return obj != null;
    }

}
