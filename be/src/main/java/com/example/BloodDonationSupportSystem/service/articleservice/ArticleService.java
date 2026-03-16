package com.example.BloodDonationSupportSystem.service.articleservice;

import com.example.BloodDonationSupportSystem.dto.articleDTO.request.ArticleRequest;
import com.example.BloodDonationSupportSystem.dto.articleDTO.response.ArticleResponse;
import com.example.BloodDonationSupportSystem.entity.ArticleEntity;
import com.example.BloodDonationSupportSystem.exception.ResourceNotFoundException;
import com.example.BloodDonationSupportSystem.repository.ArticleRepository;
import com.example.BloodDonationSupportSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.stereotype.Service;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;






    public ArticleResponse create(ArticleRequest request) throws IOException {
        ArticleEntity article = new ArticleEntity();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setCreatedAt(new Date());
        article.setStatus(request.getStatus());
        article.setArticleType(request.getArticleType());

        Path filePath = saveImage(request.getImageData(), request.getFileName());
        if(filePath != null) {
            article.setImageUrl(mapToUrl(filePath.toString()));
        }

        article.setCreatedByAdminId(userRepository.findById(request.getCreatedByAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found")));
        articleRepository.save(article);
        return mapToArticleResponse(article);
    }




    public ArticleResponse getById(UUID id) {
        return articleRepository.findById(id)
                .map(this::mapToArticleResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));
    }

    public List<ArticleResponse> getAll() {
        return articleRepository.findAll().stream().map(this::mapToArticleResponse).toList();
    }
    public List<ArticleResponse> getAllToView() {
        return articleRepository.findByStatus("ĐÃ DUYỆT").stream().map(this::mapToArticleResponse).toList();
    }


    public ArticleResponse update(UUID id, ArticleRequest request) throws IOException {
        ArticleEntity article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setCreatedAt(new Date());
        article.setStatus(request.getStatus());
        article.setArticleType(request.getArticleType());
        if(!article.getImageUrl().equals(mapToUrl(request.getImageData()))) {
            Path deletePath = mapToPath(article.getImageUrl());
            Files.deleteIfExists(deletePath);
            Path filePath = saveImage(request.getImageData(), request.getFileName());
            if(filePath != null) {
                article.setImageUrl(mapToUrl(filePath.toString()));
            }
        }else{
            article.setImageUrl(request.getImageData());
        }
        article.setCreatedByAdminId(userRepository.findById(request.getCreatedByAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found")));
        articleRepository.save(article);
        return mapToArticleResponse(article);
    }

    public String delete(UUID id) throws IOException {
        ArticleEntity article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));
        deleteImage(mapToPath(article.getImageUrl()));
        articleRepository.delete(article);
        return "Deleted Article";
    }



    private ArticleResponse mapToArticleResponse(ArticleEntity entity) {
        ArticleResponse response = new ArticleResponse();
        response.setId(entity.getArticleId());
        response.setTitle(entity.getTitle());
        response.setContent(entity.getContent());
        response.setStatus(entity.getStatus());
        response.setArticleType(entity.getArticleType());
        response.setImageUrl(entity.getImageUrl());
        return response;
    }

    private Path mapToPath(String url) {
        String pathText = url.replace("^/", "");
        return Paths.get(pathText);
    }
    private String mapToUrl(String path) {
        return path.replace("\\", "/");
    }

    private Path saveImage (String imageData, String fileName) throws IOException {
        if(imageData == null || imageData.isEmpty()) {
            return null;
        }else{
            String base64Image = imageData;

            if (base64Image.contains(",")) {
                base64Image = base64Image.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            Path uploadDir = Paths.get("images/uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            String filename = UUID.randomUUID().toString();
            Path filePath = uploadDir.resolve(filename);
            Files.write(filePath, imageBytes);
            return filePath;
        }
    }

    private void deleteImage(Path imagePath) throws IOException {
        Files.deleteIfExists(imagePath);
    }
}
