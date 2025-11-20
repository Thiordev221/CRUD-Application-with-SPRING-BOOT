package com.thiordev.demo.Inscription;

import com.thiordev.demo.Etudiants.Etudiant;
import com.thiordev.demo.Formation.Formation;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "inscription")
@Getter
@Setter
@NoArgsConstructor
@Builder
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Integer prix;


    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    private Formation formation;

    @Column(name = "date_inscription")
    private LocalDate date_inscription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Statut statut = Statut.EN_COURS;

    @PrePersist
    protected void onCreate() {
        if (this.date_inscription == null) {
            this.date_inscription = LocalDate.now();
        }
    }

    public Inscription(Long id, Integer prix, Etudiant etudiant, Formation formation, LocalDate dateInscription, Statut statut) {
        this.id = id;
        this.prix = prix;
        this.etudiant = etudiant;
        this.formation = formation;
        this.date_inscription = dateInscription != null ? dateInscription : LocalDate.now();
        this.statut = statut;
    }

}

