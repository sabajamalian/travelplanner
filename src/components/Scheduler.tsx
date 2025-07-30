import React, { useState, useEffect } from 'react';
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  ViewsDirective,
  ViewDirective,
  EventSettingsModel,
  DragAndDrop,
  Resize,
  ActionEventArgs,
  EventClickArgs
} from '@syncfusion/ej2-react-schedule';
import { Event } from '../pages/Planner';

interface SchedulerProps {
  events: Event[];
  onEventCreate: (event: Event) => void;
  onEventEdit?: (event: Event) => void;
  onEventDelete?: (eventId: string) => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ events, onEventCreate, onEventEdit, onEventDelete }) => {
  const [scheduleData, setScheduleData] = useState<any[]>([]);

  // Convert our Event format to Syncfusion format
  useEffect(() => {
    const convertedEvents = events.map(event => ({
      Id: event.id,
      Subject: event.title,
      StartTime: new Date(new Date().setHours(event.hour, event.minute, 0, 0)),
      EndTime: new Date(new Date().setHours(
        parseInt(event.endTime.split(':')[0]),
        parseInt(event.endTime.split(':')[1]),
        0, 0
      )),
      Description: event.description || '',
      Location: event.location || '',
      IsAllDay: false
    }));
    setScheduleData(convertedEvents);
  }, [events]);

  const eventSettings: EventSettingsModel = {
    dataSource: scheduleData,
    fields: {
      id: 'Id',
      subject: { name: 'Subject' },
      startTime: { name: 'StartTime' },
      endTime: { name: 'EndTime' },
      description: { name: 'Description' },
      location: { name: 'Location' }
    }
  };

  const onActionComplete = (args: ActionEventArgs) => {
    if (args.requestType === 'eventCreated' && args.data && Array.isArray(args.data) && args.data.length > 0) {
      const newEvent = args.data[0] as any;
      const eventData: Event = {
        id: newEvent.Id.toString(),
        title: newEvent.Subject,
        startTime: `${newEvent.StartTime.getHours().toString().padStart(2, '0')}:${newEvent.StartTime.getMinutes().toString().padStart(2, '0')}`,
        endTime: `${newEvent.EndTime.getHours().toString().padStart(2, '0')}:${newEvent.EndTime.getMinutes().toString().padStart(2, '0')}`,
        hour: newEvent.StartTime.getHours(),
        minute: newEvent.StartTime.getMinutes(),
        description: newEvent.Description || '',
        location: newEvent.Location || ''
      };
      onEventCreate(eventData);
    }
  };

  const onEventClick = (args: EventClickArgs) => {
    console.log('Event clicked:', args.event);
    // You can add custom event click handling here
  };

  return (
    <div className="h-full w-full">
      <ScheduleComponent
        width="100%"
        height="100%"
        currentView="Week"
        selectedDate={new Date()}
        eventSettings={eventSettings}
        actionComplete={onActionComplete}
        eventClick={onEventClick}
        allowDragAndDrop={true}
        allowResizing={true}
        showQuickInfo={true}
        enableAdaptiveUI={true}
        cssClass="e-schedule-custom"
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize]} />
      </ScheduleComponent>
    </div>
  );
};

export default Scheduler; 