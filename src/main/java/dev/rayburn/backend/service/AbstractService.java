package dev.rayburn.backend.service;

import dev.rayburn.backend.entity.AbstractEntity;
import dev.rayburn.backend.mapper.MapperInterface;
import dev.rayburn.backend.repository.RepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;

public abstract class AbstractService<T extends AbstractEntity, U extends RepositoryInterface<T>, V extends MapperInterface<T>> implements ServiceInterface<T, U, V> {

    //TODO: Can this be replaced with something else,
    // so it can be tested?
    @Autowired
    protected EntityManager entityManager;
}
