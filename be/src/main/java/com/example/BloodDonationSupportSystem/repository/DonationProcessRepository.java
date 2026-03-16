package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.dto.donationprocessDTO.DonationProcessDTO;
import com.example.BloodDonationSupportSystem.entity.DonationProcessEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationProcessRepository extends JpaRepository<DonationProcessEntity, UUID> {
    boolean existsByDonationRegistrationProcess_DonationRegistrationId(UUID donationRegistrationId);

    @Query(value = """
        SELECT dp.donation_process_id, us.full_name, dr.registration_date, ebr.level_of_urgency,
        	   dr.status, dp.status, hc.note, dp.volume_ml,dr.donation_registration_id, dr.screened_by_staff_id
        FROM donation_process AS dp
        LEFT JOIN donation_registration AS dr ON dr.donation_registration_id = dp.donation_registration_id
        LEFT JOIN user_table AS us ON us.user_id = dr.donor_id
        LEFT JOIN donation_emergency AS de ON de.donation_registration_id = dr.donation_registration_id
        LEFT JOIN emergency_blood_request ebr ON ebr.emergency_blood_request_id = de.emergency_blood_request_id
        LEFT JOIN health_check AS hc ON hc.donation_registration_id = dp.donation_registration_id
        WHERE dr.screened_by_staff_id = :staffId
        			AND (dp.status = N'CHỜ ĐỢI' OR dp.status = N'ĐANG XỬ LÝ')
                    AND dr.status = N'CHƯA HIẾN'
    """, nativeQuery = true)
    List<Object[]> findDonationProcessByStaffId(@Param("staffId") UUID staffId);

    @Query(value = """
    SELECT * FROM donation_process
    WHERE blood_test = N'CHƯA KIỂM TRA'
      AND status = N'ĐÃ HIẾN'
    """, nativeQuery = true)
    List<DonationProcessEntity> getUncheckedDonatedProcessesList();

}
