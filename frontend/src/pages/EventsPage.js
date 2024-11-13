import React, { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import { Box, Button, Typography, TextField } from '@mui/material';
import moment from 'moment';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);  
  const [editedEventData, setEditedEventData] = useState({
    title: '',
    date: '',
    description: '',
    reminderTime: '', 
  });

  useEffect(() => {
    async function fetchEvents() {
      const fetchedEvents = await eventService.getEvents();
      setEvents(fetchedEvents);
    }

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    await eventService.deleteEvent(id);
    setEvents(events.filter((event) => event._id !== id));
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setEditedEventData({
      title: event.title,
      date: event.date,
      description: event.description,
      reminderTime: event.reminderTime || '',  
    });
  };

  const handleUpdateEvent = async () => {
    if (editEvent) {
      const updatedEvent = await eventService.updateEvent(editEvent._id, editedEventData);
      setEvents(events.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      ));
      setEditEvent(null);  
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>

      {editEvent ? (
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Edit Event</Typography>
          <TextField
            label="Title"
            name="title"
            value={editedEventData.title}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Date"
            name="date"
            value={editedEventData.date}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={editedEventData.description}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Reminder Time"
            name="reminderTime"
            type="datetime-local"
            value={moment(editedEventData.reminderTime).format('YYYY-MM-DDTHH:mm') || ''}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Button onClick={handleUpdateEvent} variant="contained" sx={{ marginRight: 2 }}>
            Save
          </Button>
          <Button onClick={() => setEditEvent(null)} variant="outlined" color="secondary">
            Cancel
          </Button>
        </Box>
      ) : (
        events.map((event) => (
          <Box key={event._id} sx={{ marginBottom: 2 }}>
            <Typography variant="h6">{event.title}</Typography>
            <Typography>{moment(event.date).format('MMMM Do YYYY, h:mm a')}</Typography>
            {event.reminderTime && (
              <Typography variant="body2" color="textSecondary">
                Reminder: {moment(event.reminderTime).format('MMMM Do YYYY, h:mm a')}
              </Typography>
            )}
            <Button onClick={() => handleEditEvent(event)}
  sx={{
    marginRight: 2,
    backgroundColor: 'blue', 
    color: 'white', 
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  }}
>
  Edit
</Button>

<Button
  onClick={() => handleDeleteEvent(event._id)}
  sx={{
    backgroundColor: '#f44336', 
    color: 'white', 
    '&:hover': {
      backgroundColor: '#d32f2f', 
    },
  }}
  color="error"
>
  Delete
</Button>

          </Box>
        ))
      )}
    </Box>
  );
};

export default EventsPage;
