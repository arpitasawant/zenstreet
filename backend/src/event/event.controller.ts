
import { Controller, Get, Post, Put, Delete, Body, Param, Patch } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAllEvents() {
    const events = await this.eventService.getAllEvents();
    return events;  
  }

  @Post()
  async createEvent(@Body() eventDto: EventDto) {
    return await this.eventService.createEvent(eventDto);
  }

  @Patch(':id')
  async updateEvent(@Param('id') id: string, @Body() eventDto: EventDto) {
    console.log('Updating event with ID:', id);
    console.log('Event data:', eventDto);
    return await this.eventService.updateEvent(id, eventDto);
  }
  

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return await this.eventService.deleteEvent(id);
  }

  
  @Get('reminders')
  async getUpcomingReminders() {
    return await this.eventService.getUpcomingReminders();
  }

  
  @Patch(':id/snooze')
  async snoozeReminder(@Param('id') id: string) {
    return await this.eventService.snoozeReminder(id);
  }

  
  @Patch(':id/stop')
  async stopReminder(@Param('id') id: string) {
    return await this.eventService.stopReminder(id);
  }
}
