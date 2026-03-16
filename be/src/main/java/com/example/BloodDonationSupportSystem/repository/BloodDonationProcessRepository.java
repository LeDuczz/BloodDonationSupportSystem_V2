package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.entity.DonationProcessEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BloodDonationProcessRepository extends JpaRepository<DonationProcessEntity, UUID> {

    @Query(value = """
    SELECT * FROM donation_process
    WHERE blood_test = N'CHƯA KIỂM TRA'
      AND status = N'ĐÃ HIẾN'
    """, nativeQuery = true)
    List<DonationProcessEntity> getUncheckedDonatedProcessesList();

}
