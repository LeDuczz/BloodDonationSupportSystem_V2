package com.example.BloodDonationSupportSystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "blood_inventory")
public class BloodInventory {

    @Id
    @Column(name = "blood_type_id", length = 3)
    private String bloodTypeId;

    @Column(name = "total_volume_ml")
    private int totalVolumeMl;

    @OneToMany(mappedBy = "bloodInventory")
    private List<DonationProcessEntity> donationProcesses;

}
