package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.UserProfileDTO;
import com.example.BloodDonationSupportSystem.service.adminservice.AdminService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Controller")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public BaseReponse<List<UserProfileDTO>> getAllUsers() {
        List<UserProfileDTO> users = adminService.getAllUsers();
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Get all users successful",
                users);
    }

    @PutMapping("/users/{id}")
    public BaseReponse<UserProfileDTO> updateStatusUser(@PathVariable("id") UUID userID, @RequestBody UserProfileDTO request) {
        UserProfileDTO user = adminService.updateUser(userID, request);
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Update status user successful",
                user);
    }

}
