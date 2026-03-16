package com.example.BloodDonationSupportSystem.dto.articleDTO.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArticleResponse {
    private UUID id;

    private String title;

    private String content;

    private String status;

    private String imageUrl;

    private String articleType;
}
