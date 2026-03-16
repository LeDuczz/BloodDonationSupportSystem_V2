package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.blooddonationscheduleDTO.BloodDonationScheduleDTO;
import com.example.BloodDonationSupportSystem.dto.donationregistrationDTO.StatByDateDTO;
import com.example.BloodDonationSupportSystem.service.scheduleservice.BloodDonationScheduleService;
import com.example.BloodDonationSupportSystem.utils.AuthUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@Tag(name = "Schedule")
public class BloodDonationScheduleController {

    @Autowired
    private BloodDonationScheduleService bloodDonationScheduleService;

    @PutMapping("/admin/schedule/{id}")
    public BaseReponse<?> updateSchedule(@PathVariable String id, @Valid @RequestBody BloodDonationScheduleDTO dto) {

        BloodDonationScheduleDTO updated = bloodDonationScheduleService.updateSchedule(id, dto);
        return new BaseReponse<>(HttpStatus.OK.value(), "Update successful", updated);

    }

    @DeleteMapping("/admin/schedule/{id}")
    public BaseReponse<?> deleteSchedule(@PathVariable UUID id) {
        bloodDonationScheduleService.deleteSchedule(id);
        return new BaseReponse<>(HttpStatus.OK.value(), "Delete successful", null);
    }


    @GetMapping("/admin/schedules")
    public BaseReponse<?> getAdminSchedules() {
        List<BloodDonationScheduleDTO> response = bloodDonationScheduleService.getAllByAdmin();
        return new BaseReponse<>(HttpStatus.OK.value(), "Get All Schedules successfully", response);
    }

    @GetMapping("/staff/schedules")
    public BaseReponse<?> getSchedules() {
        List<BloodDonationScheduleDTO> response = bloodDonationScheduleService.getAll();
        return new BaseReponse<>(HttpStatus.OK.value(), "Get All Schedules successfully", response);
    }

    @GetMapping("/staff/registration/stat-by-day")
    public BaseReponse<?> getStatByDay() {
        List<StatByDateDTO> response = bloodDonationScheduleService.getStatByDate();
        return new BaseReponse<>(HttpStatus.OK.value(), "Count registration in each day", response);
    }

    @PostMapping("/staff/schedule")
    public BaseReponse<?> createSchedule(@RequestBody @Valid BloodDonationScheduleDTO dto) {
        UUID staffId = UUID.fromString(AuthUtils.getCurrentUser().getUsername());
        BloodDonationScheduleDTO response = bloodDonationScheduleService.createSchedule(dto, staffId);

        return new BaseReponse<>(HttpStatus.OK.value(), "Created and Matching success!!", response);
    }

    @GetMapping("/member/schedules/suggestion")
    public BaseReponse<?> getSuggestedSchedules(@RequestParam LocalDate start, @RequestParam LocalDate end) {
        List<BloodDonationScheduleDTO> result = bloodDonationScheduleService.getSchedulesInDateRange(start, end);
        return new BaseReponse<>(HttpStatus.OK.value(), "Having list schedule matching with registration", result);
    }


}
