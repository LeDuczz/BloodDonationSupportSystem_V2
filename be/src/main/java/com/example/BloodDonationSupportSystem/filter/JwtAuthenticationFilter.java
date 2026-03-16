package com.example.BloodDonationSupportSystem.filter;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.example.BloodDonationSupportSystem.service.jwtservice.CustomUserDetailsService;
import com.example.BloodDonationSupportSystem.service.jwtservice.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    private static final String EXCEPTION_ATTRIBUTE = "exception";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authorizationHeader.substring(7);

        final String username;

        try {
            username = jwtService.extractUsername(token);
        }catch (Exception e){
            request.setAttribute(EXCEPTION_ATTRIBUTE, new BadCredentialsException("Invalid JWT token format"));
            throw new BadCredentialsException("Invalid JWT token format");
        }

        if(username == null){
            request.setAttribute(EXCEPTION_ATTRIBUTE, new BadCredentialsException("Invalid JWT token"));
            throw new BadCredentialsException("Invalid JWT token");
        }

        if(SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            if(!jwtService.isTokenValid(token, userDetails)){
                request.setAttribute(EXCEPTION_ATTRIBUTE, new BadCredentialsException("JWT token is expired or invalid"));
                throw new BadCredentialsException("JWT token is expired or invalid");
            }

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }

}
