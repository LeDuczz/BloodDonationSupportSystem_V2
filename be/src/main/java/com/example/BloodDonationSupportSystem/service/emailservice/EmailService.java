package com.example.BloodDonationSupportSystem.service.emailservice;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String email;

    public void sendHealthReminder(String username, String userEmail ) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(userEmail);
        helper.setSubject("Đăng Ký Hiến Máu Thành Công");
        String plainText = "Xin chào " + username + ",\n\n" +
                "Cảm ơn bạn đã tham gia hiến máu tình nguyện.\n\n" +
                "Vui lòng theo dõi tình trạng sức khỏe trong 48 giờ tới. " +
                "Nếu có dấu hiệu bất thường như chóng mặt, mệt mỏi kéo dài, hãy đến trung tâm y tế gần nhất.\n\n" +
                "Trân trọng,\n" +
                "Trung tâm Hiến máu";
        String htmlContent = """
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #d32f2f;">Cảm ơn bạn đã đăng ký hiến máu!</h2>
            <p>Xin chào <strong>%s</strong>,</p>
            <p>Trung tâm xin chân thành cảm ơn bạn đã tham gia hiến máu tình nguyện.</p>
            <p>
                Vui lòng theo dõi tình trạng sức khỏe của bạn trong vòng <strong>48 giờ tới</strong>. 
                Nếu có các dấu hiệu bất thường như <em>chóng mặt</em>, <em>mệt mỏi kéo dài</em>, 
                hãy đến trung tâm y tế gần nhất để kiểm tra.
            </p>
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng phản hồi email này hoặc liên hệ với chúng tôi:</p>
            <p style="margin-top: 32px;">Trân trọng,<br/>
            <strong>Trung tâm Hiến máu</strong></p>
        </div>
        """.formatted(username);

        helper.setText(plainText, htmlContent);
        helper.setFrom(email);

        mailSender.send(message);
    }


    public void sendSuccessRegistrationNotification(String username, String userEmail, String dateTime, String location) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(userEmail);
        helper.setSubject("Đăng ký hiến máu thành công – Cảm ơn bạn đã chung tay vì cộng đồng!");

        String plainText = "Xin chào " + username + ",\n\n" +
                "Chúc mừng bạn đã đăng ký hiến máu thành công!\n\n" +
                "Thời gian hiến máu: " + dateTime + "\n" +
                "Địa điểm hiến máu: " + location + "\n\n" +
                "Cảm ơn bạn đã dành thời gian và tấm lòng để giúp đỡ những người cần máu. " +
                "Mỗi đơn vị máu bạn hiến tặng sẽ góp phần cứu sống nhiều người bệnh và mang lại hy vọng cho họ.\n\n" +
                "Lưu ý quan trọng trước khi hiến máu:\n" +
                "- Ăn nhẹ và tránh sử dụng đồ uống có cồn trước khi hiến máu.\n" +
                "- Nghỉ ngơi đầy đủ và mang theo giấy tờ tùy thân khi đến địa điểm hiến máu.\n\n" +
                "Nếu có bất kỳ thắc mắc hoặc cần thay đổi thông tin đăng ký, vui lòng liên hệ:\n" +
                "Email: " + email + "\n\n" +
                "Một lần nữa xin cảm ơn tấm lòng nhân ái của bạn.\n\n" +
                "Trân trọng,\n" +
                "Trung tâm Hiến máu";
        String htmlContent = """
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #d32f2f;">Đăng ký hiến máu thành công – Cảm ơn bạn đã chung tay vì cộng đồng!</h2>
            <p>Xin chào <strong>%s</strong>,</p>
            <p>Chúc mừng bạn đã <strong>đăng ký hiến máu thành công</strong>!</p>
            <p>
                <strong>Thời gian hiến máu:</strong> %s<br/>
                <strong>Địa điểm hiến máu:</strong> %s
            </p>
            <p>
                Cảm ơn bạn đã dành thời gian và tấm lòng để giúp đỡ những người cần máu. 
                Mỗi đơn vị máu bạn hiến tặng sẽ góp phần cứu sống nhiều người bệnh và mang lại hy vọng cho họ.
            </p>
            <h4 style="color: #388e3c;">Lưu ý quan trọng trước khi hiến máu:</h4>
            <ul>
                <li>Ăn nhẹ và tránh sử dụng đồ uống có cồn trước khi hiến máu.</li>
                <li>Nghỉ ngơi đầy đủ và mang theo giấy tờ tùy thân khi đến địa điểm hiến máu.</li>
            </ul>
            <p>
                 Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ:<br/>
    
                <strong>Email:</strong> %s
               
            </p>
            <p style="margin-top: 32px;">Một lần nữa xin cảm ơn tấm lòng nhân ái của bạn.</p>
            <p style="margin-top: 16px;">Trân trọng,<br/>
            <strong>Trung tâm Hiến máu</strong></p>
        </div>
        """.formatted(username, dateTime, location, email);

        helper.setText(plainText, htmlContent);

        helper.setFrom(email);


        mailSender.send(message);
    }
    public void sendThankYouForRegistration(String username, String userEmail) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(userEmail);
        helper.setSubject("🎉 Cảm ơn bạn đã đăng ký hiến máu – Chúng tôi sẽ phản hồi sớm nhất!");

        String plainText = "Xin chào " + username + ",\n\n" +
                "Chúng tôi đã nhận được đăng ký hiến máu của bạn. \n\n" +
                "Trung tâm xin chân thành cảm ơn tấm lòng nhân ái của bạn. " +
                "Chúng tôi sẽ kiểm tra thông tin và phản hồi đến bạn trong thời gian sớm nhất có thể.\n\n" +
                "Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ:\n" +

                "Email: " + email + "\n\n" +
                "Trân trọng,\n" +
                "Trung tâm Hiến máu";

        String htmlContent = """
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #d32f2f;">Cảm ơn bạn đã đăng ký hiến máu!</h2>
            <p>Xin chào <strong>%s</strong>,</p>
            <p>Chúng tôi đã nhận được đăng ký hiến máu của bạn.</p>
            <p>
                Trung tâm xin chân thành cảm ơn tấm lòng nhân ái của bạn. 
                Chúng tôi sẽ kiểm tra thông tin và phản hồi đến bạn <strong>trong thời gian sớm nhất có thể</strong>.
            </p>
            <p>
                Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ:<br/>
               
                <strong>Email:</strong> %s
            </p>
            <p style="margin-top: 32px;">Trân trọng,<br/>
            <strong>Trung tâm Hiến máu</strong></p>
        </div>
        """.formatted(username,  email);

        helper.setText(plainText, htmlContent);
        helper.setFrom(email);
        mailSender.send(message);
    }

    public void sendRegistrationFailureNotification(String username, String userEmail) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(userEmail);
        helper.setSubject("Đơn đăng ký hiến máu không thành công – Hiện chưa có lịch phù hợp");

        String plainText = "Xin chào " + username + ",\n\n" +
                "Chúng tôi rất tiếc phải thông báo rằng đơn đăng ký hiến máu của bạn không thành công " +
                "vì hiện tại không có lịch hiến máu nào phù hợp với khoảng thời gian mà bạn đã chọn.\n\n" +
                "Bạn có thể truy cập hệ thống để đăng ký lại với một khoảng thời gian khác hoặc chờ đợi khi có lịch mới được cập nhật.\n\n" +
                "Cảm ơn bạn đã quan tâm và sẵn sàng đóng góp để giúp đỡ những người cần máu. " +
                "Chúng tôi hy vọng sẽ sớm đồng hành cùng bạn trong các chương trình hiến máu tiếp theo.\n\n" +
                "Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ:\n" +

                "Email: " + email + "\n\n" +
                "Trân trọng,\n" +
                "Trung tâm Hiến máu";

        String htmlContent = """
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #d32f2f;">Đơn đăng ký hiến máu không thành công</h2>
            <p>Xin chào <strong>%s</strong>,</p>
            <p>
                Chúng tôi rất tiếc phải thông báo rằng đơn đăng ký hiến máu của bạn <strong>không thành công</strong> 
                vì hiện tại không có lịch hiến máu nào phù hợp với khoảng thời gian mà bạn đã chọn.
            </p>
            <p>
                Bạn có thể truy cập hệ thống để đăng ký lại với một khoảng thời gian khác hoặc chờ đợi k/hi có lịch hiến máu mới được cập nhật.
            </p>
            <p>
                Cảm ơn bạn đã quan tâm và sẵn sàng đóng góp để giúp đỡ những người cần máu. 
                Chúng tôi hy vọng sẽ sớm đồng hành cùng bạn trong các chương trình hiến máu tiếp theo.
            </p>
            <p>
                Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ:<br/>
           
                <strong>Email:</strong> %s
            </p>
            <p style="margin-top: 32px;">Trân trọng,<br/>
            <strong>Trung tâm Hiến máu</strong></p>
        </div>
        """.formatted(username, email);

        helper.setText(plainText, htmlContent);

        helper.setFrom(email);

        mailSender.send(message);
    }

    public String sendEmailToDonationAgain(String userName,String bloodType, String contact) throws MessagingException {


        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(contact);
        helper.setSubject("Lời kêu gọi hiến máu – Cùng lan tỏa sự sống ");

        String plainText = "Xin chào " + userName + ",\n\n" +
                "Cảm ơn bạn đã đăng ký tham gia hiến máu trong thời gian qua.\n\n" +
                "Hiện tại, bệnh viện đang rất cần nhóm máu " + bloodType +
                ", và chúng tôi rất mong tiếp tục nhận được sự đồng hành của bạn trong các đợt hiến máu sắp tới.\n\n" +
                "Bạn có thể truy cập hệ thống để đăng ký lại vào thời gian phù hợp, hoặc chờ thông báo khi có lịch mới.\n\n" +
                "Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua địa chỉ email: " + email + "\n\n" +
                "Trân trọng,\n" +
                "Trung tâm Hiến máu";

        String htmlContent = """
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #b71c1c;">Lời kêu gọi hiến máu – Cùng lan tỏa sự sống</h2>
    <p>Xin chào <strong>%s</strong>,</p>
    <p>
        Cảm ơn bạn đã quan tâm và đăng ký tham gia hiến máu cùng chúng tôi trong thời gian qua.
    </p>
    <p>
        Hiện tại, <strong>bệnh viện đang cần nhóm máu %s</strong>. Chúng tôi rất mong tiếp tục nhận được sự đồng hành quý báu của bạn trong những đợt hiến máu sắp tới.
    </p>
    <p>
        Bạn có thể truy cập hệ thống để <strong>đăng ký lại</strong> với thời gian phù hợp, hoặc chờ thông báo khi có lịch mới được cập nhật.
    </p>
    <p>
        Mọi thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ:<br/>
        <strong>Email:</strong> %s
    </p>
    <p style="margin-top: 32px;">Trân trọng,<br/>
    <strong>Trung tâm Hiến máu</strong></p>
</div>
""".formatted(userName, bloodType, email);


        helper.setText(plainText, htmlContent);
        helper.setFrom(email);
        mailSender.send(message);

        return "Email send successfully to " + userName + " at email address" + contact;
    }


}
