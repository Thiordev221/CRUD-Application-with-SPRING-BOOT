package com.thiordev.demo.Formation;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "formation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(length = 1000)
    private String description;


    @Column(nullable = false)
    private String formateur;
}
