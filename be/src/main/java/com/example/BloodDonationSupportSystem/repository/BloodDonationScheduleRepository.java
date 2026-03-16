package com.example.BloodDonationSupportSystem.repository;

import com.example.BloodDonationSupportSystem.entity.BloodDonationScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface BloodDonationScheduleRepository extends JpaRepository<BloodDonationScheduleEntity, UUID> {

@Query(value =
        "SELECT " +
                "u.full_name AS donor_name, " +
                "u.phone_number AS donor_phone, " +
                "o.account AS donor_account, " +
                "u.address AS donor_address, " +
                "u.blood_type AS donor_blood_type, " +
                "dp.volume_ml AS donated_volume, " +
                "bs.donation_date, " +
                "bs.address_hospital, " +
                "dr.status " +
                "FROM donation_registration dr " +
                "JOIN user_table u ON u.user_id = dr.donor_id " +
                "LEFT JOIN oauthaccount o ON o.user_id = u.user_id " +
                "LEFT JOIN blood_donation_schedule bs ON bs.blood_donation_schedule_id = dr.blood_donation_schedule_id " +
                "LEFT JOIN donation_process dp ON dp.donation_registration_id = dr.donation_registration_id " +
                "WHERE bs.donation_date BETWEEN :startDate AND :endDate " +
                "ORDER BY bs.donation_date ASC",
        nativeQuery = true)
    List<Object[]> getDonationReport(@Param("startDate") Date startDate,
                                     @Param("endDate") Date endDate);



    List<BloodDonationScheduleEntity> findAllByDonationDateBetween(LocalDate startDate, LocalDate endDate);
    BloodDonationScheduleEntity findByAddressHospitalAndDonationDate(String addressHospital, LocalDate donationDate);



}
