package com.example.BloodDonationSupportSystem.service.historyservice;

import com.example.BloodDonationSupportSystem.dto.donationhistoryDTO.DonorDonationInfoDTO;
import com.example.BloodDonationSupportSystem.dto.donationhistoryDTO.StaffDonationInfoDTO;
import com.example.BloodDonationSupportSystem.entity.DonationCertificateEntity;
import com.example.BloodDonationSupportSystem.entity.DonationHistoryEntity;
import com.example.BloodDonationSupportSystem.entity.DonationRegistrationEntity;
import com.example.BloodDonationSupportSystem.entity.EmergencyDonationEntity;
import com.example.BloodDonationSupportSystem.exception.BadRequestException;
import com.example.BloodDonationSupportSystem.exception.ResourceNotFoundException;
import com.example.BloodDonationSupportSystem.repository.DonationCertificateRepository;
import com.example.BloodDonationSupportSystem.repository.DonationEmergencyRepository;
import com.example.BloodDonationSupportSystem.repository.DonationHistoryRepository;
import com.example.BloodDonationSupportSystem.repository.DonationRegistrationRepository;
import com.example.BloodDonationSupportSystem.utils.AuthUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class DonationInfoService {

    DonationRegistrationRepository donationRegistrationRepository;

    DonationHistoryRepository donationHistoryRepository;

    DonationEmergencyRepository donationEmergencyRepository;

    DonationCertificateRepository donationCertificateRepository;

    public List<DonorDonationInfoDTO> getDonationInfo() {
        UserDetails currentUser = AuthUtils.getCurrentUser();

        UUID userId;
        try {
            userId = UUID.fromString(currentUser.getUsername());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for user ID: " + currentUser.getUsername());
        }

        List<DonorDonationInfoDTO> donationInfo;

        donationInfo = donationRegistrationRepository.findAllDonationHistoryWithVolume(userId);

        if(donationInfo.isEmpty()) {
            return Collections.emptyList();
        }

        return donationInfo;
    }

    public void cancelDonation(UUID donationRegistrationId) {
        DonationRegistrationEntity registration = donationRegistrationRepository.findByDonationRegistrationId(donationRegistrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation registration not found with ID: " + donationRegistrationId));

        if (!"CHƯA HIẾN".equalsIgnoreCase(registration.getStatus())) {
            throw new BadRequestException("Can only be canceled when the status is 'CHƯA HIẾN'");
        }

        registration.setStatus("HỦY");
        donationRegistrationRepository.save(registration);
    }

    public DonorDonationInfoDTO getDonationInfoById(UUID registrationId) {
        DonorDonationInfoDTO donationInfo = donationRegistrationRepository.findDonationHistoryById(registrationId);

        if (donationInfo == null) {
            throw new ResourceNotFoundException("Donation registration not found with ID: " + registrationId);
        }

        return donationInfo;
    }

    public void saveDonationHistory(DonationRegistrationEntity registration) {

        DonationHistoryEntity history = new DonationHistoryEntity();
        history.setRegistrationDate(registration.getRegistrationDate());

        if (registration.getBloodDonationSchedule() != null) {
            history.setAddressHospital(registration.getBloodDonationSchedule().getAddressHospital());
        }

        history.setDonationRegistration(registration);
        history.setDonorHistory(registration.getDonor());

        donationHistoryRepository.save(history);
    }



    public void saveCertificateInfo(DonationRegistrationEntity registration){

        DonationCertificateEntity certificateEntity = new DonationCertificateEntity();
        certificateEntity.setTitle("CHỨNG NHẬN HIẾN MÁU");
        certificateEntity.setIssuedAt(LocalDate.now());
        certificateEntity.setDonorCertificate(registration.getDonor());
        certificateEntity.setDonationRegistrationCertificate(registration);

        Optional<EmergencyDonationEntity> emergencyDonation =
                donationEmergencyRepository.findByDonationRegistrationDonationRegistrationId(registration.getDonationRegistrationId());

        if (emergencyDonation.isPresent() && emergencyDonation.get().getEmergencyBloodRequest() != null) {
            certificateEntity.setTypeCertificate("HIẾN MÁU KHẨN CẤP");
        } else {
            certificateEntity.setTypeCertificate("HIẾN MÁU");
        }

        donationCertificateRepository.save(certificateEntity);
    }


    public List<StaffDonationInfoDTO> getAllDonationHistoryForStaff() {
        List<StaffDonationInfoDTO> donationInfoList =
                donationRegistrationRepository.findAllDonationsForStaff("ĐÃ HIẾN", "HỦY");

        if (donationInfoList.isEmpty()) {
            return Collections.emptyList();
        }

        return donationInfoList;
    }

    public List<StaffDonationInfoDTO> getDonationHistoryByDonorId(UUID donorId) {
        List<StaffDonationInfoDTO> donationInfoList =
                donationRegistrationRepository.findAllDonationsByDonorId(donorId);

        if (donationInfoList.isEmpty()) {
            return Collections.emptyList();
        }

        return donationInfoList;
    }

    public List<DonorDonationInfoDTO> findAllCompletedDonations(){
        UserDetails currentUser = AuthUtils.getCurrentUser();

        UUID userId;
        try {
            userId = UUID.fromString(currentUser.getUsername());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for user ID: " + currentUser.getUsername());
        }

        List<DonorDonationInfoDTO> completedDonations =
                donationRegistrationRepository.findAllCompletedDonations(userId, "ĐÃ HIẾN", "HỦY");

        if (completedDonations.isEmpty()) {
            return Collections.emptyList();
        }
        return completedDonations;
    }

    public List<DonorDonationInfoDTO> findAllUncompletedDonations() {
        UserDetails currentUser = AuthUtils.getCurrentUser();

        UUID userId;
        try {
            userId = UUID.fromString(currentUser.getUsername());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for user ID: " + currentUser.getUsername());
        }

        List<DonorDonationInfoDTO> uncompletedDonations =
                donationRegistrationRepository.findAllUncompletedDonations(userId, "CHƯA HIẾN");

        if (uncompletedDonations.isEmpty()) {
            return Collections.emptyList();
        }
        return uncompletedDonations;
    }

}
