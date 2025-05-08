import { createContext, useState, ReactNode } from 'react';

export const MemberContext = createContext<any>(null);

interface MemberProviderProps {
  children: ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
  const [viewMembersForm, setViewMembersForm] = useState(false);
  const [MemberActionType, setMemberActionType] = useState<string>("Edit a member");
  const [contextUserId, setContextUserId] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  return (
    <MemberContext.Provider
      value={{
        viewMembersForm,
        setViewMembersForm, 
        MemberActionType, 
        setMemberActionType, 
        contextUserId, 
        setContextUserId, 
        step,
        setStep,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};