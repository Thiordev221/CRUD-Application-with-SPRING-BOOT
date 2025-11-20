package com.thiordev.demo.Etudiants;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etudiants")
public class EtudiantControler {
    private final EtudiantService etudiantService;

    public EtudiantControler(EtudiantService etudiantService) {
        this.etudiantService = etudiantService;
    }

    //fonction pour avoir tous les etudiants
    @GetMapping
    public List<Etudiant> getAll() {
        return etudiantService.findAllEtudiants();
    }

    //fonction pour avoir un etudiant par son id
    @GetMapping("/{id}")
    public Optional<Etudiant> getEtudiantById(@PathVariable Long id) {
        return etudiantService.findEtudiantById(id);
    }

    @PostMapping
    public void createEtudiant(@RequestBody Etudiant etudiant) {
        etudiantService.createEtudiant(etudiant);
    }

    @PutMapping("/{id}")
    public Etudiant update( @PathVariable Long id, @RequestBody Etudiant etudiant) {
        return etudiantService.updateEtudiant(id, etudiant);
    }

    @DeleteMapping("/{id}")
    public void deleteEtudiant(@PathVariable Long id) {
        etudiantService.deleteEtudiantById(id);
    }
}
