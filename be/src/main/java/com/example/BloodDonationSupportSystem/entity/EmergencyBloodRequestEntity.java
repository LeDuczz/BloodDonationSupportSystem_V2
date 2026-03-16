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
@Entity(name = "emergency_blood_request")
public class EmergencyBloodRequestEntity {
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "emergency_blood_request_id", columnDefinition = "uniqueidentifier")
    private UUID emergencyBloodRequestId;

    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @Column(name = "patient_relatives", nullable = false)
    private String patientRelatives;

    @Column(name = "phone_number", length = 10)
    private String phoneNumber;

    @Column(name = "location_of_patient", nullable = false)
    private String locationOfPatient;

    @Column(name = "blood_type", length = 3, nullable = false)
    private String bloodType;

    @Column(name = "volume_ml", nullable = false)
    private Integer volumeMl;

    @Column(name = "level_of_urgency")
    private String levelOfUrgency;

    @Column(name = "is_fulfill")
    private boolean isFulfill;

    @Column(name = "note")
    private String note;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @ManyToOne()
    @JoinColumn(name = "registered_by_staff_id")
        private UserEntity registeredByStaff;

    @OneToMany(mappedBy = "emergencyBloodRequest")
    private List<EmergencyDonationEntity> donationEmergencyRequests;



}
