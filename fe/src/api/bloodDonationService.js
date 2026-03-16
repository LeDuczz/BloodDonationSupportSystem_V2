// fake API 
import axios from "axios";

export const getDonationRequestList = async () =>  {
    const response = await axios.get("http://localhost:3001/bloodRequestList");
    
}

