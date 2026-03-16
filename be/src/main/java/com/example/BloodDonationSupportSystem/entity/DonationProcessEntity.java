package com.example.BloodDonationSupportSystem.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "donation_process")
public class DonationProcessEntity {
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "donation_process_id", columnDefinition = "uniqueidentifier")
    private UUID donationProcessId;

    @Column(name = "blood_test")
    private String bloodTest;

    @Column(name = "volume_ml")
    private int volumeMl;

    @Column(name = "status")
    private String status;



    @OneToOne
    @JoinColumn(name = "donation_registration_id")
    private DonationRegistrationEntity donationRegistrationProcess;

    @ManyToOne
    @JoinColumn(name = "blood_type_id")
    private BloodInventory bloodInventory;

}
