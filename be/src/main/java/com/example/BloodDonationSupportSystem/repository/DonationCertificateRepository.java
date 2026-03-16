package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.entity.DonationCertificateEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationCertificateRepository extends JpaRepository<DonationCertificateEntity, UUID> {
    List<DonationCertificateEntity> findByDonorCertificate_UserId(UUID memberId);

}
