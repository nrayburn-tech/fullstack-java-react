package dev.rayburn.backend.service;

import dev.rayburn.backend.entity.AbstractEntity;
import dev.rayburn.backend.mapper.MapperInterface;
import dev.rayburn.backend.repository.RepositoryInterface;
import lombok.NonNull;
import lombok.extern.log4j.Log4j2;

public interface ServiceInterface<Entity extends AbstractEntity, Repository extends RepositoryInterface<Entity>, Mapper extends MapperInterface<Entity>> {

    @Log4j2
    final class Log{}

    Repository getRepository();

    Mapper getMapper();

    /**
     * Merges the non-null properties from incoming into existing.
     * Modifies the existing object.
     */
    default Entity mergeObjects(@NonNull Entity incoming, @NonNull Entity existing) {
        Log.log.info("Incoming object is {}, existing object is {}", incoming, existing);
        getMapper().update(incoming, existing);
        Log.log.info("Merged object is {}", existing);
        return existing;
    }

    default Entity findById(Long id){
        Log.log.info("Finding entity with id {}", id);
        return getRepository().findById(id).orElseThrow();
    }

    default Iterable<Entity> findAll(){
        Log.log.info("Finding all entities");
        return getRepository().findAll();
    }

    default Entity update(Entity entity){
        Log.log.info("Updating entity with id {}", entity.getId());
        Entity existing = findById(entity.getId());
        existing = mergeObjects(entity, existing);
        return getRepository().save(existing);
    }

    default Entity save(Entity entity){
        Log.log.info("Creating entity");
        return getRepository().save(entity);
    }

    default void delete(Long id){
        Log.log.info("Deleting entity with id {}", id);
        // Ensure the entity exists with id.
        findById(id);
        getRepository().deleteById(id);
    }
}
