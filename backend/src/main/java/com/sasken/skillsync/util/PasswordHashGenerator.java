package com.sasken.skillsync.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        System.out.println("admin123: " + encoder.encode("admin123"));
        System.out.println("manager123: " + encoder.encode("manager123"));
        System.out.println("trainer123: " + encoder.encode("trainer123"));
        System.out.println("employee123: " + encoder.encode("employee123"));
    }
}