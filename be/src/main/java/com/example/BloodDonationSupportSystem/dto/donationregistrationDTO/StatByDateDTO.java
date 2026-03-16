package com.example.BloodDonationSupportSystem.dto.donationregistrationDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class StatByDateDTO {
    private LocalDate date;
    private Long total;
}
