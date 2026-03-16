package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.smsDTO.request.SmsDonationRequest;
import com.example.BloodDonationSupportSystem.service.smsservice.SmsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api")
public class SmsController {
    @Autowired
    private SmsService smsService;

    @PostMapping("/staff/send-invite-sms")
    public BaseReponse<String> sendSms(@RequestBody @Valid SmsDonationRequest smsRequest) {
        return new BaseReponse<>(200, "SMS sent successfully", smsService.sendBloodDonationInvite(smsRequest.getBloodType(), smsRequest.getContact()));
    }
}
