import customAxios from "../config/axios";

export const getEmergencyCases = () => {
  return customAxios.get("/emergencies-notification/emergency-cases");
};

export const respondEmergencyRequest = (id) => {
  return customAxios.post(`/member/emergency-registrations?emergencyDonationId=${id}`);
};