package com.thiordev.demo.Formation;

import com.thiordev.demo.Etudiants.Etudiant;
import com.thiordev.demo.Etudiants.EtudiantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/formations")
public class FormationControler {
    private final FormationService formationService;

    public FormationControler(FormationService formationService) {
        this.formationService = formationService;
    }

    // fonction pour avoir toutes les formations
    @GetMapping
    public List<Formation> getAll() {
        return formationService.findAllFormations();
    }

    // fonction pour avoir une formation par son id
    @GetMapping("/{id}")
    public Optional<Formation> getFormationById(@PathVariable Long id) {
        return formationService.findFormationById(id);
    }

    @PostMapping
    public void createFormation(@RequestBody Formation formation) {
        formationService.createFormation(formation);
    }

    @PutMapping("/{id}")
    public Formation update(@PathVariable Long id, @RequestBody Formation formation) {
        return formationService.updateFormation(id, formation);
    }

    @DeleteMapping("/{id}")
    public void deleteFormation(@PathVariable Long id) {
        formationService.deleteFormationById(id);
    }
}
