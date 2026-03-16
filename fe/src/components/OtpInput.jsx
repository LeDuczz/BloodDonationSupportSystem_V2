import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';

const OtpInput = ({ length = 6, onChangeOtp }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (onChangeOtp) onChangeOtp(newOtp.join(''));

        
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (value && nextInput) {
            nextInput.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index]) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    return (
        <Box display="flex" gap={1} justifyContent="center">
            {otp.map((digit, idx) => (
                <TextField
                    key={idx}
                    id={`otp-input-${idx}`}
                    value={digit}
                    onChange={e => handleChange(e, idx)}
                    onKeyDown={e => handleKeyDown(e, idx)}
                    slotProps={{
                        input: {
                            maxLength: 1,
                            style: { textAlign: 'center', fontSize: '1.5rem' },
                        }
                    }}
                    sx={{ width: 50, textAlign: 'center', fontSize: '1.5rem' }}
                />
            ))}
        </Box>
    );
};

export default OtpInput;
