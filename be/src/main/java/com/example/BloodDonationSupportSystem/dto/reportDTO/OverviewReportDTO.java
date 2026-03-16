package com.example.BloodDonationSupportSystem.dto.reportDTO;

import lombok.Data;

@Data
public class OverviewReportDTO {
    private long numberAccount;
    private long numberBloodDonationsRegistration;
    private long numberSuccessDonation;
    private long numberFailureDonation;
    private long numberNotCompleteDonation;
    private long numberNotAcceptedDonation;

}
