import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const EventDetailsModal = ({ open, event, onClose }) => {
  if (!event) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 4, backgroundColor: 'white', maxWidth: 400, margin: 'auto', marginTop: '15%' }}>
        <Typography variant="h6">Event Details</Typography>
        <Typography variant="body1"><strong>Title:</strong> {event.title}</Typography>
        <Typography variant="body2"><strong>Date:</strong> {event.date}</Typography>
        <Typography variant="body2"><strong>Description:</strong> {event.description}</Typography>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default EventDetailsModal;
