package com.example.BloodDonationSupportSystem.dto.reportDTO;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportFilterRequestByDate {
    @NotNull(message = "Start Date can not null")
    private LocalDate  startDate;
    @NotNull(message = "Start Date can not null")
    private LocalDate endDate;
}
