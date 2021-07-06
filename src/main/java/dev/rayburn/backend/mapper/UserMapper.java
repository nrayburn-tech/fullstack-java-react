package dev.rayburn.backend.mapper;

import dev.rayburn.backend.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper extends MapperInterface<User> {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(User incoming, @MappingTarget User existing);
}
