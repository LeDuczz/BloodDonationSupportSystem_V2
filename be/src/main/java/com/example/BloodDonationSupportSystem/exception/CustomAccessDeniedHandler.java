package com.example.BloodDonationSupportSystem.exception;

import com.example.BloodDonationSupportSystem.base.BaseReponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        BaseReponse<?> body = new BaseReponse<>
                (HttpServletResponse.SC_FORBIDDEN,
                        "Forbidden: " + accessDeniedException.getMessage(),
                        null);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(body);
        response.getWriter().write(json);
    }
}
