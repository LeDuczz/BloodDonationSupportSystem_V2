package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.donationhistoryDTO.DonorDonationInfoDTO;
import com.example.BloodDonationSupportSystem.service.historyservice.DonationInfoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/member")
@Tag(name = "Donation Information Controller")
public class DonationInfoController {

    @Autowired
    private DonationInfoService donationInfoService;

    @GetMapping("/donation-info")
    public BaseReponse<List<DonorDonationInfoDTO>> getDonationInfo() {
        List<DonorDonationInfoDTO> donationInfo = donationInfoService.getDonationInfo();
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Get donation info successful",
                donationInfo);
    }

    @PutMapping("/donation-info/{registrationId}/cancel")
    public BaseReponse<?> cancelDonation(@PathVariable UUID registrationId) {
        donationInfoService.cancelDonation(registrationId);
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Update donation info status successful",
                null);
    }

    @GetMapping("/donation-info/{registrationId}")
    public BaseReponse<DonorDonationInfoDTO> updateDonationInfo(@PathVariable UUID registrationId) {
        DonorDonationInfoDTO donationInfo = donationInfoService.getDonationInfoById(registrationId);
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Get donation info successful",
                donationInfo);
    }

    @GetMapping("/donation-infos/completed")
    public BaseReponse<List<DonorDonationInfoDTO>> findAllCompletedDonations() {
        List<DonorDonationInfoDTO> completedDonations = donationInfoService.findAllCompletedDonations();
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Get all completed donations successful",
                completedDonations);
    }

    @GetMapping("/donation-infos/uncompleted")
    public BaseReponse<List<DonorDonationInfoDTO>> findAllUnCompletedDonations() {
        List<DonorDonationInfoDTO> completedDonations = donationInfoService.findAllUncompletedDonations();
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Get all completed donations successful",
                completedDonations);
    }

}
