import axios from "../config/axios";


export const getEmergencyRequests = () => axios.get("/emergencies-notification/emergency-cases");
export const createEmergencyRequest = (data) => axios.post("/staff/emergencies-notification/emergency-requests", data);