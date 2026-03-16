package com.example.BloodDonationSupportSystem.service.reportservice;

import com.example.BloodDonationSupportSystem.dto.bloodinventoryDTO.response.BloodInventoryResponse;
import com.example.BloodDonationSupportSystem.dto.reportDTO.*;
import com.example.BloodDonationSupportSystem.entity.BloodInventory;
import com.example.BloodDonationSupportSystem.repository.*;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

@Service
public class ReportService {

    @Autowired
    DonationRegistrationRepository donationRegistrationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BloodInventoryRepository bloodInventoryRepository;


    @Autowired
    DonationRegistrationRepository bloodDonationRegistrationRepository;

    @Autowired
    BloodDonationScheduleRepository bloodDonationScheduleRepository;

    @Autowired
    EmergencyBloodRequestRepository emergencyBloodRequestRepository;



    public OverviewReportDTO getOverview(ReportFilterRequest request){
        OverviewReportDTO overviewReportDTO = new OverviewReportDTO();
        overviewReportDTO.setNumberAccount(userRepository.countFilter(request.getYear(), request.getMonth()));
        overviewReportDTO.setNumberBloodDonationsRegistration(bloodDonationRegistrationRepository.countFilter(request.getYear(), request.getMonth()));
        overviewReportDTO.setNumberSuccessDonation(bloodDonationRegistrationRepository.countNumberSuccessDonationFilter(request.getYear(), request.getMonth()));
        overviewReportDTO.setNumberFailureDonation(bloodDonationRegistrationRepository.countNumberFailureDonationFilter(request.getYear(), request.getMonth()));
        overviewReportDTO.setNumberNotCompleteDonation(bloodDonationRegistrationRepository.countNumberNotCompleteDonationFilter(request.getYear(), request.getMonth()));
        overviewReportDTO.setNumberNotAcceptedDonation(bloodDonationRegistrationRepository.countNumberNotAcceptedDonationFilter(request.getYear(), request.getMonth()));
        return overviewReportDTO;
    }

    public Map<Integer, Map<String, Integer>> getMonthlyStats(ReportFilterRequest request) {
        List<Object[]> results = bloodDonationRegistrationRepository.getMonthlyDonationStats(request.getYear());

        Map<Integer, Map<String, Integer>> monthlyData = new HashMap<>();

        for (int i = 1; i <= 12; i++) {
            Map<String, Integer> counts = new HashMap<>();
            counts.put("successCount", 0);
            counts.put("failedCount", 0);
            monthlyData.put(i, counts);
        }


        for (Object[] row : results) {
            int month = ((Number) row[0]).intValue();
            int successCount = ((Number) row[1]).intValue();
            int failedCount = ((Number) row[2]).intValue();

            Map<String, Integer> counts = new HashMap<>();
            counts.put("successCount", successCount);
            counts.put("failedCount", failedCount);
            monthlyData.put(month, counts);
        }

        return monthlyData;
    }

    public Map<String, Integer> getBloodVolume(ReportFilterRequest request) {

        LocalDate endDate = LocalDate.of(request.getYear(), request.getMonth(), 1).withDayOfMonth(
                LocalDate.of(request.getYear(), request.getMonth(), 1).lengthOfMonth()
        );

        List<Object[]> results = bloodInventoryRepository.getBloodVolume(Date.valueOf(endDate));


        Map<String, Integer> bloodVolumeData = new LinkedHashMap<>();
        for (Object[] row : results) {
            String bloodTypeId = row[0].toString();
            Integer totalVolume = ((Number) row[1]).intValue();
            bloodVolumeData.put(bloodTypeId, totalVolume);
        }

        return   bloodVolumeData;
    }





    public  Map<Integer, Integer> getMonthlyEmergencyRequests(ReportFilterRequest request) {


        List<Object[]> results = emergencyBloodRequestRepository.getMonthlyEmergencyRequests(request.getYear());

        Map<Integer,  Integer> monthlyEmergency = new HashMap<>();

        for (int i = 1; i <= 12; i++) {

            monthlyEmergency.put(i, 0);
        }


        for (Object[] row : results) {
            int month = ((Number) row[0]).intValue();
            int total = ((Number) row[1]).intValue();
            monthlyEmergency.put(month, total);
        }

        return monthlyEmergency;
    }

    public List<EmergencyBloodRequestReportDTO> getEmergencyBloodRequestReport(ReportFilterRequestByDate request) {
        List<Object[]> results = emergencyBloodRequestRepository.getEmergencyBloodRequestReport( Date.valueOf(request.getStartDate()),
                Date.valueOf(request.getEndDate()));
        List<EmergencyBloodRequestReportDTO>  bloodRequestReportDTOList = new ArrayList<>();
        for (Object[] row : results) {
            Date registrationDate = (Date) row[0];
            String patientName = (String) row[1];
            String patientPhone = (String) row[2];
            String patientLocation = (String) row[3];
            String patientBloodType = (String) row[4];
            int needVolume = (Integer) row[5];
            String notes = (String) row[6];
            String donorName = (String) row[7];
            String donorPhone = (String) row[8];
            String donorMail = (String) row[9];
            int sendVolume = row[10] != null ?  (Integer) row[10] : 0;
            String status = (String) row[11];

            bloodRequestReportDTOList.add(
                    new EmergencyBloodRequestReportDTO(registrationDate, patientName,
                            patientPhone, patientLocation, patientBloodType, needVolume,
                            notes, donorName, donorPhone, donorMail, sendVolume, status));
        }
        return bloodRequestReportDTOList;
    }

    public void exportEmergencyBloodRequestReportToExcel(ReportFilterRequestByDate request, HttpServletResponse response) throws IOException {
        List<Object[]> reportData = emergencyBloodRequestRepository.getEmergencyBloodRequestReport(Date.valueOf(request.getStartDate()),
                Date.valueOf(request.getEndDate()));


        XSSFWorkbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Báo cáo yêu cầu máu khẩn cấp");


        Row headerRow = sheet.createRow(0);
        String[] headers = {
                "Ngày đăng ký", "Tên bệnh nhân", "SĐT bệnh nhân", "Địa điểm bệnh nhân", "Nhóm máu cần",
                "Số ml yêu cầu", "Ghi chú", "Tên người hiến", "SĐT người hiến", "Email", "Số ml đã hiến"
        };
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }


        int rowNum = 1;
        for (Object[] row : reportData) {
            Row dataRow = sheet.createRow(rowNum++);
            dataRow.createCell(0).setCellValue(row[0] != null ? row[0].toString() : "");
            dataRow.createCell(1).setCellValue(row[1] != null ? row[1].toString() : "");
            dataRow.createCell(2).setCellValue(row[2] != null ? row[2].toString() : "");
            dataRow.createCell(3).setCellValue(row[3] != null ? row[3].toString() : "");
            dataRow.createCell(4).setCellValue(row[4] != null ? row[4].toString() : "");
            dataRow.createCell(5).setCellValue(row[5] != null ? row[5].toString() : "");
            dataRow.createCell(6).setCellValue(row[6] != null ? row[6].toString() : "");
            dataRow.createCell(7).setCellValue(row[7] != null ? row[7].toString() : "");
            dataRow.createCell(8).setCellValue(row[8] != null ? row[8].toString() : "");
            dataRow.createCell(9).setCellValue(row[9] != null ? row[9].toString() : "");
            dataRow.createCell(10).setCellValue(row[10] != null ? row[10].toString() : "");
        }


        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=emergency_blood_report.xlsx");


        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();
    }


    public List<StaffDonationReportDTO> getStaffDonationReport(ReportFilterRequestByDate request) {
        List<Object[]> result = userRepository.getStaffDonationReport(Date.valueOf(request.getStartDate()),
                Date.valueOf(request.getEndDate()));
        List<StaffDonationReportDTO> staffDonationReportDTOList = new ArrayList<>();
        for (Object[] row : result) {
            String staffName = (String) row[0];
            String staffPhone = (String) row[1];
            String donorName = (String) row[2];
            String donorPhone = (String) row[3];
            String donorMail = (String) row[4];
            Date donationDate = (Date) row[5];
            String status = (String) row[6];
            staffDonationReportDTOList.add(new StaffDonationReportDTO(staffName, staffPhone, donorName, donorPhone, donorMail, donationDate, status));
        }
        return  staffDonationReportDTOList;
    }

    public void exportStaffReportToExcel(ReportFilterRequestByDate request, HttpServletResponse response) throws IOException {
        List<Object[]> staffDonationReport = userRepository.getStaffDonationReport(Date.valueOf(request.getStartDate()),
                Date.valueOf(request.getEndDate()));


        XSSFWorkbook workbook = new XSSFWorkbook();
        Sheet sheet1 = workbook.createSheet("Báo cáo nhân viên đơn hiến máu bình thường");


        Row headerRow1 = sheet1.createRow(0);
        String[] headers1 = {
                "Tên nhân viên", "SĐT nhân viên", "Tên người hiến", "SĐT người hiến",
                "Tài khoản người hiến", "Ngày hiến máu", "Trạng thái đăng ký"
        };

        for (int i = 0; i < headers1.length; i++) {
            Cell cell = headerRow1.createCell(i);
            cell.setCellValue(headers1[i]);
        }


        int rowNum1 = 1;
        for (Object[] row : staffDonationReport) {
            Row dataRow = sheet1.createRow(rowNum1++);
            dataRow.createCell(0).setCellValue(row[0] != null ? row[0].toString() : "");
            dataRow.createCell(1).setCellValue(row[1] != null ? row[1].toString() : "");
            dataRow.createCell(2).setCellValue(row[2] != null ? row[2].toString() : "");
            dataRow.createCell(3).setCellValue(row[3] != null ? row[3].toString() : "");
            dataRow.createCell(4).setCellValue(row[4] != null ? row[4].toString() : "");
            dataRow.createCell(5).setCellValue(row[5] != null ? row[5].toString() : "");
            dataRow.createCell(6).setCellValue(row[6] != null ? row[6].toString() : "");
        }
        List<Object[]> staffEmergencyReport = userRepository.getStaffEmergencyDonationReport(Date.valueOf(request.getStartDate()),
                Date.valueOf(request.getEndDate()));
        Sheet sheet2 = workbook.createSheet("Báo cáo nhân viên đơn máu khẩn cấp");


        Row headerRow2 = sheet2.createRow(0);
        String[] headers2 = {
                "Tên nhân viên", "SĐT nhân viên", "Tên bệnh nhân", "SĐT bệnh nhân", "Ghi chú",
                "Tên người hiến", "SĐT người hiến", "Email",
                "Ngày hiến máu", "Trạng thái đăng ký"
        };

        for (int i = 0; i < headers2.length; i++) {
            Cell cell = headerRow2.createCell(i);
            cell.setCellValue(headers2[i]);
        }

        int rowNum = 1;
        for (Object[] row : staffEmergencyReport) {
            Row dataRow = sheet2.createRow(rowNum++);
            dataRow.createCell(0).setCellValue(row[0] != null ? row[0].toString() : "");
            dataRow.createCell(1).setCellValue(row[1] != null ? row[1].toString() : "");
            dataRow.createCell(2).setCellValue(row[2] != null ? row[2].toString() : "");
            dataRow.createCell(3).setCellValue(row[3] != null ? row[3].toString() : "");
            dataRow.createCell(4).setCellValue(row[4] != null ? row[4].toString() : "");
            dataRow.createCell(5).setCellValue(row[5] != null ? row[5].toString() : "");
            dataRow.createCell(6).setCellValue(row[6] != null ? row[6].toString() : "");
            dataRow.createCell(7).setCellValue(row[7] != null ? row[7].toString() : "");
            dataRow.createCell(8).setCellValue(row[8] != null ? row[8].toString() : "");
            dataRow.createCell(9).setCellValue(row[9] != null ? row[9].toString() : "");
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=staff_report.xlsx");

        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();
    }



    public List<StaffEmergencyReportDTO> getStaffEmergencyReport(ReportFilterRequestByDate request) {
        List<Object[]> result = userRepository.getStaffEmergencyDonationReport(Date.valueOf(request.getStartDate()),
                Date.valueOf(request.getEndDate()));
        List<StaffEmergencyReportDTO> staffEmergencyReportDTOList = new ArrayList<>();
        for (Object[] row : result) {
            String staffName = (String) row[0];
            String staffPhone = (String) row[1];
            String patientName = (String) row[2];
            String patientPhone = (String) row[3];
            String note = (String) row[4];
            String donorName = (String) row[5];
            String donorPhone = (String) row[6];
            String donorMail = (String) row[7];
            Date donationDate = (Date) row[8];
            String status = (String) row[9];
            staffEmergencyReportDTOList.add(new StaffEmergencyReportDTO(staffName, staffPhone,
                    patientName, patientPhone, note,
                    donorName, donorPhone, donorMail, donationDate, status));
        }
        return  staffEmergencyReportDTOList;
    }





    public List<BloodInventoryResponse> getBloodInventory() {
        List<BloodInventory> bloodTotalList = bloodInventoryRepository.findAll();

        return  bloodTotalList.stream()
                .map(allBloodBagInventory -> new BloodInventoryResponse(
                        allBloodBagInventory.getBloodTypeId(),
                        allBloodBagInventory.getTotalVolumeMl())).toList();
    }

    public void exportBloodInventoryReportToExcel( HttpServletResponse response) throws IOException {

        List<BloodInventory> data = bloodInventoryRepository.findAll();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Báo cáo kho máu");

        String[] headers = {"STT", "Nhóm Máu", "Số lượng"};

        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        int rowNum = 1;
        int index = 1;
        for (BloodInventory bi : data) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(index++);
            row.createCell(1).setCellValue(bi.getBloodTypeId());
            row.createCell(2).setCellValue(bi.getTotalVolumeMl());
            System.out.println(bi.getBloodTypeId());
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=donation_report.xlsx");

        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();
    }



    public  List<BloodDonationReportDTO> getDonationReport(ReportFilterRequestByDate request) {
        List<Object[]> result = bloodDonationScheduleRepository.getDonationReport(
                Date.valueOf(request.getStartDate()),
                Date.valueOf(request.getEndDate())
        );

        List<BloodDonationReportDTO>  bloodDonationReportDTOList = new ArrayList<>();

        for (Object[] row : result) {
            String donorName = ((String) row[0]);
            String donorPhone = ((String) row[1]);
            String donorEmail = ((String) row[2]);
            String donorAddress = ((String) row[3]);
            String bloodType = ((String) row[4]);
            int sendVolume = row[5] == null ? 0 : ((Number) row[5]).intValue();
            Date donationDate = ((Date) row[6]);
            String hospital = ((String) row[7]);
            String status = ((String) row[8]);
            bloodDonationReportDTOList.add(new BloodDonationReportDTO(donorName, donorPhone, donorEmail, donorAddress, bloodType, sendVolume, donationDate, hospital, status));
        }

        return  bloodDonationReportDTOList;
    }

    public void exportBloodDonationReportToExcel(ReportFilterRequestByDate request ,HttpServletResponse response) throws IOException {



        List<Object[]> reportData = bloodDonationScheduleRepository.getDonationReport( Date.valueOf(request.getStartDate()),
                Date.valueOf(request.getEndDate()));

        XSSFWorkbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Báo cáo đơn hiến máu");

        // Header
        Row headerRow = sheet.createRow(0);
        String[] headers = {
                "Tên người hiến", "SĐT người hiến", "Tài khoản", "Địa chỉ", "Nhóm máu",
                "Lượng máu hiến (ml)", "Ngày hiến máu", "Địa điểm hiến máu", "Trạng thái đăng ký"
        };
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }


        int rowNum = 1;
        for (Object[] row : reportData) {
            Row dataRow = sheet.createRow(rowNum++);
            dataRow.createCell(0).setCellValue(row[0] != null ? row[0].toString() : "");
            dataRow.createCell(1).setCellValue(row[1] != null ? row[1].toString() : "");
            dataRow.createCell(2).setCellValue(row[2] != null ? row[2].toString() : "");
            dataRow.createCell(3).setCellValue(row[3] != null ? row[3].toString() : "");
            dataRow.createCell(4).setCellValue(row[4] != null ? row[4].toString() : "");
            dataRow.createCell(5).setCellValue(row[5] != null ? row[5].toString() : "");
            dataRow.createCell(7).setCellValue(row[7] != null ? row[7].toString() : "");
            dataRow.createCell(8).setCellValue(row[8] != null ? row[8].toString() : "");
        }


        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=bao_cao_hien_mau.xlsx");

        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();

    }






}
