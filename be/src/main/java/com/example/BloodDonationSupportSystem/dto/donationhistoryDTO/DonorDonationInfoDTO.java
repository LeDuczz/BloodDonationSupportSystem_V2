package com.example.BloodDonationSupportSystem.dto.donationhistoryDTO;

import lombok.Data;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class DonorDonationInfoDTO {
    private UUID donationRegistrationId;
    private String status;
    private String addressHospital;
    private LocalTime startTime;
    private LocalTime endTime;
    private int volumeMl;
    private LocalDate donationDate;
    private LocalDate dateCompleteDonation;
    private LocalDate registrationDate;
    private UUID bloodDonationScheduleId;
    private LocalDate startDate;
    private LocalDate endDate;
    private UUID emergencyBloodRequestId;
    private LocalDate assignedDate;

    public DonorDonationInfoDTO(UUID donationRegistrationId,
                                String status,
                                String addressHospital,
                                LocalTime startTime,
                                LocalTime endTime,
                                int volumeMl,
                                LocalDate donationDate,
                                LocalDate dateCompleteDonation,
                                LocalDate registrationDate,
                                UUID bloodDonationScheduleId,
                                LocalDate startDate,
                                LocalDate endDate,
                                UUID emergencyBloodRequestId,
                                LocalDate assignedDate
    ) {
        this.donationRegistrationId = donationRegistrationId;
        this.status = status;
        this.addressHospital = addressHospital;
        this.startTime = startTime;
        this.endTime = endTime;
        this.volumeMl = volumeMl;
        this.donationDate = donationDate;
        this.dateCompleteDonation = dateCompleteDonation;
        this.registrationDate = registrationDate;
        this.bloodDonationScheduleId = bloodDonationScheduleId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.emergencyBloodRequestId = emergencyBloodRequestId;
        this.assignedDate = assignedDate;
    }

}
