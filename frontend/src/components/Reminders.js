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
        const fetchedReminders = await eventService.getReminders();
        const upcomingReminders = fetchedReminders.filter(event => {
          const reminderTime = new Date(event.reminderTime);
          return reminderTime > new Date(); 
        });
        setReminders(fetchedReminders);
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

  const handleSnooze = async (reminderId) => {
    try {
      const reminder = reminders.find(reminder => reminder._id === reminderId);
      const snoozeTime = new Date(reminder.reminderTime);
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 10); 

      await eventService.updateReminder(reminderId, { reminderTime: snoozeTime.toISOString() });

      setReminderStatus(prevState => ({
        ...prevState,
        [reminderId]: 'snoozed',
      }));

      const updatedReminders = await eventService.getReminders();
      const updatedActiveReminders = updatedReminders.filter(event => {
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

  const handleStop = async (reminderId) => {
    try {
      await eventService.deleteReminder(reminderId); 

     
      setActiveReminders(prevState => prevState.filter(reminder => reminder._id !== reminderId));

      setReminderStatus(prevState => ({
        ...prevState,
        [reminderId]: 'stopped',
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
          activeReminders.map((reminder) => (
            <ListItem key={reminder._id}>
              <ListItemText
                primary={reminder.title}
                secondary={`Reminder Time: ${new Date(reminder.reminderTime).toLocaleString()}`}
              />
              {reminderStatus[reminder._id] !== 'stopped' && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSnooze(reminder._id)}
                    sx={{ marginRight: 2 }}
                  >
                    Snooze
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleStop(reminder._id)}
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
