package com.example.BloodDonationSupportSystem.dto.authenaccountDTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDTO {
    private UUID id;
    private String fullName;
    private LocalDate dayOfBirth;
    private String gender;
    private String address;
    private String phoneNumber;
    private Double longitude;
    private Double latitude;
    private String bloodType;
    private String role;
    private String status;
    private String email;
    private String avatarUrl;
}
