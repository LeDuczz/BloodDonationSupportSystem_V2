package com.example.BloodDonationSupportSystem.service.authaccountservice;

import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.request.LoginRequest;
import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.request.RegisterRequest;
import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.response.GeoLocation;
import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.response.LoginAccountResponse;
import com.example.BloodDonationSupportSystem.dto.authenaccountDTO.response.RegisterAccountReponse;
import com.example.BloodDonationSupportSystem.entity.RoleEntity;
import com.example.BloodDonationSupportSystem.entity.UserEntity;
import com.example.BloodDonationSupportSystem.exception.BadRequestException;
import com.example.BloodDonationSupportSystem.exception.ResourceNotFoundException;
import com.example.BloodDonationSupportSystem.exception.UnauthorizedException;
import com.example.BloodDonationSupportSystem.repository.RoleRepository;
import com.example.BloodDonationSupportSystem.repository.UserRepository;
import com.example.BloodDonationSupportSystem.service.jwtservice.CustomUserDetailsService;
import com.example.BloodDonationSupportSystem.service.jwtservice.JwtService;
import com.example.BloodDonationSupportSystem.service.searchdistanceservice.SearchDistanceService;
import com.example.BloodDonationSupportSystem.utils.CookieUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthAccountService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private SearchDistanceService searchDistanceService;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    public RegisterAccountReponse register(RegisterRequest registerRequest) {
        RegisterAccountReponse response;
        if (userRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new BadRequestException("Phone number already in use");
        }

        UserEntity user = new UserEntity();
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        Optional<RoleEntity> roleMember = roleRepository.findByRoleName("ROLE_MEMBER");
        user.setRole(roleMember.orElseThrow(() -> new ResourceNotFoundException("Cannot find role")));
        user.setFullName(registerRequest.getFullName());
        user.setAddress(registerRequest.getAddress());
            if (user.getAddress() != null) {
                GeoLocation location = searchDistanceService.getCoordinates(registerRequest.getAddress());
                user.setLongitude(location.getLongitude());
                user.setLatitude(location.getLatitude());
            }
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        user.setGender(registerRequest.getGender());
        user.setStatus(registerRequest.getStatus());
        user.setCreatedAt(LocalDate.now());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getConfirmPassword()));
        userRepository.save(user);
        response = new RegisterAccountReponse();
        response.setMessage("Registration successful");


        return response;
    }

    public LoginAccountResponse authAccount(LoginRequest loginRequest, HttpServletResponse httpServletResponse) {

        LoginAccountResponse loginAccountResponse;
        UserEntity user = userRepository.findByPhoneNumber(loginRequest.getPhoneNumber()).orElseThrow(() -> new BadRequestException("PhoneNumber doesn't exist"));
        if (!user.getStatus().equals("HOẠT ĐỘNG")) {
            throw new BadRequestException("Account is locked or inactive!");
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getPhoneNumber(), loginRequest.getPassword()));
        } catch (Exception e) {
            throw new BadRequestException("Incorrect username or password!!!");
        }

        String token = jwtService.generateToken(new User(user.getUserId().toString(), user.getPasswordHash(), Collections.singleton(new SimpleGrantedAuthority(user.getRole().getRoleName()))));
        String refreshToken = jwtService.generateRefreshToken(new User(user.getUserId().toString(), user.getPasswordHash(), Collections.singleton(new SimpleGrantedAuthority(user.getRole().getRoleName()))));
        CookieUtils.addRefreshTokenCookie(httpServletResponse, refreshToken);

        loginAccountResponse = new LoginAccountResponse(token);
        return loginAccountResponse;


    }

    public void logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

    }

    public LoginAccountResponse refreshToken(String token) {

        try {
            if (token == null) {
                throw new UnauthorizedException("Token is missing");
            }

            Claims claims = jwtService.getClaims(token);
            String type = claims.get("type", String.class);
            if (!"refresh".equals(type)) {
                throw new UnauthorizedException("Invalid token type");
            }

            String username = jwtService.extractUsername(token);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

            if (!jwtService.isTokenValid(token, userDetails)) {
                throw new UnauthorizedException("Token is invalid or expired");
            }

            UserEntity user = userRepository.findByUserId(UUID.fromString(username))
                    .orElseThrow(() -> new ResourceNotFoundException("Cannot find user"));

            String newToken = jwtService.generateToken(
                    new User(user.getUserId().toString(),
                            user.getPasswordHash(),
                            Collections.singleton(new SimpleGrantedAuthority(user.getRole().getRoleName()))));

            return new LoginAccountResponse(newToken);

        } catch (JwtException | IllegalArgumentException | UnauthorizedException e) {
            throw new UnauthorizedException("Invalid refresh token");
        }

    }

}
