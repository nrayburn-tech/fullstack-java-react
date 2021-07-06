package dev.rayburn.backend.mapper;

import dev.rayburn.backend.entity.Address;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AddressMapper extends MapperInterface<Address> {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(Address incoming, @MappingTarget Address existing);
}
