package com.example.BloodDonationSupportSystem.service.scheduleservice;

import com.example.BloodDonationSupportSystem.dto.blooddonationscheduleDTO.BloodDonationScheduleDTO;
import com.example.BloodDonationSupportSystem.dto.donationregistrationDTO.StatByDateDTO;
import com.example.BloodDonationSupportSystem.entity.BloodDonationScheduleEntity;
import com.example.BloodDonationSupportSystem.entity.DonationRegistrationEntity;
import com.example.BloodDonationSupportSystem.exception.BadRequestException;
import com.example.BloodDonationSupportSystem.exception.ResourceNotFoundException;
import com.example.BloodDonationSupportSystem.repository.BloodDonationScheduleRepository;
import com.example.BloodDonationSupportSystem.repository.DonationRegistrationRepository;
import com.example.BloodDonationSupportSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BloodDonationScheduleService {

    @Autowired
    private DonationRegistrationRepository donationRegistrationRepository;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private BloodDonationScheduleRepository bloodDonationScheduleRepository;


    public List<StatByDateDTO> getStatByDate() {
        LocalDate today = LocalDate.now();
        List<StatByDateDTO> result = new ArrayList<>();

        for (int i = 0; i <= 30; i++) {
            LocalDate date = today.plusDays(i);
            Long count = donationRegistrationRepository.countByDateBetweenStartAndEndDate(date, "CHƯA HIẾN");
            result.add(new StatByDateDTO(date, count));
        }
        return result;
    }


    public BloodDonationScheduleDTO     createSchedule(BloodDonationScheduleDTO dto, UUID staffId) {

        BloodDonationScheduleEntity exist = bloodDonationScheduleRepository.findByAddressHospitalAndDonationDate(dto.getAddressHospital(), dto.getDonationDate());
        if (exist != null) {
            throw new ResourceNotFoundException("Schedule already exists");
        }

        BloodDonationScheduleEntity schedule = new BloodDonationScheduleEntity();
        schedule.setEditedByStaffId(userRepository.findById(staffId).orElseThrow(()-> new ResourceNotFoundException("Staff not found")));schedule.setDonationDate(dto.getDonationDate());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setAddressHospital(dto.getAddressHospital());
        schedule.setAmountRegistration(dto.getAmountRegistration());

        BloodDonationScheduleEntity saved = bloodDonationScheduleRepository.save(schedule);
        int matched = assignRegistrationsToSchedule(saved);
        BloodDonationScheduleDTO result = mapToDTO(saved);
        result.setRegistrationMatching(matched);

        return result;
    }




    public int assignRegistrationsToSchedule(BloodDonationScheduleEntity schedule) {
        List<DonationRegistrationEntity> eligibleRegistrations = donationRegistrationRepository.findEligibleRegistrations(schedule.getDonationDate(), "CHƯA HIẾN");

        int max = schedule.getAmountRegistration();

        List<DonationRegistrationEntity> selectedRegistration = eligibleRegistrations.stream().limit(max).toList();

        for (DonationRegistrationEntity registration : selectedRegistration) {
            registration.setBloodDonationSchedule(schedule);
        }

        donationRegistrationRepository.saveAll(selectedRegistration);

        return selectedRegistration.size();
    }


    public List<BloodDonationScheduleDTO> getAll() {
        LocalDate today = LocalDate.now();
        List<BloodDonationScheduleEntity> schedules = bloodDonationScheduleRepository.findAllByDonationDateBetween(today, today.plusDays(90));
        if (schedules.isEmpty()) {
            throw new ResourceNotFoundException("Schedules not found");
        }
        return schedules.stream().map(s -> mapToDTO(s)).toList();
    }

    public List<BloodDonationScheduleDTO> getSchedulesInDateRange(LocalDate startDate, LocalDate endDate) {
        List<BloodDonationScheduleEntity> schedules = bloodDonationScheduleRepository.findAllByDonationDateBetween(startDate, endDate);

        return schedules.stream()
                .map(s -> {
                    BloodDonationScheduleDTO dto = new BloodDonationScheduleDTO();
                    dto.setBloodDonationScheduleId(s.getBloodDonationScheduleId());
                    dto.setDonationDate(s.getDonationDate());
                    dto.setStartTime(s.getStartTime());
                    dto.setEndTime(s.getEndTime());
                    dto.setAddressHospital(s.getAddressHospital());
                    dto.setAmountRegistration(s.getAmountRegistration());
                    return dto;
                }).toList();
    }


    private BloodDonationScheduleDTO mapToDTO(BloodDonationScheduleEntity entity) {
        BloodDonationScheduleDTO dto = new BloodDonationScheduleDTO();
        dto.setBloodDonationScheduleId(entity.getBloodDonationScheduleId());
        dto.setDonationDate(entity.getDonationDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setAddressHospital(entity.getAddressHospital());
        dto.setAmountRegistration(entity.getAmountRegistration());
        int matchedCount = entity.getDonationRegistrations() != null ? entity.getDonationRegistrations().size() : 0;
        dto.setRegistrationMatching(matchedCount);
        dto.setEditedByStaffId(entity.getEditedByStaffId().getUserId());
        return dto;

    }


    public List<BloodDonationScheduleDTO> getAllByAdmin() {
        List<BloodDonationScheduleDTO> list = bloodDonationScheduleRepository.findAll().stream().map(s -> mapToDTO(s)).toList();
        if (list.isEmpty()) {
            throw new ResourceNotFoundException("Schedules not found");
        }
        return list;
    }

    public BloodDonationScheduleDTO updateSchedule(String id, BloodDonationScheduleDTO dto) {
        UUID scheduleIdUUID;
        try {
            scheduleIdUUID = UUID.fromString(id);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Fail to parse schedule id to UUID");
        }
        BloodDonationScheduleEntity entity = bloodDonationScheduleRepository.findById(scheduleIdUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));


        entity.setAddressHospital(dto.getAddressHospital());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());

        if (dto.getRegistrationMatching() < dto.getAmountRegistration()) {
            entity.setAmountRegistration(dto.getAmountRegistration());
        } else {
            throw new BadRequestException("Amount of edited registrations must be greater than or equal to amount of registrations");
        }


        BloodDonationScheduleEntity saved = bloodDonationScheduleRepository.save(entity);
        return mapToDTO(saved);



    }

    public void deleteSchedule(UUID id) {
        BloodDonationScheduleEntity entity = bloodDonationScheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));


        if (entity.getDonationRegistrations() != null && !entity.getDonationRegistrations().isEmpty()) {
            for (DonationRegistrationEntity registration : entity.getDonationRegistrations()) {
                registration.setBloodDonationSchedule(null);
            }
            donationRegistrationRepository.saveAll(entity.getDonationRegistrations());
        }

        bloodDonationScheduleRepository.delete(entity);
    }
}
