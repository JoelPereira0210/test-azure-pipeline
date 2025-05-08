import { createContext, useState, ReactNode } from 'react';

export const EventContext = createContext<any>(null);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [createEvent, setCreateEvent] = useState<boolean>(false);
  const [registeredMembers, setRegisteredMembers] = useState<boolean>(false);
  const [eventActionType, setEventActionType] = useState<string>("Create A New Event");
  const [eventId, setEventId] = useState<string>('');
  const [eventName, setEventName] = useState<string>('');
  const [eventSection, setEventSection] = useState<string>('');

  return (
    <EventContext.Provider
      value={{
        createEvent,
        setCreateEvent,
        eventActionType,
        setEventActionType,
        eventId,
        setEventId,
        registeredMembers,
        setRegisteredMembers,
        eventName,
        setEventName,
        eventSection,
        setEventSection
      }}
    >
      {children}
    </EventContext.Provider>
  );
};