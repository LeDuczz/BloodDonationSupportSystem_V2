package com.example.BloodDonationSupportSystem.dto.emergencybloodrequestDTO.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class EmergencyBloodRequestDTO {

    private UUID emergencyBloodRequestId;

    @NotNull(message = " can not null")
    private String patientName;

    @NotNull(message = "Patient Relatives can not null")
    private String patientRelatives;

    @NotNull(message = "Phone Number can not null")
    private String phoneNumber;

    @NotNull(message = "Location Of Patient can not null")
    private String locationOfPatient;

    @NotNull(message = "Blood Type can not null")
    private String bloodType;

    @NotNull(message = "VolumeMl can not null")
    private Integer volumeMl;

    @NotNull(message = "Level Of Urgency can not null")
    private String levelOfUrgency;

    @NotNull(message = "Note can not null")
    private String note;

    private LocalDate registrationDate;

    private boolean isFulfill;

    @NotNull(message = "Registered By Staff can not null")
    private UUID registeredByStaff;

    private String staffName;

}
