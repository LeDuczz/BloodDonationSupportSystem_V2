package com.example.BloodDonationSupportSystem.controller;


import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.donationhistoryDTO.StaffDonationInfoDTO;
import com.example.BloodDonationSupportSystem.service.historyservice.DonationInfoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff")
@Tag(name = "Staff DonationHistory Controller")
public class StaffDonationHistoryController {

    @Autowired
    private DonationInfoService donationInfoService;

    @GetMapping("/get-all-list-donation-history")
    public BaseReponse<List<StaffDonationInfoDTO>> getALlListDonationHistoryForStaff() {
        List<StaffDonationInfoDTO> donationHistoryList = donationInfoService.getAllDonationHistoryForStaff();
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Get all list donation history successfully for staff",
                donationHistoryList);
    }

    @GetMapping("/donation-history/donor/{donorId}")
    public BaseReponse<List<StaffDonationInfoDTO>> getDonationHistoryByDonorId(@PathVariable UUID donorId) {
        List<StaffDonationInfoDTO> donationHistoryList = donationInfoService.getDonationHistoryByDonorId(donorId);
        return new BaseReponse<>(HttpStatus.OK.value(),
                "Get donation history successfully for donor ID: " + donorId,
                donationHistoryList);
    }
}
