package dev.rayburn.backend.service;

import dev.rayburn.backend.entity.*;
import dev.rayburn.backend.mapper.AddressMapper;
import dev.rayburn.backend.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressService extends AbstractService<Address, AddressRepository, AddressMapper> {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    @Autowired
    AddressService(AddressRepository addressRepository, AddressMapper addressMapper){
        this.addressRepository = addressRepository;
        this.addressMapper = addressMapper;
    }

    @Override
    public AddressRepository getRepository() {
        return addressRepository;
    }

    @Override
    public AddressMapper getMapper() {
        return addressMapper;
    }

}
