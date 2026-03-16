package com.example.BloodDonationSupportSystem.dto.donationhistoryDTO;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class StaffDonationInfoDTO {
    private UUID donationRegistrationId;
    private String status;

    private String fullName;
    private String phoneNumber;
    private String email;
    private UUID donorId;
    private String addressHospital;
    private LocalTime scheduleStartTime;
    private LocalTime scheduleEndTime;
    private Integer volumeMl;
    private LocalDate donationDate;
    private LocalDate registrationDate;

    private LocalDate emergencyAssignedDate;

    private String donationType;

    public StaffDonationInfoDTO(
            UUID donationRegistrationId,
            String status,
            String fullName,
            String phoneNumber,
            String email,
            UUID donorId,
            String addressHospital,
            LocalTime scheduleStartTime,
            LocalTime scheduleEndTime,
            Integer volumeMl,
            LocalDate donationDate,
            LocalDate registrationDate,
            LocalDate emergencyAssignedDate
    ) {
        this.donationRegistrationId = donationRegistrationId;
        this.status = status;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.donorId = donorId;
        this.addressHospital = addressHospital;
        this.scheduleStartTime = scheduleStartTime;
        this.scheduleEndTime = scheduleEndTime;
        this.volumeMl = volumeMl;
        this.donationDate = donationDate;
        this.registrationDate = registrationDate;
        this.emergencyAssignedDate = emergencyAssignedDate;
        this.donationType = (emergencyAssignedDate != null) ? "KHẨN CẤP" : "BÌNH THƯỜNG";
    }

}
