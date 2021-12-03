package dev.rayburn.backend.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

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
    @ManyToOne
    private User user;
}
