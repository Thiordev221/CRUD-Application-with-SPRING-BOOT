package com.thiordev.demo.Formation;

import com.thiordev.demo.Etudiants.Etudiant;
import com.thiordev.demo.Etudiants.EtudiantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FormationService {
    private final FormationRepository formationRepository;

    public FormationService(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    public List<Formation> findAllFormations() {
        return formationRepository.findAll();
    }

    public Optional<Formation> findFormationById(Long id) {
        return formationRepository.findById(id);
    }

    public void deleteFormationById(Long id) {
        formationRepository.deleteById(id);
    }

    public void createFormation(Formation formation) {
        formationRepository.save(formation);
    }

    public Formation updateFormation(Long id, Formation formation) {
        Optional<Formation> existing = findFormationById(id);
        existing.ifPresent(e-> e.setTitre(formation.getTitre()));
        existing.ifPresent(e-> e.setDescription(formation.getDescription()));
        return formationRepository.save(existing.orElse(formation));
    }
}
