package com.thiordev.demo.Inscription;

public enum Statut {
    EN_COURS("en cours"), TERMINE("terminé"), ANNULE("annulé");

    private final String label;
    Statut(String s) {
        this.label = s;
    }

    @Override
    public String toString() {
        return this.label;
    }
}
