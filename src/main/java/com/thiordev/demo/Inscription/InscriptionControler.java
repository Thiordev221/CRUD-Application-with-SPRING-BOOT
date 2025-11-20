package com.thiordev.demo.Inscription;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionControler {
    private final InscriptionService inscriptionService;

    @Autowired
    public InscriptionControler(InscriptionService inscriptionService) {
        this.inscriptionService = inscriptionService;
    }

    @GetMapping
    public List<Inscription> findAllInscriptions() {
        return this.inscriptionService.findAllInscriptions();
    }

    @GetMapping("/{id}")
    public Optional<Inscription> findInscriptionById(@PathVariable Long id) {
        return inscriptionService.findInscriptionById(id);
    }

    @PostMapping
    public void createInscription(@RequestBody Inscription inscription) {
        this.inscriptionService.createInscription(inscription);
    }

    @PutMapping("/{id}")
    public Inscription updateInscription(@PathVariable Long id, @RequestBody Inscription inscription) {
        return inscriptionService.updateInscription(id, inscription.getStatut());
    }


    @DeleteMapping("/{id}")
    public void deleteInscription(@PathVariable Long id) {
        inscriptionService.deleteInscriptionById(id);
    }

}
