package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.entity.DonationHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DonationHistoryRepository extends JpaRepository<DonationHistoryEntity, UUID> {
}
