package com.example.BloodDonationSupportSystem.dto.donationprocessDTO.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProcessTestRequest {
    @NotBlank(message = "Blood Test cannot be blank")
    private String bloodTest;

    @NotBlank(message = "Blood type id cannot be blank")
    private String bloodTypeId;
}
