package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.entity.EmergencyDonationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmergencyDonationRepository extends JpaRepository<EmergencyDonationEntity, UUID> {
    Optional<EmergencyDonationEntity> findByDonationRegistration_DonationRegistrationId(UUID donationRegistrationId);

}
