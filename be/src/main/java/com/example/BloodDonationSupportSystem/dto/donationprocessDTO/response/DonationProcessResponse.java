package com.example.BloodDonationSupportSystem.dto.donationprocessDTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DonationProcessResponse {
    private UUID processId;
    private String bloodTest;
    private int volumeMl;
    private String status;
    private String bloodTypeId;

    private UUID donationRegisId;
}
