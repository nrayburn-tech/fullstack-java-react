package dev.rayburn.backend.controller;

import dev.rayburn.backend.entity.AbstractEntity;
import dev.rayburn.backend.repository.RepositoryInterface;
import dev.rayburn.backend.service.AbstractService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

public interface ControllerInterface<Entity extends AbstractEntity, Repository extends RepositoryInterface<Entity>, Service extends AbstractService<Entity, Repository>> {

    Service getService();

    @GetMapping("{id}")
    default Entity findById(@PathVariable Long id) {
        Log.log.info("Received request to find entity with id {}", id);
        return getService().findById(id);
    }

    @GetMapping()
    default Iterable<Entity> findAll() {
        Log.log.info("Received request to find all entities");
        return getService().findAll();
    }

    @PatchMapping()
    @Transactional
    default Entity update(@RequestBody Entity body) {
        Log.log.info("Received request to update entity with id {}", body.getId());
        return getService().update(body);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    default Entity create(@RequestBody Entity body) {
        Log.log.info("Received request to create entity");
        return getService().save(body);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    default void delete(@PathVariable Long id) {
        Log.log.info("Received request to delete entity with id {}", id);
        getService().delete(id);
    }

    @Log4j2
    final class Log {
    }

}
