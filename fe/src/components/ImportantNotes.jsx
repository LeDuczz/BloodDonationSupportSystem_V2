import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export default function ImportantNotes({data}) {
  const [expanded, setExpanded] = React.useState('panel0');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" align="center" fontWeight={700} color="primary" mb={3}>
        Lưu ý quan trọng
      </Typography>
      {data.map((item, idx) => (
        <Accordion
          key={item.question}
          expanded={expanded === `panel${idx}`}
          onChange={handleChange(`panel${idx}`)}
          sx={{ mb: 2, borderRadius: 2, boxShadow: 0, border: '1px solid #e0e0e0' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${idx}-content`}
            id={`panel${idx}-header`}
          >
            <Typography variant="h6" fontWeight={600} color="primary">
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            onClick={() => {
              if (expanded === `panel${idx}`) setExpanded(false);
            }}
            sx={{ cursor: 'pointer' }}
          >
            {item.answer}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
} 