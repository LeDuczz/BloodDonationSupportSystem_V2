import { Route, Routes } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import Home from "../pages/DefautPage/HomePage/Home.component";
import Contact from "../pages/DefautPage/ContactPage/Contact";
import News from "../pages/DefautPage/NewsPage/News";
import NewsDetail from "../pages/DefautPage/NewsPage/NewsDetail";
import QuestionAndAnswer from "../pages/DefautPage/Q&APage/Q&APage";
import LoginPage from "../pages/DefautPage/LoginPage/LoginPage";
import ForgotPasswordPage from "../pages/DefautPage/ForgotPasswordPage/ForgotPassword";
import RegisterPage from "../pages/DefautPage/RegisterPage/RegisterPage";
import MemberLayout from "../layouts/MemberLayout/MemberLayout";
import AppointmentHistory from "../pages/MemberPage/BloodDonateHistoryPage/AppointmentHistory";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import StaffLayout from "../layouts/StaffLayout/StaffLayout";
import Overview from "../pages/StaffPage/Overview";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import BloodDonationScheduleList from "../pages/DefautPage/BloodDonationSchedulePage/BloodDonationScheduleList";
import BloodDonationScheduleComponent from "../pages/StaffPage/BloodDonationSchedulePage/BloodDonationSchedule.Component";
import AppointmentDetail from "../pages/MemberPage/BloodDonateHistoryPage/AppoitmentDetail";

import AdminPosts from "../pages/AdminPage/managementhomepage/AdminPosts";

import ProfilePage from "../pages/MemberPage/ProfilePage/ProfilePage";
import UserManagement from "../pages/AdminPage/UserManagement/UserManagement";
import BloodStoragePage from "../pages/StaffPage/BloodDonationInventory/BloodStoragePage";
import FindDistancePage from "../pages/StaffPage/FindByDistance/FindDistancePage";
import BloodDonationRequestPage from "../pages/StaffPage/BloodDonationRequestPage/BloodDonationRequestPage";
import OverViewPage from "../pages/AdminPage/OverviewPage/OverViewPage";
import BloodDonateHistory from "../pages/MemberPage/BloodDonateHistoryPage/BloodDonateHistory";
import DonorHealthCheckPage from "../pages/StaffPage/ProcessManagement/DonorHealthCheckPage";
import DonorProcessPage from "../pages/StaffPage/ProcessManagement/DonorProcessPage";
import DonationManagement from "../pages/AdminPage/DonationManagement/DonationManagementPage";
import { Navigation } from "../pages/StaffPage/ProcessManagement/Navigation";
import ScheduleManagement from "../pages/AdminPage/ScheduleManagement/ScheduleManagementPage";
import EmergencyDonationPage from "../pages/StaffPage/EmergencyDonation/EmergencyDonationPage";
import Account from "../pages/AdminPage/Account";
import BloodDonationReport from "../pages/AdminPage/ReportPage/BloodDonationReport";
import BloodInventoryReport from "../pages/AdminPage/ReportPage/BloodInventoryReport";
import EmergencyBloodRequestReport from "../pages/AdminPage/ReportPage/EmergencyBloodRequestReport";
import StaffReport from "../pages/AdminPage/ReportPage/StaffReport";
import RegistrationPage from "../pages/StaffPage/RegistrationManagement/RegistrationPage";
import ProtectedRoute from "../routes/ProtectRoute";
import CertificatePage from "../pages/MemberPage/CertificatePage/CertificatePage";
import BloodDonationHistoryStaffPage from "../pages/StaffPage/bloodDonationHistory/BloodDonationHistoryStaffPage";

const CustomRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="q-a" element={<QuestionAndAnswer />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="reset-password" element={<ForgotPasswordPage />} />
        <Route path="signup" element={<RegisterPage />} />
        <Route path="event" element={<BloodDonationScheduleList />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* USER ROLE */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_MEMBER"]} />}>
        <Route path="/user/*" element={<MemberLayout />}>
          <Route path="appointment-histories" element={<AppointmentHistory />} />
          <Route path="appointment-histories/:id" element={<AppointmentDetail />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="certificate" element={<CertificatePage/>}/>
          <Route path="donation-histories" element={<BloodDonateHistory />} />
        </Route>
      </Route>

      {/* STAFF ROLE */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_STAFF"]} />}>
        <Route path="/staff/*" element={<StaffLayout />}>
          <Route path="" element={<RegistrationPage />}/>
          <Route path="storage/blood-bag-list" element={<BloodStoragePage />} />
          <Route path="find-by-distance" element={<FindDistancePage />} />
          <Route path="blood-donation-history" element={<BloodDonationHistoryStaffPage />} />
          <Route path="emergency" element={<EmergencyDonationPage />} />
          <Route path="request" element={<RegistrationPage />} />
          <Route path="blood-management/*" element={<Navigation />} >
            <Route path="health-check" element={<DonorHealthCheckPage />} />
            <Route index element={<DonorHealthCheckPage />} />
            <Route path="process" element={<DonorProcessPage />} />
          </Route>
          <Route path="donation-request" element={<BloodDonationRequestPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="blood-donation-schedule" element={<BloodDonationScheduleComponent />} />
        </Route>
        {/* <Route path="donation-request" element={<BloodDonationRequestPage />} /> */}
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="blood-donation-schedule"
          element={<BloodDonationScheduleComponent />}
        />
      </Route>

      {/* ADMIN ROLE */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="" element={<OverViewPage/>}/>
          <Route path="overview" element={<OverViewPage />} />
          <Route path="" element={<OverViewPage />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="account" element={<Account />} />
          <Route path="donation-report" element={<BloodDonationReport />} />
          <Route path="blood-inventory-report" element={<BloodInventoryReport />} />
          <Route path="emergency-request-report" element={<EmergencyBloodRequestReport />} />
          <Route path="staff-report" element={<StaffReport />} />
        </Route>
      </Route>

      {/* ERROR */}
      <Route path="/404" element={<ErrorPage />} />
    </Routes>
  );
};

export default CustomRoute;