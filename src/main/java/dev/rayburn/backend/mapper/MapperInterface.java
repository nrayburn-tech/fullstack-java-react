package dev.rayburn.backend.mapper;

public interface MapperInterface<T> {
    void update(T incoming, T existing);
}
