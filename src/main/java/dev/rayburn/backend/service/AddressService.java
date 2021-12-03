package dev.rayburn.backend.service;

import dev.rayburn.backend.entity.Address;
import dev.rayburn.backend.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressService extends AbstractService<Address, AddressRepository> {

    private final AddressRepository addressRepository;

    @Autowired
    AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    public AddressRepository getRepository() {
        return addressRepository;
    }

}
