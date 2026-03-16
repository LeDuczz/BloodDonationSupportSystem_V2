import axios from "../config/axios";

export const getDonationProcessApi = () => axios.get("/staff/process-list");

export const updateDonationProcessApi = (data) =>  axios.put(`/staff/update-process/${data.donationProcessId}`, data);