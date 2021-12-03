package dev.rayburn.backend.service;

import dev.rayburn.backend.entity.AbstractEntity;
import dev.rayburn.backend.repository.RepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;

public abstract class AbstractService<Entity extends AbstractEntity, Repository extends RepositoryInterface<Entity>> implements ServiceInterface<Entity, Repository> {

    //TODO: Can this be replaced with something else,
    // so it can be tested?
    @Autowired
    protected EntityManager entityManager;
}
