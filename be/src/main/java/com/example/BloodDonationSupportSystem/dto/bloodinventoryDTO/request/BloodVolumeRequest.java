package com.example.BloodDonationSupportSystem.dto.bloodinventoryDTO.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodVolumeRequest {
    @NotNull(message = "Donation registration ID cannot be blank")
    private UUID donationRegisId;
    @NotNull(message = "Donation process ID cannot be blank")
    private UUID processId;
    @NotNull
    private int volumeMl;

}
