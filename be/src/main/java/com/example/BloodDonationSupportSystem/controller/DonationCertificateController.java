package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.certificateDTO.CertificateDTO;
import com.example.BloodDonationSupportSystem.service.donationcertificateservice.DonationCertificateService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/member")
@Tag(name = "Certificate")
public class DonationCertificateController {

    @Autowired
    private DonationCertificateService certificateService;

    @GetMapping("/download/{certificateId}")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable UUID certificateId) {
        byte[] pdf = certificateService.generatePdf(certificateId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }



    @GetMapping("/certificates")
    public BaseReponse<?> listCertificates() {
        List<CertificateDTO> response = certificateService.getAllCertificates();
        return new BaseReponse<>(HttpStatus.OK.value(), "Get certificates successfully!!!", response);
    }


}

