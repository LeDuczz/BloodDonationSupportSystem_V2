package com.example.BloodDonationSupportSystem.dto.searchdistanceDTO.response;




import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonorResponse {
    private String donorName;
    private String bloodType;
    private Date lastDonationDate;
    private String contact;
}
