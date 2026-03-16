package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.UserProfileDTO;
import com.example.BloodDonationSupportSystem.entity.OauthAccountEntity;
import com.example.BloodDonationSupportSystem.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByPhoneNumber(String phoneNumber);
    Optional<UserEntity> findByOauthAccount(OauthAccountEntity oauthAccountEntity);
    Optional<UserEntity> findByUserId(UUID userId);
    boolean existsByPhoneNumber(String phoneNumber);
    @Query(value = "SELECT COUNT(*) FROM user_table u " +
            "WHERE "+
            " YEAR(u.created_at) < :year " +
            "OR (MONTH(u.created_at) <= :month AND YEAR(u.created_at) = :year) ",
            nativeQuery = true)
    long countFilter(
            @Param("year") int year,
            @Param("month") int month);

    @Query(value = """
    SELECT u.full_name AS fullName,
           u.blood_type AS bloodType,
           MAX(d.date_complete_donation) AS lastDonationDate,
           COALESCE(oa.account, u.phone_number) AS contactInfo
      FROM user_table u
      JOIN donation_registration d ON u.user_id = d.donor_id
     JOIN donation_process dp ON dp.donation_registration_id = d.donation_registration_id
      LEFT JOIN oauthaccount oa ON u.user_id = oa.user_id
     WHERE u.status = N'HOẠT ĐỘNG'
       AND u.[role_id] = 2
       AND dp.status = N'ĐÃ HIẾN'
       AND d.date_complete_donation <= :threeMonthsAgo
       AND u.blood_type IN (:bloodTypes)
       AND (6371 * acos(
             cos(radians(:fptLat)) *
             cos(radians(CAST(u.latitude AS double precision))) *
             cos(radians(CAST(u.longitude AS double precision)) - radians(:fptLng)) +
             sin(radians(:fptLat)) *
             sin(radians(CAST(u.latitude AS double precision)))
       )) <= :maxDistanceKm
     GROUP BY u.user_id, u.full_name, u.blood_type, u.phone_number, oa.account
""", nativeQuery = true)
    List<Object[]> findEligibleDonors(
            @Param("bloodTypes") List<String> bloodTypes,
            @Param("maxDistanceKm") double maxDistanceKm,
            @Param("fptLat") double fptLat,
            @Param("fptLng") double fptLng,
            @Param("threeMonthsAgo") LocalDate threeMonthsAgo
    );


    @Query(value =
            "SELECT " +
                    "u.full_name AS staff_name, " +
                    "u.phone_number AS staff_phone, " +
                    "donor.full_name AS donor_name, " +
                    "donor.phone_number AS donor_phone, " +
                    "donor.account AS donor_account, " +
                    "bs.donation_date, " +
                    "dr.status " +
                    "FROM user_table u " +
                    "JOIN donation_registration dr ON dr.screened_by_staff_id = u.user_id " +
                    "JOIN ( " +
                    "   SELECT u1.user_id, u1.full_name, u1.phone_number, o.account " +
                    "   FROM user_table u1 " +
                    "   LEFT JOIN oauthaccount o ON o.user_id = u1.user_id " +
                    ") donor ON donor.user_id = dr.donor_id " +
                    "JOIN blood_donation_schedule bs ON bs.blood_donation_schedule_id = dr.blood_donation_schedule_id " +
                    "WHERE u.role_id = 3 " +
                    "  AND bs.donation_date BETWEEN :startDate AND :endDate " +
                    "ORDER BY bs.donation_date ASC",
            nativeQuery = true)
    List<Object[]> getStaffDonationReport(@Param("startDate") Date startDate,
                                       @Param("endDate") Date endDate);


    @Query(value =
            "SELECT " +
                    "u.full_name , " +
                    "u.phone_number , " +
                    "ebr.patient_name, " +
                    "ebr.phone_number, " +
                    "ebr.note , " +
                    "donor.full_name , " +
                    "donor.phone_number, " +
                    "donor.account AS donor_account, " +
                    "ebr.registration_date, " +
                    "dr.status " +
                    "FROM user_table u " +
                    "JOIN donation_registration dr " +
                    "   ON dr.screened_by_staff_id = u.user_id " +
                    "LEFT JOIN ( " +
                    "   SELECT u1.user_id, u1.full_name, u1.phone_number, o.account " +
                    "   FROM user_table u1 " +
                    "   LEFT JOIN oauthaccount o ON o.user_id = u1.user_id " +
                    ") donor " +
                    "   ON donor.user_id = dr.donor_id " +
                    "JOIN donation_emergency de " +
                    "   ON de.donation_registration_id = dr.donation_registration_id " +
                    "JOIN emergency_blood_request ebr " +
                    "   ON ebr.emergency_blood_request_id = de.emergency_blood_request_id " +
                    "   AND ebr.registration_date BETWEEN :startDate AND :endDate " +
                    "WHERE u.role_id = 3 " +
                    "ORDER BY ebr.registration_date ASC",
            nativeQuery = true)
    List<Object[]> getStaffEmergencyDonationReport(@Param("startDate") Date startDate,
                                                   @Param("endDate") Date endDate);
    @Query(value = """
    SELECT u.*
    FROM user_table u
    JOIN donation_registration d ON d.donor_id = u.user_id
    JOIN donation_process dp ON dp.donation_registration_id = d.donation_registration_id
    WHERE dp.donation_process_id = :processId
    AND d.status = N'ĐÃ HIẾN'
""", nativeQuery = true)
    Optional<UserEntity> findUserByProcessId(@Param("processId") UUID processId);

    @Query("""
        SELECT new com.example.BloodDonationSupportSystem.dto.authenaccountDTO.UserProfileDTO(
            u.userId,
            u.fullName,
            u.dateOfBirth,
            u.gender,
            u.address,
            u.phoneNumber,
            u.longitude,
            u.latitude,
            u.bloodType,
            u.role.roleName,
            u.status,
            o.account,
            u.avatarPath
            )
        FROM user_table u
        LEFT JOIN u.oauthAccount o
        WHERE u.role.roleName IN ('ROLE_MEMBER', 'ROLE_STAFF')
        """)
    List<UserProfileDTO> findAllUserProfiles();

}
