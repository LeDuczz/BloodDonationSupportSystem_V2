package com.example.BloodDonationSupportSystem.service.donationcertificateservice;

import com.example.BloodDonationSupportSystem.dto.certificateDTO.CertificateDTO;
import com.example.BloodDonationSupportSystem.entity.*;
import com.example.BloodDonationSupportSystem.exception.BadRequestException;
import com.example.BloodDonationSupportSystem.repository.DonationCertificateRepository;
import com.example.BloodDonationSupportSystem.repository.EmergencyDonationRepository;
import com.example.BloodDonationSupportSystem.repository.OauthAccountRepository;
import com.example.BloodDonationSupportSystem.utils.AuthUtils;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DonationCertificateService {
    @Autowired
    private EmergencyDonationRepository emergencyDonationRepository;

    @Autowired
    private DonationCertificateRepository donationCertificateRepository;

    @Autowired
    private OauthAccountRepository oauthAccountRepository;

    public List<CertificateDTO> getAllCertificates() {
        UUID memberId;
        try {
            memberId = UUID.fromString(AuthUtils.getCurrentUser().getUsername());
        } catch (Exception e) {
            throw new BadRequestException("Invalid user id");
        }

        List<DonationCertificateEntity> certificates = donationCertificateRepository.findByDonorCertificate_UserId(memberId);

        return certificates.stream().map(this::mapToDTO).toList();
    }

    private CertificateDTO mapToDTO(DonationCertificateEntity certificate) {
        CertificateDTO dto = new CertificateDTO();
        DonationRegistrationEntity registration = certificate.getDonationRegistrationCertificate();

        if (registration.getBloodDonationSchedule() != null) {
            dto.setRegistrationDate(registration.getBloodDonationSchedule().getDonationDate());
            dto.setHospital(registration.getBloodDonationSchedule().getAddressHospital());
        } else {
            emergencyDonationRepository.findByDonationRegistration_DonationRegistrationId(registration.getDonationRegistrationId())
                    .ifPresent(emergency -> {
                        dto.setRegistrationDate(emergency.getAssignedDate());
                        dto.setHospital(emergency.getEmergencyBloodRequest().getLocationOfPatient());
                    });
        }
        dto.setTypeCertificate(certificate.getTypeCertificate());
        dto.setCertificateId(certificate.getCertificateId());
        dto.setIssuedAt(certificate.getIssuedAt());
        return dto;
    }

    public byte[] generatePdf(UUID certificateId) {
        DonationCertificateEntity cert = donationCertificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        UserEntity user = cert.getDonorCertificate();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        PdfWriter writer = PdfWriter.getInstance(document, outputStream);
        document.open();


        Font titleFont = new Font(Font.HELVETICA, 22, Font.BOLD, new Color(200, 0, 0));
        Font labelFont = new Font(Font.HELVETICA, 12, Font.NORMAL, new Color(60, 60, 60));
        Font valueFont = new Font(Font.HELVETICA, 12, Font.NORMAL, new Color(50, 50, 50));
        Font thankFont = new Font(Font.HELVETICA, 13, Font.ITALIC, new Color(0, 102, 102));
        Font codeFont = new Font(Font.HELVETICA, 8, Font.ITALIC, Color.GRAY);


        PdfContentByte canvas = writer.getDirectContentUnder();
        Rectangle rect = new Rectangle(40, 40, 555, 802); // gần full A4
        rect.setBorder(Rectangle.BOX);
        rect.setBorderWidth(1.5f);
        rect.setBorderColor(new Color(220, 220, 220));
        canvas.rectangle(rect);


        Paragraph title = new Paragraph("GIẤY CHỨNG NHẬN HIẾN MÁU", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20f);
        document.add(title);


        LineSeparator separator = new LineSeparator();
        separator.setLineColor(new Color(180, 0, 0));
        document.add(new Chunk(separator));

        document.add(new Paragraph("\nChúng tôi trân trọng xác nhận rằng:", valueFont));


        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(15f);
        table.setWidths(new int[]{30, 70});

        addCell(table, "Họ tên:", labelFont);
        addCell(table, user.getFullName(), valueFont);


        if (user.getPhoneNumber() != null) {
            addCell(table, "Số điện thoại:", labelFont);
            addCell(table, user.getPhoneNumber(), valueFont);
        } else {
            OauthAccountEntity email = oauthAccountRepository.findByUser(user);
            addCell(table, "Email:", labelFont);
            addCell(table, email.getAccount(), valueFont);
        }


        addCell(table, "Nhóm máu:", labelFont);
        addCell(table, user.getBloodType(), valueFont);

        addCell(table, "Ngày hiến máu:", labelFont);
        addCell(table, cert.getDonationRegistrationCertificate().getRegistrationDate()
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), valueFont);

        addCell(table, "Địa điểm:", labelFont);
        String hospital = null;

        DonationRegistrationEntity registration = cert.getDonationRegistrationCertificate();

        if (registration.getBloodDonationSchedule() != null) {
            hospital = registration.getBloodDonationSchedule().getAddressHospital();
        } else {
            Optional<EmergencyDonationEntity> emergencyOpt =
                    emergencyDonationRepository.findByDonationRegistration_DonationRegistrationId(registration.getDonationRegistrationId());

            if (emergencyOpt.isPresent() && emergencyOpt.get().getEmergencyBloodRequest() != null) {
                hospital = emergencyOpt.get().getEmergencyBloodRequest().getLocationOfPatient();
            }
        }
        addCell(table, hospital, valueFont);

        addCell(table, "Loại chứng nhận:", labelFont);
        addCell(table, cert.getTypeCertificate(), valueFont);

        addCell(table, "Ngày cấp:", labelFont);
        addCell(table, cert.getIssuedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), valueFont);

        document.add(table);


        Paragraph thank = new Paragraph(
                "\nCảm ơn bạn đã tham gia hiến máu tình nguyện.\nHành động cao đẹp này đã góp phần cứu sống nhiều người.",
                thankFont);
        thank.setAlignment(Element.ALIGN_CENTER);
        thank.setSpacingBefore(25f);
        document.add(thank);


        document.add(new Paragraph("\n\n"));
        Paragraph sign = new Paragraph("TRUNG TÂM HIẾN MÁU", labelFont);
        sign.setAlignment(Element.ALIGN_RIGHT);
        sign.setSpacingBefore(30f);
        document.add(sign);

        Paragraph code = new Paragraph("Mã chứng nhận: " + cert.getCertificateId(), codeFont);
        code.setAlignment(Element.ALIGN_RIGHT);
        code.setSpacingBefore(30f);
        document.add(code);

        document.close();
        return outputStream.toByteArray();
    }


    private void addCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(5);
        table.addCell(cell);
    }



}