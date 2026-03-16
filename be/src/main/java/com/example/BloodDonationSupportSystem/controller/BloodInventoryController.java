package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.bloodinventoryDTO.request.BloodVolumeRequest;
import com.example.BloodDonationSupportSystem.dto.bloodinventoryDTO.response.BloodInventoryResponse;
import com.example.BloodDonationSupportSystem.dto.donationprocessDTO.request.UpdateProcessTestRequest;
import com.example.BloodDonationSupportSystem.dto.donationprocessDTO.response.DonationProcessResponse;
import com.example.BloodDonationSupportSystem.service.bloodinventoryservice.BloodInventoryService;
import com.example.BloodDonationSupportSystem.service.donationprocessservice.DonationProcessService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/staff")
public class BloodInventoryController {

    @Autowired
    private BloodInventoryService bloodBagService;

    @Autowired
    private DonationProcessService donationProcessService;

    @GetMapping("/get-total-blood-volume-of-all-blood-types")
    public BaseReponse<List<BloodInventoryResponse>> getBloodBagList() {
        List<BloodInventoryResponse> bloodBagList = bloodBagService.getBloodBagList();

        return new BaseReponse<>(HttpStatus.OK.value(), "Get total of blood volume successfully", bloodBagList);
    }

    @GetMapping("/get-information-of-a-blood-type/{bloodTypeId}")
    public BaseReponse<BloodInventoryResponse> getABloodBagByTypeId(@PathVariable String bloodTypeId) {
        BloodInventoryResponse bloodBagTotal = bloodBagService.getBloodBagById(bloodTypeId);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get information a blood type successfully", bloodBagTotal);
    }

    @PutMapping("/update-blood-volume/{bloodTypeId}")
    public BaseReponse<?> updateBloodVolume(@PathVariable String bloodTypeId,
                                            @RequestBody @Valid BloodVolumeRequest request){

        return  bloodBagService.updateBloodVolume(bloodTypeId,request.getDonationRegisId(),request.getProcessId() ,request.getVolumeMl());
    }


    @GetMapping("/get-completed-donation-process-list/blood-checking")
    public BaseReponse<List<DonationProcessResponse>> getBloodCheckingList() {
        List<DonationProcessResponse> bloodCheckingList = donationProcessService.getCompletedDonationProcess();

        return new BaseReponse<>(
                HttpStatus.OK.value(),
                "Get blood checking list successfully",
                bloodCheckingList
        );
    }

    @PutMapping("/update-process-is-passed/{processId}")
    public BaseReponse<DonationProcessResponse> updateProcessIsPassed(@PathVariable UUID processId,
                                                                      @RequestBody  @Valid UpdateProcessTestRequest request) {


        DonationProcessResponse donationProcessResponse = donationProcessService.updateProcessIsPassed(processId,request.getBloodTest(),request.getBloodTypeId());
        return new BaseReponse<>(HttpStatus.OK.value(), "Update process is passed successfully", donationProcessResponse);
    }
}