import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, IconButton, Badge, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import eventService from '../services/eventService'; 

const Navbar = () => {
  const [upcomingReminders, setUpcomingReminders] = useState(0);
  const location = useLocation();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await eventService.getEvents();
        const count = events.filter(event => {
          const reminderTime = new Date(event.reminderTime);
          return reminderTime > new Date(); 
        }).length;
        setUpcomingReminders(count);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []); 

  return (
    <div>
      
      <AppBar position="sticky">
        <Toolbar>
          <Container>
            <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
              Calendar App
            </Typography>
            <Button color="inherit" component={Link} to="/create-event">Create Event</Button>
            <Button color="inherit" component={Link} to="/events">Events</Button>
            <Button color="inherit" component={Link} to="/calendar">Calendar View</Button>

            <IconButton color="inherit" component={Link} to="/reminders">
              <Badge badgeContent={upcomingReminders} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>

     
      {location.pathname === '/' && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh', 
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h3" 
            color="primary" 
            sx={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: 2 }}
          >
            Welcome to Your Calendar App
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ fontStyle: 'italic', marginBottom: 4 }}
          >
            Manage your events with ease and stay on top of your schedule
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/create-event" 
            sx={{ marginBottom: 2 }}
          >
            Create Your First Event
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Navbar;
