package com.example.BloodDonationSupportSystem.dto.reportDTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyBloodRequestReportDTO {
    private Date registrationDate;
    private String patientName;
    private String patientPhone;
    private String locationOfPatient;
    private String bloodType;
    private Integer requestedVolume;
    private String note;
    private String donorName;
    private String donorPhone;
    private String donorEmail;
    private int donatedVolume;
    private String status;
}
