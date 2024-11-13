import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Snackbar } from '@mui/material';
import eventService from '../services/eventService';

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [activeReminders, setActiveReminders] = useState([]);
  const [reminderStatus, setReminderStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchReminders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedEvents = await eventService.getEvents(); // Fetch events from the service
        const upcomingReminders = fetchedEvents.filter(event => {
          const reminderTime = new Date(event.reminderTime);
          return reminderTime > new Date();
        });
        setReminders(fetchedEvents);
        setActiveReminders(upcomingReminders);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        setError('Failed to fetch reminders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
    const interval = setInterval(fetchReminders, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSnooze = async (eventId) => {
    try {
      const event = reminders.find(event => event._id === eventId);
      const snoozeTime = new Date(event.reminderTime);
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 10);

      await eventService.updateEvent(eventId, { reminderTime: snoozeTime.toISOString() });

      setReminderStatus(prevState => ({
        ...prevState,
        [eventId]: 'snoozed',
      }));

      const updatedEvents = await eventService.getEvents();
      const updatedActiveReminders = updatedEvents.filter(event => {
        const reminderTime = new Date(event.reminderTime);
        return reminderTime > new Date();
      });
      setActiveReminders(updatedActiveReminders);

      setSnackbarMessage('Reminder snoozed successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error snoozing reminder:', error);
      setSnackbarMessage('Failed to snooze reminder.');
      setOpenSnackbar(true);
    }
  };

  const handleStop = async (eventId) => {
    try {
      await eventService.updateEvent(eventId, { reminderTime: null });

      setActiveReminders(prevState => prevState.filter(event => event._id !== eventId));

      setReminderStatus(prevState => ({
        ...prevState,
        [eventId]: 'stopped',
      }));

      setSnackbarMessage('Reminder stopped successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error stopping reminder:', error);
      setSnackbarMessage('Failed to stop reminder.');
      setOpenSnackbar(true);
    }
  };

  if (isLoading) {
    return <Typography>Loading reminders...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Upcoming Reminders</Typography>

      <List>
        {activeReminders.length === 0 ? (
          <Typography>No upcoming reminders.</Typography>
        ) : (
          activeReminders.map((event) => (
            <ListItem key={event._id}>
              <ListItemText
                primary={event.title}
                secondary={`Reminder Time: ${new Date(event.reminderTime).toLocaleString()}`}
              />
              {reminderStatus[event._id] !== 'stopped' && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSnooze(event._id)}
                    sx={{ marginRight: 2 }}
                  >
                    Snooze
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleStop(event._id)}
                  >
                    Stop
                  </Button>
                </>
              )}
            </ListItem>
          ))
        )}
      </List>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Reminder;
