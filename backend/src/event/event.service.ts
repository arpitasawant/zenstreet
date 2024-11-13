
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../models/event.schema';
import { EventDto } from './event.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private readonly eventModel: Model<Event>) {}

  
  async getAllEvents(): Promise<Event[]> {
    try {
      const events = await this.eventModel.find().exec();
      return events || [];  
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to retrieve events');
    }
  }

  async getUpcomingReminders(): Promise<Event[]> {
    try {
      const events = await this.eventModel.find().exec();
      const upcomingEvents = events.filter((event) => {
        return event.reminderTime && new Date(event.reminderTime) > new Date(); 
      });
      return upcomingEvents;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw new InternalServerErrorException('Failed to fetch upcoming reminders');
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkReminders() {
    const events = await this.getUpcomingReminders();
    events.forEach(event => {
      if (new Date(event.reminderTime) <= new Date()) {
        console.log('Reminder for event:', event.title);
      }
    });
  }

  async createEvent(eventDto: EventDto): Promise<Event> {
    try {
      const newEvent = new this.eventModel(eventDto);
      return await newEvent.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  
  async updateEvent(id: string, eventDto: EventDto): Promise<Event> {
    try {
      const updatedEvent = await this.eventModel.findByIdAndUpdate(id, eventDto, { new: true }).exec();
      if (!updatedEvent) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }
      return updatedEvent;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  
  async deleteEvent(id: string): Promise<Event> {
    try {
      const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
      if (!deletedEvent) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }
      return deletedEvent;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete event');
    }
  }

 
  async snoozeReminder(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (event.reminderTime) {
      const snoozeTime = new Date(event.reminderTime);
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 10); 
      event.reminderTime = snoozeTime;
      await event.save();
    }

    return event;
  }

  
  async stopReminder(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    event.reminderTime = null; 
    await event.save();

    return event;
  }
}
