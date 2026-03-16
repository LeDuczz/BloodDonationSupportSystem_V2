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
@Entity(name = "donation_emergency")
public class EmergencyDonationEntity {
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "donation_emergency_id", columnDefinition = "uniqueidentifier")
    private UUID donationEmergencyId;

    @Column(name = "assigned_date")
    private LocalDate assignedDate;

    @ManyToOne
    @JoinColumn(name = "emergency_blood_request_id")
    private EmergencyBloodRequestEntity emergencyBloodRequest;

    @ManyToOne
    @JoinColumn(name = "donation_registration_id")
    private DonationRegistrationEntity donationRegistration;


}
