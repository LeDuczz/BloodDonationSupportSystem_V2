package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.donationregistrationDTO.DonationRegistrationDTO;
import com.example.BloodDonationSupportSystem.service.donationregistrationservice.DonationRegistrationService;
import com.example.BloodDonationSupportSystem.utils.AuthUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@Tag(name = "Donation Registration Controller")
public class DonationRegistrationController {

    @Autowired
    private DonationRegistrationService donationRegistrationService;

    @PostMapping("/member/registration")
    public BaseReponse<?> create(@RequestBody @Valid DonationRegistrationDTO dto) {
        DonationRegistrationDTO response = donationRegistrationService.create(dto);
        return new BaseReponse<>(HttpStatus.OK.value(), "Created successfully", response);
    }



    @PostMapping("/member/emergency-registrations")
    public BaseReponse<?> registerEmergencyDonation(@RequestParam String emergencyDonationId) {
        DonationRegistrationDTO response = donationRegistrationService.registerEmergencyDonation(emergencyDonationId);
        return new BaseReponse<>(HttpStatus.OK.value(), "Registered emergency donation successfully", response);
    }

    @PutMapping("/member/registration/{id}")
    public BaseReponse<?> update(@PathVariable UUID id, @RequestBody @Valid DonationRegistrationDTO dto) {
        DonationRegistrationDTO response = donationRegistrationService.update(id, dto);
        return new BaseReponse<>(HttpStatus.OK.value(), "Updated successfully", response);
    }


    @PutMapping("/staff/cancel-registration/{id}")
    public BaseReponse<?> updateRegistrationStatus(@PathVariable UUID id) {
        try {
            donationRegistrationService.updateCancelStatus(id);
            return new BaseReponse<>(HttpStatus.OK.value(), "Update successfully", null);
        } catch (Exception e) {
            return new BaseReponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An error occurred while updating the status.", null);
        }
    }

    @DeleteMapping("/member/registration/{id}")
    public BaseReponse<?> delete(@PathVariable UUID id) {
        donationRegistrationService.delete(id);
        return new BaseReponse<>(HttpStatus.OK.value(), "deleted successfully", null);
    }

    @GetMapping("/member/registration/{id}")
    public BaseReponse<?> getById(@PathVariable UUID id) {
        DonationRegistrationDTO response = donationRegistrationService.getById(id);
        return new BaseReponse<>(HttpStatus.OK.value(), "Fetched successfully", response);
    }

    @GetMapping("/member/registrations")
    public BaseReponse<?> getAll() {
        List<DonationRegistrationDTO> response = donationRegistrationService.getAll();
        return new BaseReponse<>(HttpStatus.OK.value(), "Fetched all successfully", response);
    }

    @GetMapping("/staff/unassigned-list")
    public BaseReponse<?> getUnassignedRegistrations() {
        List<DonationRegistrationDTO> response = donationRegistrationService.getUnassignedRegistrations();
        return new BaseReponse<>(HttpStatus.OK.value(), "Fetched unassigned registrations successfully", response);
    }

    @PutMapping("/staff/assign-registration/{id}")
    public BaseReponse<?> updateScreenByStaff(@PathVariable UUID id) {
        try {
            UUID staffId = UUID.fromString(AuthUtils.getCurrentUser().getUsername());
            donationRegistrationService.updateScreenByStaff(id,staffId);
            return new BaseReponse<>(HttpStatus.OK.value(), "Update successfully", null);
        } catch (Exception e) {
            return new BaseReponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An error occurred while updating the status.", null);
        }
    }

}
