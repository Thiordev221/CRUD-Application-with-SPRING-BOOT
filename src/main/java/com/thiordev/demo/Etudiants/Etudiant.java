package com.thiordev.demo.Etudiants;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.*;


@Entity
@Table(name = "etudiant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Etudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom",nullable = false)
    private String nom;

    @Column(name = "prenom" ,nullable = false)
    private String prenom;

    @Column(name = "email", unique = true, nullable = false)
    private String email;
}
