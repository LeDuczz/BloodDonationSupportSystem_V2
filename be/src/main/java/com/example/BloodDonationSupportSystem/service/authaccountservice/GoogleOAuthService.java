package com.example.BloodDonationSupportSystem.service.authaccountservice;


import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.entity.OauthAccountEntity;
import com.example.BloodDonationSupportSystem.entity.RoleEntity;
import com.example.BloodDonationSupportSystem.entity.UserEntity;
import com.example.BloodDonationSupportSystem.repository.RoleRepository;
import com.example.BloodDonationSupportSystem.repository.UserRepository;
import com.example.BloodDonationSupportSystem.service.jwtservice.JwtService;
import com.example.BloodDonationSupportSystem.utils.CookieUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;



@Slf4j
@Service
@RequiredArgsConstructor
@CrossOrigin("*")
public class GoogleOAuthService {


    private static final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
    private static final String GOOGLE_PROVIDER = "google";

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Value("${google.redirect.uri}")
    private String redirectUri;


    private  RestTemplate restTemplate= new RestTemplate();

    @Autowired
    private final OauthService oauthService;
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final AuthAccountService authAccountService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private RoleRepository roleRepository;



    public BaseReponse<?> handleGoogleCallback(String credential, HttpServletResponse response) {
        try {
            //xác thực token đến từ google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken == null) {
                return new BaseReponse<>(
                        HttpStatus.BAD_REQUEST.value(),
                        "Invalid token",
                        null
                );
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String providerUserId = payload.getSubject();

           //lấy hoặc tạo người từ google
            var oauthAccountOpt = oauthService.getOauthAccount(GOOGLE_PROVIDER, providerUserId);
            UserEntity user = oauthAccountOpt.map(OauthAccountEntity::getUser)
                    .orElseGet(() -> createNewGoogleUser(name, email, providerUserId));

            String jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                    user.getUserId().toString() , "", Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getRoleName())))
            );
            String refreshToken = jwtService.generateRefreshToken(new org.springframework.security.core.userdetails.User(
                    user.getUserId().toString(), "", Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getRoleName())))
            );
            CookieUtils.addRefreshTokenCookie(response, refreshToken);

            return new BaseReponse<>(
                    HttpStatus.OK.value(),
                    "Login Google successful",
                    jwtToken
            );
        } catch (Exception e) {
            return new BaseReponse<>(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Login failed: " + e.getMessage(),
                    null
            );
        }
    }




    private UserEntity createNewGoogleUser(String name, String email, String providerUserId) {
        UserEntity user = new UserEntity();
        user.setFullName(name);
        user.setStatus("HOẠT ĐỘNG");




        RoleEntity memberRole = roleRepository.findByRoleName("ROLE_MEMBER")
                .orElseThrow(() -> new RuntimeException("ROLE_MEMBER not found"));
        user.setRole(memberRole);
        user = userRepository.save(user);

        OauthAccountEntity oauthAccount = new OauthAccountEntity();
        oauthAccount.setProvider(GOOGLE_PROVIDER);
        oauthAccount.setProviderUserId(providerUserId);
        oauthAccount.setCreatedAt(LocalDateTime.now());
        oauthAccount.setAccount(email);
        oauthAccount.setUser(user);
        oauthService.saveOauthAccount(oauthAccount);

        return user;
    }


    private String getGoogleAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    GOOGLE_TOKEN_URL,
                    request,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("Failed to get access token from Google. Status: {}", response.getStatusCode());
                throw new RuntimeException("Failed to get access token from Google");
            }

            Map<String, Object> body = response.getBody();
            if (body == null || !body.containsKey("access_token")) {
                log.error("No access_token found in Google's response");
                throw new RuntimeException("No access_token found in Google's response");
            }

            return (String) body.get("access_token");
        } catch (Exception e) {
            log.error("Error getting Google access token", e);
            throw new RuntimeException("Failed to get access token from Google", e);
        }
    }

    private Map<String, Object> getGoogleUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<?> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    GOOGLE_USER_INFO_URL,
                    HttpMethod.GET,
                    request,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("Failed to retrieve user info from Google. Status: {}", response.getStatusCode());
                throw new RuntimeException("Failed to retrieve user info from Google");
            }

            Map<String, Object> userInfo = response.getBody();
            if (userInfo == null) {
                log.error("User info response from Google is null");
                throw new RuntimeException("User info is null");
            }

            return userInfo;
        } catch (Exception e) {
            log.error("Error getting Google user info", e);
            throw new RuntimeException("Failed to retrieve user info from Google", e);
        }
    }
}
