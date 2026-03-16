package com.example.BloodDonationSupportSystem.utils;

import jakarta.xml.bind.DatatypeConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Component
public class SpeedSMSUtils {

    @Value("${accessToken}")
    private String accessToken;

    @Value("${speedSMS.url}")
    private String speedSMSUrl;

    public String sendSMS(String to, String content, int type, String sender) throws IOException {
            String json = "{\"to\": [\"" + to + "\"], \"content\": \"" + EncodeNonAsciiCharacters(content) + "\", \"type\":" + type + ", \"brandname\":\"" + sender + "\"}";
            URL url = new URL(speedSMSUrl + "/sms/send");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            String userCredentials = accessToken + ":x";
            String basicAuth = "Basic " + DatatypeConverter.printBase64Binary(userCredentials.getBytes());
            conn.setRequestProperty("Authorization", basicAuth);
            conn.setRequestProperty("Content-Type", "application/json");

            conn.setDoOutput(true);
            try (DataOutputStream wr = new DataOutputStream(conn.getOutputStream())) {
                wr.writeBytes(json);
            }

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder buffer = new StringBuilder();
            String inputLine;

            while ((inputLine = in.readLine()) != null) {
                buffer.append(inputLine);
            }
            in.close();
            return buffer.toString();
        }

        private String EncodeNonAsciiCharacters(String value) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < value.length(); i++) {
                char c = value.charAt(i);
                int unit = (int) c;
                if (unit > 127) {
                    String hex = String.format("%04x", unit);
                    sb.append("\\u").append(hex);
                } else {
                    sb.append(c);
                }
            }
            return sb.toString();
        }
}
