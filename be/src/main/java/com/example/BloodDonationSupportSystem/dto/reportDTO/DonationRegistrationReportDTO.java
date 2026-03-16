package com.example.BloodDonationSupportSystem.dto.reportDTO;

import lombok.Data;

import java.util.Date;

@Data
public class DonationRegistrationReportDTO {
    private String fullName;
    private String phoneNumber;
    private String bloodType;
    private Date registrationDate;
    private Date dateCompleteDonation;
    private String status;
    private String address;
    private String staffName;
    private String hospitalAddress;

}
