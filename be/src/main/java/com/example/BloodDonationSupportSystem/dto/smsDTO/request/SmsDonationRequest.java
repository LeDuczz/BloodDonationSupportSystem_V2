package com.example.BloodDonationSupportSystem.dto.smsDTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SmsDonationRequest {
    @NotBlank(message = "Blood type must be not null")
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Blood type not suitable")
    private String bloodType;
    @NotBlank(message = "Contact must be not null")
    private String contact;
}
