import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import eventService from '../services/eventService';

const AddEventForm = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = { title, date, description, reminderTime };
    try {
      await eventService.createEvent(newEvent);
      setSuccessMessage('Event has been created successfully!');
      setTitle('');
      setDate('');
      setDescription('');
      setReminderTime('');
      onSave(); 
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setSuccessMessage('Error creating event. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Add Event</Typography>
      {successMessage && (
        <Typography variant="body1" color="success.main" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          margin="normal" 
        />
        <TextField
          label="Description"
          variant="outlined"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal" 
        />
        <TextField
          label="Date & Time"
          variant="outlined"
          name="date"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          required
          margin="normal" 
          InputLabelProps={{
            shrink: true, 
          }}
        />
        <TextField
          label="Reminder Time"
          variant="outlined"
          name="reminderTime"
          type="datetime-local"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          fullWidth
          margin="normal" 
          InputLabelProps={{
            shrink: true, 
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Save Event
        </Button>
      </form>
    </Box>
  );
};

export default AddEventForm;
