package com.example.BloodDonationSupportSystem.dto.emergencybloodrequestDTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyBloodEntityResponse {
    private UUID emergencyBloodRequestId;
    private String patientName;
    private String phoneNumber;
    private String locationOfPatient;
    private String bloodType;
    private int volumeMl;
    private String levelOfUrgency;
    private String note;
    private boolean isFulfill;
    private LocalDate LocalDate;
    private UUID registered_by_staff;
}
