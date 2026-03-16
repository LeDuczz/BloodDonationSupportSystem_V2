package com.example.BloodDonationSupportSystem.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "donation_registration")
public class DonationRegistrationEntity {
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "donation_registration_id", columnDefinition = "uniqueidentifier")
    private UUID donationRegistrationId;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "date_complete_donation")
    private LocalDate dateCompleteDonation;

    @Column(name = "status")
    private String status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne()
    @JoinColumn(name = "donor_id")
    private UserEntity donor;

    @ManyToOne()
    @JoinColumn(name = "screened_by_staff_id")
    private UserEntity screenedByStaff;

    @ManyToOne()
    @JoinColumn(name = "blood_donation_schedule_id")
    private BloodDonationScheduleEntity bloodDonationSchedule;

    @OneToOne(mappedBy = "donationRegistrationHealthCheck")
    private HealthCheckEntity healthCheck;

    @OneToOne(mappedBy = "donationRegistrationProcess")
    private DonationProcessEntity donationProcess;

    @OneToOne(mappedBy = "donationRegistrationCertificate")
    private DonationCertificateEntity donationCertificate;

    @OneToMany(mappedBy = "donationRegistration")
    private List<EmergencyDonationEntity> donationEmergencies;

    @OneToMany(mappedBy = "donationRegistration")
    private List<DonationHistoryEntity> donationHistories;


}
