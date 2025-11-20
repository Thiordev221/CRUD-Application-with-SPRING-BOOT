package com.thiordev.demo.Etudiants;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EtudiantService {
    private final EtudiantRepository etudiantRepository;

    public EtudiantService(EtudiantRepository etudiantRepository) {
        this.etudiantRepository = etudiantRepository;
    }

    public List<Etudiant> findAllEtudiants() {
        return etudiantRepository.findAll();
    }

    public Optional<Etudiant> findEtudiantById(Long id) {
        return etudiantRepository.findById(id);
    }

    public void deleteEtudiantById(Long id) {
        etudiantRepository.deleteById(id);
    }

    public Etudiant createEtudiant(Etudiant etudiant) {
        return etudiantRepository.save(etudiant);
    }

    public Etudiant updateEtudiant(Long id, Etudiant etudiant) {
        Optional<Etudiant> existing = findEtudiantById(id);
        existing.ifPresent(e-> e.setNom(etudiant.getNom()));
        existing.ifPresent(e-> e.setPrenom(etudiant.getPrenom()));
        return etudiantRepository.save(existing.orElse(etudiant));
    }

}
