package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.emergencybloodrequestDTO.request.EmergencyBloodRequestDTO;
import com.example.BloodDonationSupportSystem.service.emergencybloodrequestservice.EmergencyBloodRequestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Emergency Blood Request")
public class EmergencyBloodRequestController {

    @Autowired
    private EmergencyBloodRequestService emergencyBloodRequestService;

    @PostMapping("/staff/emergencies-notification/emergency-requests")
    public BaseReponse<?> createEmergencyRequest(@RequestBody @Valid EmergencyBloodRequestDTO dto) {
        EmergencyBloodRequestDTO response = emergencyBloodRequestService.createEmergencyRequest(dto);
        return new BaseReponse<>(HttpStatus.OK.value(), "Emergency Request Created", response);

    }

    @GetMapping("/emergencies-notification/emergency-cases")
    public BaseReponse<?> getEmergencyCasesWithSortedLevelOfUrgency() {
        List<EmergencyBloodRequestDTO> response = emergencyBloodRequestService.getEmergencyCasesWithSortedLevelOfUrgency();
        return new BaseReponse<>(HttpStatus.OK.value(), "Get Emergency Cases Successfully", response);
    }

}
