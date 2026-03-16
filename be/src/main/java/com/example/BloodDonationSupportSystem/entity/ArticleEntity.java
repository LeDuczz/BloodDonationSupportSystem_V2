package com.example.BloodDonationSupportSystem.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "article")
public class ArticleEntity {
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "article_id", columnDefinition = "uniqueidentifier")
    private UUID articleId;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "status")
    private String status;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "article_type")
    private String articleType;

    @ManyToOne
    @JoinColumn(name = "created_by_admin_id")
    private UserEntity createdByAdminId;



}
