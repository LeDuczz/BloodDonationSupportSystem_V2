package com.example.BloodDonationSupportSystem.service.donationregistrationservice;

import com.example.BloodDonationSupportSystem.dto.donationregistrationDTO.DonationRegistrationDTO;
import com.example.BloodDonationSupportSystem.entity.*;
import com.example.BloodDonationSupportSystem.exception.BadRequestException;
import com.example.BloodDonationSupportSystem.exception.ResourceNotFoundException;
import com.example.BloodDonationSupportSystem.repository.*;
import com.example.BloodDonationSupportSystem.service.emailservice.EmailService;
import com.example.BloodDonationSupportSystem.service.smsservice.SmsService;
import com.example.BloodDonationSupportSystem.utils.AuthUtils;
import com.example.BloodDonationSupportSystem.utils.DonationUtils;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DonationRegistrationService {
    @Autowired
    private DonationRegistrationRepository donationRegistrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BloodDonationScheduleRepository bloodDonationScheduleRepository;


    @Autowired
    private EmergencyBloodRequestRepository emergencyBloodRequestRepository;


    @Autowired
    private EmergencyDonationRepository emergencyDonationRepository;

    @Autowired
    private DonationUtils donationUtils;


    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private HealthCheckRepository healthCheckRepository;

    @Autowired
    private SmsService smsService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OauthAccountRepository oauthAccountRepository;

    public DonationRegistrationDTO registerEmergencyDonation(String emergencyRequestId) {
        UUID memberId = UUID.fromString(AuthUtils.getCurrentUser().getUsername());
        UUID emergencyRequestIdUUID = UUID.fromString(emergencyRequestId);
        UserEntity donor = userRepository.findByUserId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found"));


        EmergencyBloodRequestEntity emergencyBloodRequest = emergencyBloodRequestRepository.findById(emergencyRequestIdUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot found emergency request"));



        if (!isBloodTypeCompatible(donor.getBloodType(), emergencyBloodRequest.getBloodType())) {
            throw new BadRequestException("Your blood type is not compatible with the emergency request");
        }


        donationUtils.validateDonorEligibility(memberId);

        DonationRegistrationEntity registration = new DonationRegistrationEntity();
        registration.setRegistrationDate(LocalDate.now());
        registration.setStatus("CHƯA HIẾN");
        registration.setStartDate(LocalDate.now());
        LocalDate endDate = switch (emergencyBloodRequest.getLevelOfUrgency()) {
            case "CỰC KÌ KHẨN CẤP" -> LocalDate.now().plusDays(1);
            case "RẤT KHẨN CẤP" -> LocalDate.now().plusDays(2);
            default -> LocalDate.now().plusDays(3);
        };
        registration.setEndDate(endDate);
        registration.setDonor(donor);

        DonationRegistrationEntity saved = donationRegistrationRepository.save(registration);
        EmergencyDonationEntity emergencyLink = new EmergencyDonationEntity();
        emergencyLink.setDonationRegistration(saved);
        emergencyLink.setEmergencyBloodRequest(emergencyBloodRequest);
        emergencyLink.setAssignedDate(LocalDate.now());
        emergencyDonationRepository.save(emergencyLink);
        List<DonationRegistrationDTO> updatedList = getUnassignedRegistrations();
        DonationRegistrationDTO dto = updatedList.stream()
                .filter(item -> item.getDonationRegistrationId().equals(saved.getDonationRegistrationId()))
                .findFirst()
                .orElse(mapToDTO(saved));

        messagingTemplate.convertAndSend("/emergency/unassigned-list", dto);

        return dto;
    }

    private boolean isBloodTypeCompatible(String donorType, String recipientType) {
        if (donorType != null && recipientType != null) {
            return switch (recipientType) {
                case "O-" -> donorType.equals("O-");
                case "O+" -> donorType.equals("O-") || donorType.equals("O+");
                case "A-" -> donorType.equals("O-") || donorType.equals("A-");
                case "A+" -> List.of("O-", "O+", "A-", "A+").contains(donorType);
                case "B-" -> donorType.equals("O-") || donorType.equals("B-");
                case "B+" -> List.of("O-", "O+", "B-", "B+").contains(donorType);
                case "AB-" -> List.of("O-", "A-", "B-", "AB-").contains(donorType);
                case "AB+" -> true;
                default -> false;
            };
        } else {
            return false;
        }



    }

    public void updateCancelStatus(UUID registrationId) throws MessagingException {

        DonationRegistrationEntity registration = donationRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found."));
        registration.setStatus("HỦY");

        donationRegistrationRepository.save(registration);

        if (registration.getDonor().getPhoneNumber() != null) {
            smsService.sendRegistrationFailureNotification(registration.getDonor().getPhoneNumber());
        } else {
            Optional<UserEntity> user = userRepository.findByUserId(registration.getDonor().getUserId());
            if (user.isPresent()) {
                UserEntity u = user.get();
                OauthAccountEntity email = oauthAccountRepository.findByUser(u);
                emailService.sendRegistrationFailureNotification(registration.getDonor().getFullName(), email.getAccount());
            } else {
                throw new ResourceNotFoundException("User not found");
            }

        }
    }

    @Transactional
    public void updateScreenByStaff(UUID registrationId, UUID staffId) {

        DonationRegistrationEntity registration = donationRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Not found: " + registrationId));

        UserEntity staff = userRepository.findByUserId(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Not found: " + staffId));

        registration.setScreenedByStaff(staff);
        donationRegistrationRepository.save(registration);


        HealthCheckEntity healthCheck = new HealthCheckEntity();
        healthCheck.setHeight(0);
        healthCheck.setWeight(0);
        healthCheck.setHealthStatus("CHỜ ĐỢI");
        healthCheck.setDonationRegistrationHealthCheck(registration);
        healthCheckRepository.save(healthCheck);

    }

    public DonationRegistrationDTO create(DonationRegistrationDTO dto) {
        UserEntity donor = userRepository.findByUserId(dto.getDonorId()).orElseThrow(() -> new ResourceNotFoundException("Donor Not Found"));

        List<DonationRegistrationEntity> uncompleted = donationRegistrationRepository.findUncompletedRegistrations(donor.getUserId(), "CHƯA HIẾN");
        if (!uncompleted.isEmpty()) {
            throw new BadRequestException("You already have a pending registration!");
        }

        DonationRegistrationEntity latestRegistration = donationRegistrationRepository.findLatestRegistrationByDonor(donor.getUserId()).stream().findFirst().orElse(null);
        if (latestRegistration != null) {
            LocalDate today = LocalDate.now();
            LocalDate lastRegistrationDate = latestRegistration.getDateCompleteDonation();
            if (lastRegistrationDate != null && ChronoUnit.DAYS.between(lastRegistrationDate, today) < 90) {
                throw new BadRequestException("You have donated within the last 90 days. Please wait a little longer !!!");
            }
        }

        DonationRegistrationEntity entity = new DonationRegistrationEntity();
        entity.setRegistrationDate(LocalDate.now());
        entity.setStatus(dto.getStatus());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        if (dto.getBloodDonationScheduleId() != null) {
            BloodDonationScheduleEntity schedule = bloodDonationScheduleRepository.findById(dto.getBloodDonationScheduleId()).orElseThrow(() -> new ResourceNotFoundException("BloodDonationScheduleId not found"));
            entity.setBloodDonationSchedule(schedule);
        }


        entity.setDonor(userRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new RuntimeException("Donor not found")));


        return mapToDTO(donationRegistrationRepository.save(entity));
    }


    public DonationRegistrationDTO update(UUID id, DonationRegistrationDTO dto) {
        DonationRegistrationEntity entity = donationRegistrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DonationRegistration not found"));

        entity.setDateCompleteDonation(dto.getCompleteDonationDate());
        entity.setStatus(dto.getStatus());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());

        if (dto.getScreenedByStaffId() != null)
            entity.setScreenedByStaff(userRepository.findById(dto.getScreenedByStaffId()).orElse(null));

        if (dto.getBloodDonationScheduleId() != null)
            entity.setBloodDonationSchedule(bloodDonationScheduleRepository.findById(dto.getBloodDonationScheduleId()).orElse(null));

        return mapToDTO(donationRegistrationRepository.save(entity));
    }

    public void delete(UUID id) {
        try {
            DonationRegistrationEntity existing = donationRegistrationRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("DonationRegistration not found with id: " + id));
            donationRegistrationRepository.delete(existing);
        } catch (Exception e) {
            throw new BadRequestException("DonationRegistration not found with id: " + id);
        }

    }


    public DonationRegistrationDTO getById(UUID id) {
        DonationRegistrationEntity existing = donationRegistrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DonationRegistration not found with id: " + id));
        return mapToDTO(existing);
    }

    public List<DonationRegistrationDTO> getAll() {
        List<DonationRegistrationDTO> dtos;
        try {
            dtos = donationRegistrationRepository.findAll().stream().map(donationRegistrationEntity -> mapToDTO(donationRegistrationEntity)).toList();
        } catch (Exception e) {
            throw new ResourceNotFoundException("DonationRegistrations not found");
        }
        return dtos;
    }

    public List<DonationRegistrationDTO> getUnassignedRegistrations() {
        List<Object[]> registrations = donationRegistrationRepository.findByScreenedByStaffIsNull();

        return registrations.stream().map(row -> new DonationRegistrationDTO(
                UUID.fromString(row[0].toString()),                 // donation_registration_id
                row[1].toString(),                                  // full_name
                row[2] != null ? row[2].toString() : null,          // phone_number
                row[3] != null ? row[3].toString() : null,          // account
                row[4] != null ? row[4].toString() : null,          // level_of_urgency
                LocalDate.parse(row[5].toString()),                 // registration_date
                row[6] != null ? row[6].toString() : (row[7] != null ? row[7].toString() : null),          // address_hospital
                row[8] != null ? UUID.fromString(row[8].toString()) : null  // screened_by_staff_id
        )).toList();

    }


    private DonationRegistrationDTO mapToDTO(DonationRegistrationEntity entity) {
        DonationRegistrationDTO dto = new DonationRegistrationDTO();
        dto.setDonationRegistrationId(entity.getDonationRegistrationId());
        dto.setRegistrationDate(entity.getRegistrationDate());
        dto.setCompleteDonationDate(entity.getDateCompleteDonation());
        dto.setStatus(entity.getStatus());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        if (entity.getScreenedByStaff() != null)
            dto.setScreenedByStaffId(entity.getScreenedByStaff().getUserId());
        if (entity.getDonor() != null)
            dto.setDonorId(entity.getDonor().getUserId());
        if (entity.getBloodDonationSchedule() != null)
            dto.setBloodDonationScheduleId(entity.getBloodDonationSchedule().getBloodDonationScheduleId());
        return dto;
    }




}
