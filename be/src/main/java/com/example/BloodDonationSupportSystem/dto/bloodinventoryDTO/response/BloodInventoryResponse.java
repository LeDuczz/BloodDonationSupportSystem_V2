package com.example.BloodDonationSupportSystem.dto.bloodinventoryDTO.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class BloodInventoryResponse {
    private String bloodBagId;
    private int totalVolmeMl;
}
