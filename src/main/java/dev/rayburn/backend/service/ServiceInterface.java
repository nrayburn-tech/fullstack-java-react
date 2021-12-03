package dev.rayburn.backend.service;

import dev.rayburn.backend.entity.AbstractEntity;
import dev.rayburn.backend.repository.RepositoryInterface;
import lombok.extern.log4j.Log4j2;

public interface ServiceInterface<Entity extends AbstractEntity, Repository extends RepositoryInterface<Entity>> {

    Repository getRepository();


    default Entity findById(Long id) {
        Log.log.info("Finding entity with id {}", id);
        return getRepository().findById(id).orElseThrow();
    }

    default Iterable<Entity> findAll() {
        Log.log.info("Finding all entities");
        return getRepository().findAll();
    }

    default Entity update(Entity entity) {
        Log.log.info("Updating entity with id {}", entity.getId());
        findById(entity.getId());
        return getRepository().save(entity);
    }

    default Entity save(Entity entity) {
        Log.log.info("Creating entity");
        return getRepository().save(entity);
    }

    default void delete(Long id) {
        Log.log.info("Deleting entity with id {}", id);
        // Ensure the entity exists with id.
        findById(id);
        getRepository().deleteById(id);
    }

    @Log4j2
    final class Log {
    }
}
