import customAxios from "../config/axios";

const URL_API = import.meta.env.VITE_API_BASE_URL;

export const downloadCertificate = async (certificateId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${URL_API}/member/download/${certificateId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error:", errorText);
    throw new Error("Failed to download PDF");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "certificate.pdf";
  a.click();
  URL.revokeObjectURL(url);
};



export const fetchCertificates = async () => {
  const res = await customAxios.get("/member/certificates");
  return res.data.data; 
};