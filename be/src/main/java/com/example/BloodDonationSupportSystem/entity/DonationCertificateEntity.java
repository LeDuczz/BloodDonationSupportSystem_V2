package com.example.BloodDonationSupportSystem.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "certificate")
public class DonationCertificateEntity {
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "certificate_id", columnDefinition = "uniqueidentifier")
    private UUID certificateId;

    @Column(name = "title")
    private String title;

    @Column(name = "issued_at")
    private LocalDate issuedAt;

    @Column(name = "type_certificate")
    private String typeCertificate;

    @OneToOne
    @JoinColumn(name = "donation_registration_id", unique = true, nullable = false)
    private DonationRegistrationEntity donationRegistrationCertificate;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private UserEntity donorCertificate;

}
