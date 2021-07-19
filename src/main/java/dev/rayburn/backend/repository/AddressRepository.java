package dev.rayburn.backend.repository;

import dev.rayburn.backend.entity.Address;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends RepositoryInterface<Address> {
    List<Address> findAllByUserId(Long userId);
}
