package com.sasken.skillsync;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class PasswordEncoderTest {

    @Test
    public void testPasswordEncoding() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Test admin password
        String rawPassword = "admin123";
        String encodedPassword = "$2a$10$.MzKaxWfTS2FNTnz8GmXOOwZt5qIduopR.F9k72ehHcWRUBldaFt2";
        
        boolean matches = encoder.matches(rawPassword, encodedPassword);
        System.out.println("Admin password matches: " + matches);
        
        // Generate a new encoded password for comparison
        String newEncodedPassword = encoder.encode(rawPassword);
        System.out.println("New encoded password: " + newEncodedPassword);
        System.out.println("New password matches raw: " + encoder.matches(rawPassword, newEncodedPassword));
        
        assertTrue(matches, "The password should match the encoded value");
    }
}