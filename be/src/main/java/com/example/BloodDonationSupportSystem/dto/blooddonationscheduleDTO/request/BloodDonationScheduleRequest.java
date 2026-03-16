package com.example.BloodDonationSupportSystem.dto.blooddonationscheduleDTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Time;
import java.util.Date;
import java.util.UUID;

@Data
public class BloodDonationScheduleRequest {

    @NotBlank(message = "Address can not empty")
    private String addressHospital;

    @NotNull(message = "Donation date can not null")
    private Date donationDate;

    @NotNull(message = "Start time can not null")
    private Time startTime;

    @NotNull(message = "End time date can not null")
    private Time endTime;

    @NotNull(message = "amount of registration can not null")
    private int amountRegistration;

    @NotNull(message = "staff id can not null")
    private UUID editedByStaffId;
}
