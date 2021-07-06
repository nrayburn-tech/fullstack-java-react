package dev.rayburn.backend.entity;

import lombok.*;

import javax.persistence.Entity;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Address extends AbstractEntity {
    private String lineOne;
    private String lineTwo;
    private String lineThree;
    private String lineFour;
    private String city;
    private String zip;
    private String state;
}
