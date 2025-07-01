package com.SynexiAI.inventor.config;

import com.SynexiAI.inventor.model.Role;
import com.SynexiAI.inventor.model.RoleEntity;
import com.SynexiAI.inventor.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RoleDataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;


    public RoleDataLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        // Initialize default roles if they don't exist
        List<String> defaultRoles = List.of("ROLE_ADMIN", "ROLE_MANAGER", "ROLE_WAREHOUSE_STAFF");

        defaultRoles.forEach(roleName -> {
            if (!roleRepository.existsByName(roleName)) {
                RoleEntity role = new RoleEntity();
                role.setName(roleName);
                roleRepository.save(role);
            }
        });
    }
}