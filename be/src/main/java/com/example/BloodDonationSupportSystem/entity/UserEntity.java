package com.example.BloodDonationSupportSystem.entity;

import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name ="user_table")
public class UserEntity {
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "user_id", columnDefinition = "uniqueidentifier")
    private UUID userId;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;


    @Column(name = "full_name", columnDefinition = "nvarchar(255)")
    private String fullName;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "gender")
    private String gender;

    @Column(name = "blood_type")
    private String bloodType;

    @Column(name = "status")
    private String status;

    @Column(name="created_at")
    private LocalDate createdAt;

    @Column(name="updated_at")
    private LocalDate updatedAt;

    @Column(name="avatar_path")
    private String avatarPath;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private RoleEntity role;

    @OneToOne(mappedBy = "user")
    private OauthAccountEntity oauthAccount;

    @OneToMany(mappedBy = "createdByAdminId")
    private List<ArticleEntity> articles;

    @OneToMany(mappedBy = "editedByStaffId")
    private List<BloodDonationScheduleEntity> bloodDonationSchedules;

    @OneToMany(mappedBy = "donorCertificate")
    private List<DonationCertificateEntity> donorCertificates;

    @OneToMany(mappedBy = "screenedByStaff")
    private List<DonationRegistrationEntity> screenedDonationRegistrations;

    @OneToMany(mappedBy = "donorCertificate")
    private List<DonationCertificateEntity> donationCertificates;

    @OneToMany(mappedBy = "registeredByStaff")
    private List<EmergencyBloodRequestEntity> emergencyBloodRequests;

    @OneToMany(mappedBy = "donorHistory")
    private List<DonationHistoryEntity> donationHistories;


    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName;
        if (this.role == null || this.role.getRoleName() == null) {
            roleName = "ROLE_MEMBER";
        } else {
            roleName = this.role.getRoleName();
        }
        return List.of(new SimpleGrantedAuthority(roleName));
    }


}
