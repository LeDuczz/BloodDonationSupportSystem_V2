package com.example.BloodDonationSupportSystem.scheduler;

import com.example.BloodDonationSupportSystem.entity.DonationRegistrationEntity;
import com.example.BloodDonationSupportSystem.entity.OauthAccountEntity;
import com.example.BloodDonationSupportSystem.repository.DonationRegistrationRepository;
import com.example.BloodDonationSupportSystem.repository.OauthAccountRepository;
import com.example.BloodDonationSupportSystem.service.emailservice.EmailService;
import com.example.BloodDonationSupportSystem.service.smsservice.SmsService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DonationRegistrationCleanupScheduler {
    @Autowired
    private DonationRegistrationRepository donationRegistrationRepository;

    @Autowired
    private SmsService smsService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OauthAccountRepository oauthAccountRepository;

    @Scheduled(cron = "0 0 2 * * *")//Run at 2AM everyday
    @Transactional
    public void markExpiredRegistrationsAsCancelled() {
        LocalDate cutoffDate = LocalDate.now().minusDays(15);

        List<DonationRegistrationEntity> expiredRegistrations = donationRegistrationRepository.findExpiredUnfulfilledRegistrations(cutoffDate, "CHƯA HIẾN");

        for (DonationRegistrationEntity expiredRegistration : expiredRegistrations) {
            expiredRegistration.setStatus("HỦY");
            donationRegistrationRepository.save(expiredRegistration);
            try {
                String phone = expiredRegistration.getDonor().getPhoneNumber();
                if (phone != null && !phone.isBlank()) {
                    smsService.sendRegistrationFailureNotification(phone);
                } else {
                    OauthAccountEntity emailAcc = oauthAccountRepository.findByUser(expiredRegistration.getDonor());
                    if (emailAcc != null) {
                        emailService.sendRegistrationFailureNotification(
                                expiredRegistration.getDonor().getFullName(),
                                emailAcc.getAccount()
                        );
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Error auto sending registration failure notification", e);
            }


        }

    }

}
