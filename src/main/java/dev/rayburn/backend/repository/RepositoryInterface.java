package dev.rayburn.backend.repository;

import dev.rayburn.backend.entity.AbstractEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface RepositoryInterface<Entity extends AbstractEntity> extends CrudRepository<Entity, Long> {
}
