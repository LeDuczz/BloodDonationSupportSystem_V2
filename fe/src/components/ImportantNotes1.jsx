import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

export default function ImportantNotes({ data }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();

  const handleChange = (index) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : null);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f9fbfd',
        padding: '40px 24px',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        color="#1a237e"
        gutterBottom
      >
        Lưu ý quan trọng
      </Typography>

      {data.map((note, index) => (
        <Accordion
          key={index}
          expanded={expandedIndex === index}
          onChange={handleChange(index)}
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: 'none',
            mb: 2,
            '&::before': { display: 'none' },
            border: '1px solid #e0e0e0',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              fontWeight: 'bold',
              color: '#1565c0',
              '& .MuiTypography-root': {
                fontWeight: 600,
              },
            }}
          >
            <Typography variant="subtitle1">{note.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 1 }}>{note.answer}</Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box textAlign="center" mt={3}>
        <Button
          variant="outlined"
          onClick={() => navigate('/q-a')}
          sx={{
            color: '#1565c0',
            borderColor: '#1565c0',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              borderColor: '#1565c0',
            },
          }}
        >
          Xem thêm &gt;&gt;
        </Button>
      </Box>
    </Box>
  );
}
