package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.UserProfileDTO;
import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.request.UploadAvatarRequest;
import com.example.BloodDonationSupportSystem.service.filestorageservice.FileStorageService;
import com.example.BloodDonationSupportSystem.service.userservice.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@Tag(name = "User Controller")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/profile")
    public BaseReponse<UserProfileDTO> profile() {
        UserProfileDTO currentUser = userService.getCurrentUserProfile();
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Get current user successful",
                currentUser);
    }
    @PutMapping("/profile")
    public BaseReponse<UserProfileDTO> updateProfile(@RequestBody UserProfileDTO request) {
        UserProfileDTO currentUser = userService.updateUserProfile(request);
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Update user profile successful",
                currentUser);
    }

    @PutMapping("/profile/upload-avatar")
    public BaseReponse<UserProfileDTO> uploadAvatar(@ModelAttribute UploadAvatarRequest file) throws IOException {
        UserProfileDTO updatedUser = fileStorageService.uploadAvatar(file.getFile());

        return new BaseReponse<>(
                HttpStatus.OK.value(),
                "Upload avatar successful",
                updatedUser
        );
    }
}
