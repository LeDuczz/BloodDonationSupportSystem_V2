package com.example.BloodDonationSupportSystem.dto.certificateDTO;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CertificateDTO {
    private UUID certificateId;
    private LocalDate registrationDate;
    private String hospital;
    private String typeCertificate;
    private LocalDate issuedAt;


}
