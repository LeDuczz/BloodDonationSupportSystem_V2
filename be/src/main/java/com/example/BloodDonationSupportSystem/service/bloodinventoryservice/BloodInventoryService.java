package com.example.BloodDonationSupportSystem.service.bloodinventoryservice;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.bloodinventoryDTO.response.BloodInventoryResponse;

import com.example.BloodDonationSupportSystem.dto.emergencybloodrequestDTO.response.EmergencyBloodEntityResponse;
import com.example.BloodDonationSupportSystem.entity.BloodInventory;
import com.example.BloodDonationSupportSystem.entity.DonationProcessEntity;
import com.example.BloodDonationSupportSystem.entity.EmergencyBloodRequestEntity;
import com.example.BloodDonationSupportSystem.entity.UserEntity;
import com.example.BloodDonationSupportSystem.exception.ResourceNotFoundException;
import com.example.BloodDonationSupportSystem.repository.*;

import com.example.BloodDonationSupportSystem.service.emergencybloodrequestservice.EmergencyBloodRequestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class BloodInventoryService {
    @Autowired
    private BloodInventoryRepository bloodInventoryRepository;

    @Autowired
    private DonationEmergencyRepository donationEmergencyRepository;

    @Autowired
    private  DonationEmergencyRequestRepository donationEmergencyRequestRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DonationProcessRepository donationProcessRepository;

    @Autowired
    private EmergencyBloodRequestService emergencyBloodRequestService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<BloodInventoryResponse> getBloodBagList(){
        List<BloodInventory> bloodTotalList = bloodInventoryRepository.findAll();

        return  bloodTotalList.stream()
                .map(allBloodBagInventory -> new BloodInventoryResponse(
                        allBloodBagInventory.getBloodTypeId(),
                        allBloodBagInventory.getTotalVolumeMl())).toList();

    }

    public BloodInventoryResponse getBloodBagById(String bloodTypeId){
        BloodInventory bloodInventory = bloodInventoryRepository.findById(bloodTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood type not found with id: " + bloodTypeId));
        return new BloodInventoryResponse(
                bloodInventory.getBloodTypeId(),
                bloodInventory.getTotalVolumeMl());
    }

    private Optional<EmergencyBloodRequestEntity> handleRegisIdForEmergency(UUID donationRegisId){
        boolean existDonationResId = donationEmergencyRepository.existsByDonationRegistrationDonationRegistrationId(donationRegisId);
        if (!existDonationResId) {
            return Optional.empty();
        }
        return donationEmergencyRequestRepository.findEmergencyBloodRequestEntityByDonationRegistrationId(donationRegisId);
    }

    public BaseReponse<?> updateBloodVolume(String bloodTypeId, UUID donationRegisId, UUID processId, int volumeToAdd) {
        BloodInventory bloodInventory = bloodInventoryRepository.findById(bloodTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood type not found with id: " + bloodTypeId));

        Optional<EmergencyBloodRequestEntity>  emergencyBloodRequest = handleRegisIdForEmergency(donationRegisId);


        if (emergencyBloodRequest.isPresent()){
            emergencyBloodRequestService.updateFulfilledEmergencyRequests();
            return new BaseReponse<>(200, "Update blood volume successfully for emergency request", new EmergencyBloodEntityResponse(
                    emergencyBloodRequest.get().getEmergencyBloodRequestId(),
                    emergencyBloodRequest.get().getPatientName(),
                    emergencyBloodRequest.get().getPhoneNumber(),
                    emergencyBloodRequest.get().getLocationOfPatient(),
                    emergencyBloodRequest.get().getBloodType(),
                    emergencyBloodRequest.get().getVolumeMl(),
                    emergencyBloodRequest.get().getLevelOfUrgency(),
                    emergencyBloodRequest.get().getNote(),
                    emergencyBloodRequest.get().isFulfill(),
                    emergencyBloodRequest.get().getRegistrationDate(),
                    emergencyBloodRequest.get().getRegisteredByStaff().getUserId()
            ));
        }
        int updatedVolume = bloodInventory.getTotalVolumeMl() + volumeToAdd;
        bloodInventory.setTotalVolumeMl(updatedVolume);
        bloodInventoryRepository.save(bloodInventory);


        boolean checkUpdateUserBloodType = updateUserBloodType(processId);
        String message = checkUpdateUserBloodType
                ? "User has been updated with blood type from process"
                : "User already has a blood type set, no update needed";

        BloodInventoryResponse updatedBloodInventory = new BloodInventoryResponse(
                bloodInventory.getBloodTypeId(),
                bloodInventory.getTotalVolumeMl());
        return new BaseReponse<>(200, "Update blood volume successfully. " + message, updatedBloodInventory);

    }



    public boolean updateUserBloodType(UUID processId) {
        Optional<UserEntity> optionalUser = userRepository.findUserByProcessId(processId);
        boolean checkUser =false;
        if (!optionalUser.isPresent()) {
            return checkUser;
        }
        DonationProcessEntity process = donationProcessRepository.findById(processId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation Process not found with id: " + processId));
        UserEntity user = optionalUser.get();

        if (process.getBloodInventory() == null) {
            checkUser=false;
            return checkUser;
        }

        String bloodType = process.getBloodInventory().getBloodTypeId();
        if (bloodType == null) {
            checkUser=false;
            return checkUser;
        }

        user.setBloodType(bloodType);
        userRepository.save(user);
        checkUser=true;
        return checkUser;
    }



}



