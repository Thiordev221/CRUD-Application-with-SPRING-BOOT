package com.thiordev.demo;


import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.time.LocalDate;

@Component
public class DatabaseTest implements CommandLineRunner {

    private final DataSource dataSource;

    public DatabaseTest(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("✅ Connexion réussie à la base : " + dataSource.getConnection().getCatalog());

        LocalDate date = LocalDate.now();
    }
}

