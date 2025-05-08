import { createContext, useState } from 'react';

export const ChargesContext = createContext(null);

export const ChargesProvider = ({ children }) => {
  const [createCharge, setCreateCharge] = useState(false);
  const [chargeActionType, setChargeActionType] = useState("Add new Charge/Fees");
  const [chargeId, setChargeId] = useState('');
  const [chargeName, setChargeName] = useState('');
  const [chargeMemberStatus,setChargeMemberStatus] = useState(false)
  const [chargeSection,setChargeSection] = useState('');

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
