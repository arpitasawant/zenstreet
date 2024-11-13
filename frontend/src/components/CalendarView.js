import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import eventService from '../services/eventService'; 

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEvents();

        console.log('Raw events from API:', response); 

        const formattedEvents = response.map((event) => {
          const { title, date } = event;
          if (!title || !date) {
            console.warn('Event missing required fields:', event);
          }

          const startDate = moment(date, moment.ISO_8601, true); 
          const endDate = startDate.isValid()
            ? startDate.add(1, 'hour') 
            : moment().add(1, 'hour'); 

          return {
            title: title || 'Untitled Event', 
            start: startDate.isValid() ? startDate.toDate() : moment().toDate(),
            end: endDate.toDate(),
          };
        });

        console.log('Formatted events for Calendar:', formattedEvents); 
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Calendar View
      </Typography>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, margin: '50px 0' }}
      />
    </Container>
  );
};

export default CalendarView;
