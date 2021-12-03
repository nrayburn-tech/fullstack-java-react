package dev.rayburn.backend.controller;

import dev.rayburn.backend.entity.Address;
import dev.rayburn.backend.repository.AddressRepository;
import dev.rayburn.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/address")
@RestController
public class AddressController implements ControllerInterface<Address, AddressRepository, AddressService> {

    private final AddressService addressService;

    @Autowired
    AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @Override
    public AddressService getService() {
        return addressService;
    }
}
