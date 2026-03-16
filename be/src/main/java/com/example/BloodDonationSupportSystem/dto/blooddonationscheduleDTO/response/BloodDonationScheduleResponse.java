package com.example.BloodDonationSupportSystem.dto.blooddonationscheduleDTO.response;

import lombok.Data;

import java.sql.Time;
import java.util.Date;
import java.util.UUID;

@Data
public class BloodDonationScheduleResponse {

    private UUID bloodDonationScheduleId;

    private String addressHospital;

    private Date donationDate;

    private Time startTime;

    private Time endTime;

    private int amountRegistration;

    private UUID editedByStaffId;

}
