package com.example.BloodDonationSupportSystem.dto.authenaccountDTO.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
public class UploadAvatarRequest {

    @NotNull(message = "File cannot be null")
    private MultipartFile file;
}
