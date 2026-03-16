package com.example.BloodDonationSupportSystem.dto.reportDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BloodDonationReportDTO {
    private String donorName;
    private String donorPhoneNumber;
    private String donorEmail;
    private String donorAddress;
    private String bloodType;
    private int sendVolume;
    private Date donationDate;
    private String hospital;
    private String status;
}
