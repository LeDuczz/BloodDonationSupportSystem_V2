package com.example.BloodDonationSupportSystem.dto.reportDTO;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;



@Data
public class ReportFilterRequest {
    @Min(value = 1900, message = "Year must be greater than 1900")
    private int year;
    @Min(value = 1, message = "Month must be between 1 - 12")
    @Max(value = 12, message = "Month must be between 1 - 12")

    private int month;
}
