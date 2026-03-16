package com.example.BloodDonationSupportSystem.dto.articleDTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArticleRequest {

    @NotBlank(message = "Title cannot blank")
    private String title;

    private String content;

    @NotNull(message = "Status cannot null")
    private String status;

    private String imageData;

    private String fileName;

    @NotNull(message = "Must be have article type")
    private String articleType;

    @NotNull(message = "Must be have created by admin id")
    private UUID createdByAdminId;
}
