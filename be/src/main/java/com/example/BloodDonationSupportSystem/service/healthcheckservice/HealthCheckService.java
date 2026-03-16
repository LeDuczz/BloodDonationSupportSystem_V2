package com.example.BloodDonationSupportSystem.service.healthcheckservice;

import com.example.BloodDonationSupportSystem.dto.healthcheckDTO.HealthCheckDTO;
import com.example.BloodDonationSupportSystem.entity.DonationProcessEntity;
import com.example.BloodDonationSupportSystem.entity.DonationRegistrationEntity;
import com.example.BloodDonationSupportSystem.entity.HealthCheckEntity;
import com.example.BloodDonationSupportSystem.exception.ResourceNotFoundException;
import com.example.BloodDonationSupportSystem.repository.DonationProcessRepository;
import com.example.BloodDonationSupportSystem.repository.DonationRegistrationRepository;
import com.example.BloodDonationSupportSystem.repository.HealthCheckRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class HealthCheckService {

    @Autowired
    private HealthCheckRepository healthCheckRepository;

    @Autowired
    private DonationProcessRepository donationProcessRepository;

    @Autowired
    private DonationRegistrationRepository donationRepository;

    @Autowired
    private DonationRegistrationRepository donationRegistrationRepository;

    public List<HealthCheckDTO> getHealthChecksByStaffId(UUID staffId) {
        List<Object[]> healthChecks = healthCheckRepository.findHealthChecksByStaffId(staffId);

        return healthChecks.stream().map(row -> new HealthCheckDTO(
                UUID.fromString(row[0].toString()), // health_check_id
                row[1].toString(),                  // donor full name
                LocalDate.parse(row[2].toString()), // registration_date
                row[3] != null ? row[3].toString() : null, // urgency
                row[4].toString(),                  // status
                row[5].toString(),                  // health_status
                Float.parseFloat(row[6].toString()), // height
                Float.parseFloat(row[7].toString()), // weight
                row[8] != null ? row[8].toString() : null,
                UUID.fromString(row[9].toString()), // donation_registration_id
                UUID.fromString(row[10].toString())  // screened_by_staff_id
        )).toList();
    }

    @Transactional
    public void updateHealthCheck(HealthCheckDTO request) {
        HealthCheckEntity healthCheck = healthCheckRepository.findById(request.getHealthCheckId())
                .orElseThrow(() -> new ResourceNotFoundException("Not found."));

        healthCheck.setHealthStatus(request.getHealthStatus());
        healthCheck.setHeight(request.getHeight());
        healthCheck.setWeight(request.getWeight());
        healthCheck.setNote(request.getNote());
        healthCheckRepository.save(healthCheck);

        DonationRegistrationEntity registration = donationRepository.findById(request.getDonationRegistrationId())
                .orElseThrow(() -> new ResourceNotFoundException("Not found."));

        if ("ĐÃ ĐẠT".equalsIgnoreCase(request.getHealthStatus())) {

            boolean exists = donationProcessRepository.existsByDonationRegistrationProcess_DonationRegistrationId(request.getDonationRegistrationId());
            if (!exists) {

                DonationProcessEntity donationProcess = new DonationProcessEntity();
                donationProcess.setBloodTest("CHƯA KIỂM TRA");
                donationProcess.setVolumeMl(0);
                donationProcess.setStatus("CHỜ ĐỢI");
                donationProcess.setDonationRegistrationProcess(registration);

                donationProcessRepository.save(donationProcess);
            }
        } else if("CHƯA ĐẠT".equalsIgnoreCase(request.getHealthStatus())) {
            // Nếu không đạt, cập nhật trạng thái đơn đăng ký
            registration.setStatus("HỦY");
            donationRegistrationRepository.save(registration);
        }
    }



}
