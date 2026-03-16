 import axios from "../config/axios";


export const searchDonorsApi = (data) => axios.post("/staff/donors-search", data);


export const updateProcess = (data) => axios.put("/staff/update-process-is-passed/${id}", data);



export const bloodCheckProcessListApi=()=> axios.get("/staff/get-completed-donation-process-list/blood-checking");


export const updateProcessIsPassedApi=(processId,data)=> axios.put(`/staff/update-process-is-passed/${processId}`, data);


export const updateBloodVolumeApi =(bloodTypeId,data)=>axios.put(`/staff/update-blood-volume/${bloodTypeId}`,data);

export const sendInviteApi = (donorName,bloodType, contact) => 
  axios.post(`/staff/send-email-donation-again`, {
    donorName:donorName,
    bloodType:bloodType,
    contact:contact
  });


export const sendInviteSmSApi = (bloodType, contact) => 
  axios.post(`/staff/send-invite-sms`, {
    bloodType:bloodType,
    contact:contact
  });



  export const getAllHistoryForStaffApi=()=> axios.get("/staff/get-all-list-donation-history");
