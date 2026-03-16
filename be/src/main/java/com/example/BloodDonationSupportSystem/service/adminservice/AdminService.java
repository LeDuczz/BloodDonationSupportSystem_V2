package com.example.BloodDonationSupportSystem.service.adminservice;

import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.UserProfileDTO;
import com.example.BloodDonationSupportSystem.entity.RoleEntity;
import com.example.BloodDonationSupportSystem.entity.UserEntity;
import com.example.BloodDonationSupportSystem.exception.BadRequestException;
import com.example.BloodDonationSupportSystem.exception.ResourceNotFoundException;
import com.example.BloodDonationSupportSystem.repository.RoleRepository;
import com.example.BloodDonationSupportSystem.repository.UserRepository;
import com.example.BloodDonationSupportSystem.utils.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminService {

    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public List<UserProfileDTO> getAllUsers() {
        UserDetails currentUser = AuthUtils.getCurrentUser();
        UUID currentUserId;

        try {
            currentUserId = UUID.fromString(currentUser.getUsername());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for current user ID: " + currentUser.getUsername());
        }

        UserEntity currentUserEntity = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        if (currentUserEntity.getRole() == null ||
                !currentUserEntity.getRole().getRoleName().equalsIgnoreCase(ROLE_ADMIN)) {
            throw new BadRequestException("Only ADMIN can view all users");
        }

        List<UserProfileDTO> users = userRepository.findAllUserProfiles();

        if (users.isEmpty()) {
            return Collections.emptyList();
        }

        return users;
    }

    public UserProfileDTO updateUser(UUID userID, UserProfileDTO request) {
        UserDetails currentUser = AuthUtils.getCurrentUser();
        UUID currentUserId;

        try {
            currentUserId = UUID.fromString(currentUser.getUsername());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for current user ID: " + currentUser.getUsername());
        }

        UserEntity currentUserEntity = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        if (currentUserEntity.getRole() == null ||
                !currentUserEntity.getRole().getRoleName().equalsIgnoreCase(ROLE_ADMIN)) {
            throw new BadRequestException("Only ADMIN can update user status or role");
        }

        if(request.getRole().equalsIgnoreCase(ROLE_ADMIN)) {
            throw new BadRequestException("Cannot assign ROLE_ADMIN to a user");
        }

        Optional<UserEntity> optionalUser = userRepository.findByUserId(userID);

        if (optionalUser.isEmpty()) {
            throw new ResourceNotFoundException("User not found with ID:" + userID);
        }

        UserEntity user = optionalUser.get();
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        if (request.getRole() != null) {
            String newRoleName = request.getRole().toUpperCase();

            if (!newRoleName.equals("ROLE_MEMBER") && !newRoleName.equals("ROLE_STAFF")) {
                throw new BadRequestException("Can only assign ROLE_MEMBER or ROLE_STAFF");
            }

            RoleEntity role = roleRepository.findByRoleName(request.getRole())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

            user.setRole(role);
        }

        return convertToResponse(userRepository.save(user));
    }

    private UserProfileDTO convertToResponse(UserEntity user) {
        return UserProfileDTO.builder()
                .id(user.getUserId())
                .fullName(user.getFullName())
                .dayOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .bloodType(user.getBloodType())
                .status(user.getStatus())
                .role(user.getRole().getRoleName())
                .build();
    }
}
