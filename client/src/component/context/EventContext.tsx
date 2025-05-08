import { createContext, useState } from 'react';

export const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [createEvent, setCreateEvent] = useState(false);
  const [registeredMembers,setRegisteredMembers] = useState(false);
  const [eventActionType, setEventActionType] = useState("Create A New Event");
  const [eventId, setEventId] = useState('');
  const [eventName,setEventName] = useState('');
  const [eventSection,setEventSection] = useState('');

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
