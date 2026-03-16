package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.entity.HealthCheckEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheckEntity, UUID> {
    @Query(value = """
        SELECT hc.health_check_id, us.full_name, dr.registration_date, ebr.level_of_urgency,
               dr.status, hc.health_status, hc.height, hc.weight, hc.note,
               dr.donation_registration_id, dr.screened_by_staff_id
        FROM health_check AS hc
        LEFT JOIN donation_registration AS dr ON dr.donation_registration_id = hc.donation_registration_id
        LEFT JOIN user_table AS us ON us.user_id = dr.donor_id
        LEFT JOIN donation_emergency AS de ON de.donation_registration_id = dr.donation_registration_id
        LEFT JOIN emergency_blood_request ebr ON ebr.emergency_blood_request_id = de.emergency_blood_request_id
        WHERE dr.screened_by_staff_id = :staffId
            AND hc.health_status = N'CHỜ ĐỢI'
            AND dr.status = N'CHƯA HIẾN'
    """, nativeQuery = true)
    List<Object[]> findHealthChecksByStaffId(@Param("staffId") UUID staffId);
}
