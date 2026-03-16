import axios from "../config/axios";

export const getHealthChecksApi = () => axios.get("/staff/health-checks");

export const updateHealthCheckApi = (data) =>  axios.put(`/staff/update-health-check/${data.healthCheckId}`, data);


