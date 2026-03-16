package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.bloodinventoryDTO.response.BloodInventoryResponse;
import com.example.BloodDonationSupportSystem.dto.reportDTO.OverviewReportDTO;
import com.example.BloodDonationSupportSystem.dto.reportDTO.ReportFilterRequest;
import com.example.BloodDonationSupportSystem.dto.reportDTO.ReportFilterRequestByDate;
import com.example.BloodDonationSupportSystem.service.reportservice.ReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/admin/report")
@Tag(name = "Report Controller")
public class ReportController {

    @Autowired
    ReportService reportService;





    @PostMapping("/overview")
    public BaseReponse<OverviewReportDTO> getOverviewReport(@RequestBody @Valid ReportFilterRequest request) {
        var overview = reportService.getOverview(request);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get Overview Report", overview);
    }

    @PostMapping("/monthly-blood-statistic")

    public BaseReponse<?> getMonthlyStats(@RequestBody @Valid ReportFilterRequest request) {
        var monthlyData = reportService.getMonthlyStats(request);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get Monthly Stats", monthlyData);
    }

    @PostMapping("/blood-inventory-for-chart")
    public BaseReponse<?> getBloodVolume(@RequestBody @Valid ReportFilterRequest request) {
        var cumulativeData = reportService.getBloodVolume(request);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get Cumulative Volume Report", cumulativeData);
    }


    @PostMapping("/blood-donation")
    public BaseReponse<?> getBloodDonationReport(@RequestBody @Valid ReportFilterRequestByDate request) {
        var getBloodDonationReport = reportService.getDonationReport(request);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get Blood Donation Report", getBloodDonationReport);
    }

    @PostMapping("/blood-donation/export")
    public void exportDonationReport(@RequestBody @Valid ReportFilterRequestByDate request, HttpServletResponse response) throws IOException {

        reportService.exportBloodDonationReportToExcel( request, response);
    }


    @GetMapping("/blood-inventory")
    public BaseReponse<?> getBloodInventory() {
        List<BloodInventoryResponse> bloodInventory = reportService.getBloodInventory();

        return new BaseReponse<>(HttpStatus.OK.value(), "Get blood inventory", bloodInventory);
    }

    @GetMapping("/blood-inventory/export")
    public void exportDonationReport( HttpServletResponse response) throws IOException {

        reportService.exportBloodInventoryReportToExcel( response);
    }



    @PostMapping("/monthly-emergency")
    public BaseReponse<?> getMonthlyEmergencyRequests(@RequestBody @Valid ReportFilterRequest request) {
        var monthlyEmergency = reportService.getMonthlyEmergencyRequests(request);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get monthly emergency", monthlyEmergency);
    }
    @PostMapping("/emergency-blood-request")
    public BaseReponse<?> getEmergencyBloodRequestReport(@RequestBody @Valid ReportFilterRequestByDate request ) {
        var emergencyBloodRequestReport = reportService.getEmergencyBloodRequestReport(request);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get emergency blood report", emergencyBloodRequestReport);
    }
    @PostMapping("/emergency-blood-request/export")
    public void exportEmergencyBloodRequestReportToExcel(@RequestBody @Valid ReportFilterRequestByDate request, HttpServletResponse response) throws IOException {

        reportService.exportEmergencyBloodRequestReportToExcel( request, response);
    }


    @PostMapping("/staff-donation")
    public BaseReponse<?> getStaffDonationReport(@RequestBody @Valid ReportFilterRequestByDate request) {
        var staffDonationReport = reportService.getStaffDonationReport(request);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get Staff Donation Report", staffDonationReport);
    }
    @PostMapping("/staff/export")
    public void exportStaffDonationReportToExcel(@RequestBody @Valid ReportFilterRequestByDate request, HttpServletResponse response) throws IOException {

        reportService.exportStaffReportToExcel( request, response);
    }

    @PostMapping("/staff-emergency")
    public BaseReponse<?> getStaffEmergencyReport(@RequestBody @Valid ReportFilterRequestByDate request) {
        var staffEmergencyReport = reportService.getStaffEmergencyReport(request);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get Staff emergency", staffEmergencyReport);
    }


}
