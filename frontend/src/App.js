import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Navbar from './components/Navbar';
import CreateEventPage from './pages/CreateEventPage';
import EventsPage from './pages/EventsPage';
import CalendarPage from './pages/CalendarPage';
import theme from './theme';
import Reminder from './components/Reminders';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Navbar />
      <Routes>
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/reminders" element={<Reminder />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
