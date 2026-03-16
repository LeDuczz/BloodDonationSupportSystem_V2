package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.searchdistanceDTO.request.SearchDistanceRequest;
import com.example.BloodDonationSupportSystem.dto.searchdistanceDTO.response.DonorResponse;
import com.example.BloodDonationSupportSystem.service.searchdistanceservice.SearchDistanceService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/staff")
public class SearchDistanceController {

    @Autowired
    SearchDistanceService searchDistanceService;

    @PostMapping("/donors-search")
    public BaseReponse<List<DonorResponse>> searchDonorByDistance(@Valid @RequestBody SearchDistanceRequest request) {
      List<DonorResponse> donorResponses = searchDistanceService.getEligibleDonors(request.getBloodTypes(),request.getDistance());
         return  new BaseReponse<>(HttpStatus.OK.value(),"Search donors by distance successfully", donorResponses);
    }
}
