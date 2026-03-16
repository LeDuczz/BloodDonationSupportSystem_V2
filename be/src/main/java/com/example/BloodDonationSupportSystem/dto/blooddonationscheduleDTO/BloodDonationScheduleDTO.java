package com.example.BloodDonationSupportSystem.dto.blooddonationscheduleDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class BloodDonationScheduleDTO {

    private UUID bloodDonationScheduleId;

    @NotNull(message = "Address hospital can not null")
    private String addressHospital;

    @NotNull(message = "Donation Date can not null")
    private LocalDate donationDate;

    @NotNull(message = "Start Time can not null")
    private LocalTime startTime;

    @NotNull(message = "End Time can not null")
    private LocalTime endTime;

    @NotNull(message = "Amount of Registration can not null")
    private int amountRegistration;

    private int registrationMatching;

    private UUID editedByStaffId;




}
