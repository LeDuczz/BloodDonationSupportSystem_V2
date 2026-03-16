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
public class StaffDonationReportDTO {
    private String staffName;
    private String staffPhone;
    private String donorName;
    private String donorPhone;
    private String donorEmail;
    private Date donationDate;
    private String status;
}
