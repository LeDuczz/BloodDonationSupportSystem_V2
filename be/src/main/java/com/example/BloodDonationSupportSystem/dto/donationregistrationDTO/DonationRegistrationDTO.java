package com.example.BloodDonationSupportSystem.dto.donationregistrationDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
public class DonationRegistrationDTO {
    private UUID donationRegistrationId;

    private LocalDate registrationDate;

    private LocalDate completeDonationDate;

    @NotNull(message = "Status can not null!")
    private String status;
    @NotNull(message = "Start date can not null!")
    private LocalDate startDate;

    @NotNull(message = "End date can not null!")
    private LocalDate endDate;

    private UUID screenedByStaffId;

    @NotNull(message = "This registration form must to assigned with specific member!!!")
    private UUID donorId;

    private UUID bloodDonationScheduleId;

    private String donorFullName;

    private String donorPhonumber;

    private String donorEmail;

    private String levelOfUrgency;

    private String addressHospital;

    public DonationRegistrationDTO(UUID donationRegistrationId, String donorFullName, String donorPhonumber, String donorEmail, String levelOfUrgency, LocalDate registrationDate, String addressHospital, UUID screenedByStaffId) {
        this.donationRegistrationId = donationRegistrationId;
        this.donorFullName = donorFullName;
        this.donorPhonumber = donorPhonumber;
        this.donorEmail = donorEmail;
        this.levelOfUrgency = levelOfUrgency;
        this.registrationDate = registrationDate;
        this.addressHospital = addressHospital;
        this.screenedByStaffId = screenedByStaffId;
    }

}
