import axios from "axios";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import BloodeDonationEventCard from "./BloodDonationEventCard";


// Can need a fillter by date bar for user find easy 
export default function BloodDonationScheduleList () {
    // get all event Fake API 
    const [BloodDonationScheduleList, setBloodDonationScheduleList] = useState([]);
    useEffect (() => {
        const getBloodDonationScheduleList = async () => {
            try{
                const res = await axios.get('http://localhost:3001/BloodSchedule');
                
                if(res.data){
                    setBloodDonationScheduleList(res.data);
                }
            }catch(err){
            }
        }
        getBloodDonationScheduleList()
    },[])
    return ( 
        <Box margin={'100px'}>
            {BloodDonationScheduleList.map((item) => {
                return(<BloodeDonationEventCard key={item.id} item = {item}/>)
            })}
        </Box>
    );
}