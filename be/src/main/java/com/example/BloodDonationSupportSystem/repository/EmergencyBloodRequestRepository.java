package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.entity.EmergencyBloodRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface EmergencyBloodRequestRepository extends JpaRepository<EmergencyBloodRequestEntity, UUID> {

    @Query("""
    SELECT ebr
    FROM emergency_blood_request ebr
    WHERE ebr.isFulfill = false
""")
    List<EmergencyBloodRequestEntity> getAllIsFulfillEmergencyBloodRequests();

    @Query("SELECT e FROM emergency_blood_request e WHERE e.isFulfill = true")
    List<EmergencyBloodRequestEntity> findAllByIsFulfillTrue();


    @Modifying
    @Query("""
    UPDATE emergency_blood_request
    SET isFulfill = true
    WHERE emergencyBloodRequestId IN (
        SELECT ebr.emergencyBloodRequestId
        FROM emergency_blood_request ebr
        JOIN donation_emergency de ON ebr.emergencyBloodRequestId = de.emergencyBloodRequest.emergencyBloodRequestId
        JOIN donation_registration dr ON dr.donationRegistrationId = de.donationRegistration.donationRegistrationId
        JOIN donation_process dp ON dp.donationRegistrationProcess.donationRegistrationId = dr.donationRegistrationId
        WHERE dr.status = :donationRegistrationStatus AND dp.status = :donationProcessStatus AND dp.bloodTest = :bloodTest
        GROUP BY ebr.emergencyBloodRequestId, ebr.volumeMl
        HAVING SUM(dp.volumeMl) >= ebr.volumeMl
    )

""")
    void markFulfilledRequests(@Param("donationRegistrationStatus") String donationRegistrationStatus, @Param("donationProcessStatus") String donationProcessStatus, @Param("bloodTest") String bloodTest);



    @Query(value =
            "SELECT MONTH(ebr.registration_date) AS month, " +
                    "COUNT(ebr.emergency_blood_request_id) AS total " +
                    "FROM emergency_blood_request ebr " +
                    "WHERE YEAR(ebr.registration_date) = :year " +
                    "GROUP BY MONTH(ebr.registration_date) " +
                    "ORDER BY month ASC",
            nativeQuery = true)
    List<Object[]> getMonthlyEmergencyRequests(@Param("year") int year);


    @Query(value =
            "SELECT " +
                    "   ebr.registration_date, " +
                    "   ebr.patient_name, " +
                    "   ebr.phone_number, " +
                    "   ebr.location_of_patient, " +
                    "   ebr.blood_type, " +
                    "   ebr.volume_ml, " +
                    "   ebr.note, " +
                    "   u.full_name, " +
                    "   u.phone_number, " +
                    "   oauth.account, " +
                    "   dp.volume_ml, " +
                    " dr.status " +
                    "FROM emergency_blood_request ebr " +
                    "LEFT JOIN donation_emergency de ON de.emergency_blood_request_id = ebr.emergency_blood_request_id " +
                    "LEFT JOIN donation_registration dr ON dr.donation_registration_id = de.donation_registration_id " +
                    "LEFT JOIN user_table u ON u.user_id = dr.donor_id " +
                    "LEFT JOIN oauthaccount oauth ON oauth.user_id = u.user_id " +
                    "LEFT JOIN donation_process dp ON dp.donation_registration_id = dr.donation_registration_id " +
                    "WHERE ebr.registration_date BETWEEN :startDate AND :endDate " +
                    "ORDER BY ebr.registration_date ASC",
            nativeQuery = true)
    List<Object[]> getEmergencyBloodRequestReport(@Param("startDate") Date startDate,
                                                  @Param("endDate") Date endDate);


}
