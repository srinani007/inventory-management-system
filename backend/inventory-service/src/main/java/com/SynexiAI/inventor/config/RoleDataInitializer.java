package com.SynexiAI.inventor.config;

import com.SynexiAI.inventor.model.RoleEntity;
import com.SynexiAI.inventor.repository.RoleRepository;
import com.SynexiAI.inventor.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleDataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(ApplicationArguments args) {
        for (String roleName : AuthService.VALID_ROLES) {
            if (!roleRepository.existsByName(roleName)) {
                RoleEntity role = new RoleEntity();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }
    }
}