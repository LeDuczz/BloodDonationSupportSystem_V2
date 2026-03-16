package com.example.BloodDonationSupportSystem.dto.reportDTO;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffEmergencyReportDTO {


    private String staffName;
    private String staffPhoneNumber;
    private String patientName;
    private String patientPhoneNumber;
    private String note;
    private String donorName;
    private String donorPhoneNumber;
    private String donorEmail;
    private Date donationDate;
    private String status;
}
