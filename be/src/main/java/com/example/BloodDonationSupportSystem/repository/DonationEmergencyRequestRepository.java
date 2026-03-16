package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.entity.EmergencyBloodRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface DonationEmergencyRequestRepository extends JpaRepository<EmergencyBloodRequestEntity, UUID> {

    @Query(value = """
    SELECT ebr.*
    FROM emergency_blood_request ebr
    JOIN donation_emergency de 
      ON ebr.emergency_blood_request_id = de.emergency_blood_request_id
    WHERE de.donation_registration_id = :donationRegistrationId
""", nativeQuery = true)
    Optional<EmergencyBloodRequestEntity> findEmergencyBloodRequestEntityByDonationRegistrationId(@Param("donationRegistrationId") UUID id);

}
