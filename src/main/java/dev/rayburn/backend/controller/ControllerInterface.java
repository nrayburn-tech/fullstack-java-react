package dev.rayburn.backend.controller;

import dev.rayburn.backend.entity.AbstractEntity;
import dev.rayburn.backend.mapper.MapperInterface;
import dev.rayburn.backend.repository.RepositoryInterface;
import dev.rayburn.backend.service.AbstractService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

public interface ControllerInterface<T extends AbstractEntity, U extends RepositoryInterface<T>, V extends AbstractService<T, U, W>, W extends MapperInterface<T>> {

    @Log4j2
    final class Log{}

    V getService();

    @GetMapping("{id}")
    default T findById(@PathVariable Long id){
        Log.log.info("Received request to find entity with id {}", id);
        return getService().findById(id);
    }

    @GetMapping()
    default Iterable<T> findAll(){
        Log.log.info("Received request to find all entities");
        return getService().findAll();
    }

    @PatchMapping()
    default T update(@RequestBody T body){
        Log.log.info("Received request to update entity with id {}", body.getId());
        return getService().update(body);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    default T create(@RequestBody T body){
        Log.log.info("Received request to create entity");
        return getService().save(body);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    default void delete(@PathVariable Long id){
        Log.log.info("Received request to delete entity with id {}", id);
        getService().delete(id);
    }

}
