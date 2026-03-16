package com.example.BloodDonationSupportSystem.service.smsservice;



import com.example.BloodDonationSupportSystem.utils.SpeedSMSUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;


@Service
public class SmsService {
    @Autowired
    private SpeedSMSUtils speedSMSUtils;

    @Value("${device}")
    private String device;

    @Value("${phonenumber.contact}")
    private String phoneNumberContact;

    public String sendSmsHealthReminder(String phoneNumber) {
        try {
            String message = String.format(
                    "Chao %s, cam on ban da hien mau. Theo doi suc khoe 48h toi. Neu co dau hieu bat thuong, hay den co so y te gan nhat. So L.H %s - Trung tam Hien mau",
                        phoneNumber, phoneNumberContact
            );



            return speedSMSUtils.sendSMS(phoneNumber, message, 2, device);
        } catch (IOException e) {
            e.printStackTrace();
            return "Send SMS fail" + e.getMessage();
        }

    }

    public String sendSmsSuccessRegistrationNotification(String phoneNumber, String completeDate) {

        try {
            String message = String.format(
                    "Chao %s, ban da hien mau thanh cong luc %s.Cam on ban da danh thoi gian va giup do. Nho an nhe, nghi ngoi day du. So lien he %s Cam on – Trung Tam Hien mau.",
                    phoneNumber, completeDate, phoneNumberContact
            );
            return speedSMSUtils.sendSMS(phoneNumber, message, 2, device);
        } catch (IOException e) {
            e.printStackTrace();
            return "Send SMS fail" + e.getMessage();
        }



    }

    public String sendRegistrationFailureNotification(String phoneNumber) {
        try {
            String message = String.format(
                    "Rat tiec %s, dang ky hien mau chua thanh cong do chua co lich phu hop. Mong ban tiep tuc dong hanh. LH %s – Trung tam Hien mau",
                    phoneNumber, phoneNumberContact
            );
            return speedSMSUtils.sendSMS(message, message, 2, device);
        } catch (IOException e) {
            e.printStackTrace();
            return "Send SMS fail" + e.getMessage();
        }
    }

    public String sendBloodDonationInvite(String bloodtype, String phoneNumber) {

        try {
            String bloodDisplay = convertBloodTypeSimple(bloodtype);
               String  message = String.format(
                    "Chao ban, benh vien dang can mau %s. Mong ban san long hien lai. Dang ky tren web Trung tam Hien mau. LH %s",
                       bloodDisplay, phoneNumberContact
            );

            return speedSMSUtils.sendSMS(phoneNumber, message, 2, device);
        } catch (Exception e) {
            e.printStackTrace();
            return "Send SMS fail: " + e.getMessage();
        }
    }

    public String sendThankYouForRegistration(String phoneNumber, String userName) {
        try {
            String message = String.format(
                    "Chào %s, cảm ơn bạn đã đăng ký hiến máu. Chúng tôi sẽ liên hệ khi cần. Mọi thắc mắc, gọi %s. Trung tâm Hiến máu.",
                    userName, phoneNumberContact
            );

            if (message.length() > 160) {
                message = String.format(
                        "Cam on %s da dang ky hien mau. Chung toi se lien he khi can. Moi lien he: %s - Trung tam Hien mau",
                        userName, phoneNumberContact
                );
            }

            return speedSMSUtils.sendSMS(phoneNumber, message, 2, device);
        } catch (IOException e) {
            e.printStackTrace();
            return "Send SMS fail: " + e.getMessage();
        }
    }

    public String sendThankYouForDonationBlood(String phoneNumber, String userName) {
        try {
            String message = String.format(
                    "Chào %s, cảm ơn bạn đã hiến máu hôm nay. Nghĩa cử của bạn đã giúp cứu sống nhiều người. Mọi hỗ trợ, gọi %s - Trung tâm Hiến máu.",
                    userName, phoneNumberContact
            );

            if (message.length() > 160) {
                message = String.format(
                        "Cam on %s da hien mau. Nghia cu cua ban vo cung quy gia. Moi ho tro lien he %s - Trung tam Hien mau.",
                        userName, phoneNumberContact
                );
            }

            return speedSMSUtils.sendSMS(phoneNumber, message, 2, device);
        } catch (IOException e) {
            e.printStackTrace();
            return "Send SMS fail: " + e.getMessage();
        }
    }


    public String convertBloodTypeSimple(String bloodtype) {
        if (bloodtype.endsWith("+")) {
            return bloodtype.replace("+", " cong");
        } else if (bloodtype.endsWith("-")) {
            return bloodtype.replace("-", " tru");
        } else {
            return bloodtype;
        }
    }

}