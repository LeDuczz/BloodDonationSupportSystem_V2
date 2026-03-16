package com.example.BloodDonationSupportSystem.controller;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.dto.articleDTO.request.ArticleRequest;
import com.example.BloodDonationSupportSystem.dto.articleDTO.response.ArticleResponse;
import com.example.BloodDonationSupportSystem.service.articleservice.ArticleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/")
@Tag(name = "ArticleController")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PutMapping("api/admin/article/{id}")
    public BaseReponse<?> update(@RequestBody @Valid ArticleRequest dto, @PathVariable UUID id) throws IOException {
        ArticleResponse response = articleService.update(id, dto);
        return new BaseReponse<>(HttpStatus.OK.value(), "Update article successfully", response);
    }

    @DeleteMapping("api/admin/article/{id}")
    public BaseReponse<?> delete(@PathVariable UUID id) throws IOException {
        String response = articleService.delete(id);
        return new BaseReponse<>(HttpStatus.OK.value(), "Delete article successfully", response);
    }

    @GetMapping("api/homepage/article/{id}")
    public BaseReponse<?> get(@PathVariable UUID id) {
        ArticleResponse response = articleService.getById(id);
        return new BaseReponse<>(HttpStatus.OK.value(), "Get article successfully", response);
    }

    @GetMapping("api/homepage/articles")
    public BaseReponse<?> getAllArticles() {
        List<ArticleResponse> response = articleService.getAllToView();
        return new BaseReponse<>(HttpStatus.OK.value(), "Get all articles successfully", response);
    }
    @GetMapping("api/admin/articles")
    public BaseReponse<?> getAllArticlesForAdmin() {
        List<ArticleResponse> response = articleService.getAll();
        return new BaseReponse<>(HttpStatus.OK.value(), "Get all articles successfully", response);
    }

    @PostMapping("api/admin/article/create")
    public BaseReponse<ArticleResponse> create(@RequestBody @Valid ArticleRequest req) throws IOException {
        ArticleResponse response = articleService.create(req);
        return new BaseReponse<>(HttpStatus.OK.value(), "Create article successfully", response);
    }


}
