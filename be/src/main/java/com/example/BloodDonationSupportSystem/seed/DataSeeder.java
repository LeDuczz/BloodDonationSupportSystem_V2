package com.example.BloodDonationSupportSystem.seed;

import com.example.BloodDonationSupportSystem.entity.BloodInventory;
import com.example.BloodDonationSupportSystem.entity.RoleEntity;
import com.example.BloodDonationSupportSystem.entity.UserEntity;
import com.example.BloodDonationSupportSystem.repository.BloodInventoryRepository;
import com.example.BloodDonationSupportSystem.repository.RoleRepository;
import com.example.BloodDonationSupportSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private BloodInventoryRepository bloodInventoryRepository;

    @Override
    public void run(String... args) throws Exception {
        List<String> defaultRoles = List.of("ROLE_GUEST", "ROLE_MEMBER", "ROLE_STAFF", "ROLE_ADMIN");
        defaultRoles.forEach(role -> {
            if (roleRepository.findByRoleName(role).isEmpty()) {
                RoleEntity roleEntity = new RoleEntity();
                roleEntity.setRoleName(role);
                roleRepository.save(roleEntity);
            }
        });

        String adminPhone = "0123456789";
        if (userRepository.findByPhoneNumber(adminPhone).isEmpty()) {
            RoleEntity adminRole = roleRepository.findByRoleName("ROLE_ADMIN").orElseThrow();
            UserEntity admin = new UserEntity();
            admin.setFullName("Administrator");
            admin.setPhoneNumber(adminPhone);
            admin.setAddress("123 Admin Street");
            admin.setGender("NAM");
            admin.setStatus("HOẠT ĐỘNG");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);

            userRepository.save(admin);
        }
        String[] bloodTypes = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        for (String type : bloodTypes) {
            if (!bloodInventoryRepository.existsById(type)) {
                BloodInventory inventory = new BloodInventory();
                inventory.setBloodTypeId(type);
                inventory.setTotalVolumeMl(0);
                bloodInventoryRepository.save(inventory);
            }
        }

    }
}
