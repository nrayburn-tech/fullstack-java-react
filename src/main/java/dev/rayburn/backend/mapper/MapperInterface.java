package dev.rayburn.backend.mapper;

import dev.rayburn.backend.entity.AbstractEntity;

public interface MapperInterface<Entity extends AbstractEntity> {
    void update(Entity incoming, Entity existing);
}
