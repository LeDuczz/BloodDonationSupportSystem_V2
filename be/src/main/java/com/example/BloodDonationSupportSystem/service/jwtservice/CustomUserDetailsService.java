package com.example.BloodDonationSupportSystem.service.jwtservice;

import com.example.BloodDonationSupportSystem.entity.UserEntity;
import com.example.BloodDonationSupportSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserEntity user = null;
        try {
            UUID uuid = UUID.fromString(username);
            user = userRepository.findByUserId(uuid).orElseThrow(() -> new UsernameNotFoundException("User not found" + username));
        } catch (IllegalArgumentException e) {
            user = userRepository.findByPhoneNumber(username).orElseThrow(() -> new UsernameNotFoundException("User not found with phone: " + username));
        }

        return new User(user.getUserId().toString(),
                user.getPasswordHash() == null ? "" : user.getPasswordHash(),
                user.getAuthorities());

    }


}
