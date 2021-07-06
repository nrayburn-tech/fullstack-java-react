package dev.rayburn.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityManager;

@RestController
public class IdController {
    private final EntityManager entityManager;
    private boolean hasIdSequence = false;

    @Autowired
    public IdController(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    //TODO: Does JPA/Hibernate have a way to do this that isn't implementation specific?
    @GetMapping("/api/id")
    @Transactional
    public ObjectNode getNextId(){
        String idSequence = "hibernate_sequence";
        if (!hasIdSequence){
            entityManager.createNativeQuery("CREATE SEQUENCE IF NOT EXISTS " + idSequence).executeUpdate();
            hasIdSequence = true;
        }
        //TODO: Could this query get multiple ids and be batched, so that
        // for example only every 10 id request have to hit the database.
        long id = Long.parseLong(entityManager
                .createNativeQuery("select nextval('" + idSequence + "')")
                .getSingleResult().toString());

        return JsonNodeFactory.instance.objectNode().put("id", id);
    }
}
