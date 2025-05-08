import { createContext, useState, ReactNode } from 'react';

export const ChargesContext = createContext<any>(null);

interface ChargesProviderProps {
  children: ReactNode;
}

export const ChargesProvider: React.FC<ChargesProviderProps> = ({ children }) => {
  const [createCharge, setCreateCharge] = useState<boolean>(false);
  const [chargeActionType, setChargeActionType] = useState<string>("Add new Charge/Fees");
  const [chargeId, setChargeId] = useState<string>('');
  const [chargeName, setChargeName] = useState<string>('');
  const [chargeMemberStatus, setChargeMemberStatus] = useState<boolean>(false);
  const [chargeSection, setChargeSection] = useState<string>('');

  return (
    <ChargesContext.Provider
      value={{
        createCharge,
        setCreateCharge,
        chargeActionType,
        setChargeActionType,
        chargeId,
        setChargeId,
        chargeName,
        setChargeName,
        chargeMemberStatus,
        setChargeMemberStatus,
        chargeSection,
        setChargeSection
      }}
    >
      {children}
    </ChargesContext.Provider>
  );
};