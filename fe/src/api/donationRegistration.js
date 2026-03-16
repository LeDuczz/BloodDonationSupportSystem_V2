import axios from "../config/axios";
import { apiResponse } from "../utils/apiHelper";

const API_URL = "/member";

export const registerDonation = async (data) => {
  return await apiResponse(() => axios.post(`${API_URL}/registration`, data));
};

export const cancelDonationRegistration = (donationRegistrationId) =>
  axios.put(`/staff/cancel-registration/${donationRegistrationId}`, {
    status: 'HỦY',
  });

export const getRegistrationList = () => axios.get("/staff/unassigned-list");

export const approveDonationRegistration = (donationRegistrationId) =>  
  axios.put(`/staff/assign-registration/${donationRegistrationId}`);

