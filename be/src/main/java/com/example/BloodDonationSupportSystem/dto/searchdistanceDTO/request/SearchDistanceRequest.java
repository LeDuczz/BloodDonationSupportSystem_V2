package com.example.BloodDonationSupportSystem.dto.searchdistanceDTO.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchDistanceRequest {
    @Min(value = 1, message = "Distance must be at least 1")
    @Max(value = 50, message = "Distance must be less than or equal to 50")
    private double distance;

    @Size(min =1,max =8,message = "Blood type list must have at least 1 and at most 8 blood types")
    @NotEmpty(message = "Need at least 1 blood type!")
    private List<String> bloodTypes;
}
