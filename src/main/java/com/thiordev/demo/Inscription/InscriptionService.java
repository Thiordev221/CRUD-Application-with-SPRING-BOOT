package com.thiordev.demo.Inscription;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.OptionalLong;

@Service
public class InscriptionService {
    private final InscriptionRepository inscriptionRepository;
    public InscriptionService(InscriptionRepository inscriptionRepository) {
        this.inscriptionRepository = inscriptionRepository;
    }

    public void createInscription(Inscription inscription) {
        this.inscriptionRepository.save(inscription);
    }

    public Optional<Inscription> findInscriptionById(Long id) {
        return this.inscriptionRepository.findById(id);
    }

    public List<Inscription> findAllInscriptions() {
        return this.inscriptionRepository.findAll();
    }

    public void deleteInscriptionById(Long id) {
        this.inscriptionRepository.deleteById(id);
    }

    public Inscription updateInscription(Long id, Statut nouveauStatut) {
        return inscriptionRepository.findById(id)
                .map(ins -> {
                    ins.setStatut(nouveauStatut);
                    return inscriptionRepository.save(ins);
                })
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
    }

}
