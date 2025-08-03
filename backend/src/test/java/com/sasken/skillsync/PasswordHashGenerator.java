package com.sasken.skillsync;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate hashes for all user passwords
        String adminPassword = "admin123";
        String managerPassword = "manager123";
        String trainerPassword = "trainer123";
        String employeePassword = "employee123";
        
        System.out.println("Admin password hash: " + encoder.encode(adminPassword));
        System.out.println("Manager password hash: " + encoder.encode(managerPassword));
        System.out.println("Trainer password hash: " + encoder.encode(trainerPassword));
        System.out.println("Employee password hash: " + encoder.encode(employeePassword));
    }
}