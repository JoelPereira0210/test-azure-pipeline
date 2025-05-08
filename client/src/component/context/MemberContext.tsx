import { createContext, useState } from 'react';

export const MemberContext = createContext(null);

export const MemberProvider = ({ children }) => {
  const [viewMembersForm, setViewmembersForm] = useState(false);
  const [MemberActionType, setMemberActionType] = useState("Edit a member");
  const [contextUserId, setContextUserId] = useState('');
  const [step, setStep] = useState(1);
  return (
    <MemberContext.Provider
      value={{
        viewMembersForm, setViewmembersForm, MemberActionType, setMemberActionType, contextUserId, setContextUserId, step,
        setStep,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};
