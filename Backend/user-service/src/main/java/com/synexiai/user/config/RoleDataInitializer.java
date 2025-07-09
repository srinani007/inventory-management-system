package com.synexiai.user.config;

import com.synexiai.user.model.RoleEntity;
import com.synexiai.user.repository.RoleRepository;
import com.synexiai.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleDataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;

    public RoleDataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

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
