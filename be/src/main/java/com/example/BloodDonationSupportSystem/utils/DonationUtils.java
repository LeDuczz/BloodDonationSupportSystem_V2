package com.example.BloodDonationSupportSystem.utils;

import com.example.BloodDonationSupportSystem.entity.DonationRegistrationEntity;
import com.example.BloodDonationSupportSystem.exception.BadRequestException;
import com.example.BloodDonationSupportSystem.repository.DonationRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Component
public class DonationUtils {

    @Autowired
    private DonationRegistrationRepository donationRegistrationRepository;

    public void validateDonorEligibility(UUID donorId) {
        List<DonationRegistrationEntity> uncompleted = donationRegistrationRepository.findUncompletedRegistrations(donorId, "CHƯA HIẾN");
        if (!uncompleted.isEmpty()) {
            throw new BadRequestException("You already have a pending registration!");
        }


        DonationRegistrationEntity latestRegistration = donationRegistrationRepository
                .findLatestRegistrationByDonor(donorId)
                .stream().findFirst().orElse(null);

        if (latestRegistration != null) {
            LocalDate today = LocalDate.now();
            LocalDate last = latestRegistration.getDateCompleteDonation();
            if (last != null && ChronoUnit.DAYS.between(last, today) < 90) {
                throw new BadRequestException("You have donated within the last 90 days. Please wait longer!");
            }
        }
    }
}
