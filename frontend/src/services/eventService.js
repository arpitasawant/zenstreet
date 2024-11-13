
import axios from 'axios';

const API_URL = process.env.APP_API_URL || 'http://localhost:5000';

// Events API
const getEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

const getEventsByID = async (id) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};

const createEvent = async (eventData) => {
  const response = await axios.post(`${API_URL}/events`, eventData);
  return response.data;
};

const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/events/${id}`);
  return response.data;
};

const updateEvent = async (id, eventData) => {
  try {
    const response = await axios.patch(`${API_URL}/events/${id}`, eventData); 
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error; 
  }
};


// Reminders API
const getReminders = async () => {
  const response = await axios.get(`${API_URL}/events/reminders`);
  return response.data;
};

const getReminderByID = async (id) => {
  const response = await axios.get(`${API_URL}/events/reminders/${id}`);
  return response.data;
};

const createReminder = async (reminderData) => {
  const response = await axios.post(`${API_URL}/events/reminders`, reminderData);
  return response.data;
};

const updateReminder = async (id, reminderData) => {
  const response = await axios.patch(`${API_URL}/events/reminders/${id}`, reminderData);
  return response.data;
};

const deleteReminder = async (id) => {
  const response = await axios.delete(`${API_URL}/events/${id}`);
  return response.data;
};

export default {
  // Event API
  getEvents,
  getEventsByID,
  createEvent,
  deleteEvent,
  updateEvent,

  // Reminder API
  getReminders,
  getReminderByID,
  createReminder,
  updateReminder,
  deleteReminder,
};
