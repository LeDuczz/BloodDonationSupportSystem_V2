package com.example.BloodDonationSupportSystem.service.filestorageservice;

import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.UserProfileDTO;
import com.example.BloodDonationSupportSystem.entity.UserEntity;
import com.example.BloodDonationSupportSystem.exception.ResourceNotFoundException;
import com.example.BloodDonationSupportSystem.repository.UserRepository;
import com.example.BloodDonationSupportSystem.utils.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "images/uploads/";

    public String saveFile(UUID userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String fileName = userId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, fileName);

        Files.write(filePath, file.getBytes());

        return fileName;
    }

    public UserProfileDTO uploadAvatar(MultipartFile file) throws IOException {
        UserDetails currentUser = AuthUtils.getCurrentUser();
        UUID userId;

        try {
            userId = UUID.fromString(currentUser.getUsername());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for user ID: " + currentUser.getUsername());
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String fileName = saveFile(userId, file);

        user.setAvatarPath(fileName);
        return getUserProfileDTO(userRepository.save(user));
    }

    public Resource loadFile(String filename) throws MalformedURLException {
        Path path = Paths.get(UPLOAD_DIR).resolve(filename);
        Resource resource = new UrlResource(path.toUri());
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new ResourceNotFoundException("Không tìm thấy file: " + filename);
        }
    }

    private UserProfileDTO getUserProfileDTO(UserEntity userEntity) {
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setId(userEntity.getUserId());
        userProfileDTO.setFullName(userEntity.getFullName());
        userProfileDTO.setPhoneNumber(userEntity.getPhoneNumber());
        userProfileDTO.setGender(userEntity.getGender());
        userProfileDTO.setDayOfBirth(userEntity.getDateOfBirth());
        userProfileDTO.setAddress(userEntity.getAddress());
        userProfileDTO.setBloodType(userEntity.getBloodType());
        userProfileDTO.setLongitude(userEntity.getLongitude());
        userProfileDTO.setLatitude(userEntity.getLatitude());
        userProfileDTO.setRole(userEntity.getRole().getRoleName());
        if (userEntity.getOauthAccount() != null) {
            userProfileDTO.setEmail(userEntity.getOauthAccount().getAccount());
        } else {
            userProfileDTO.setEmail(null);
        }
        if (userEntity.getAvatarPath() != null) {
            userProfileDTO.setAvatarUrl(userEntity.getAvatarPath());
        } else {
            userProfileDTO.setAvatarUrl(null);
        }
        return userProfileDTO;
    }
}
