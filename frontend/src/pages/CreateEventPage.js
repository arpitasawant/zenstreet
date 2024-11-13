import React, { useState } from 'react';
import AddEventForm from '../components/AddEventForm';
import { Box } from '@mui/material';

const CreateEventPage = () => {
  const [isEventSaved, setEventSaved] = useState(false);

  const handleSaveEvent = () => {
    setEventSaved(true);
   
  };

  return (
    <Box sx={{ padding: 2 }}>
      <AddEventForm onSave={handleSaveEvent} />
      {isEventSaved && <p></p>}
    </Box>
  );
};

export default CreateEventPage;
