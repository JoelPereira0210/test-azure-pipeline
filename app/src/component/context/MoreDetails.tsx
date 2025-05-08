// import React, { createContext, useContext, useState, ReactNode } from 'react';

// // Define the context's state type
// interface MoreDetailsContextType {
//   showMoreDetails: boolean;
//   toggleDetails: () => void;
//   setShowMoreDetails: React.Dispatch<React.SetStateAction<boolean>>;
// }

// // Create the context with a default value of `undefined`
// export const MoreDetailsContext = createContext<MoreDetailsContextType | undefined>(undefined);

// interface MoreDetailsProviderProps {
//   children: ReactNode;
// }

// // Provider component
// export const MoreDetailsProvider: React.FC<MoreDetailsProviderProps> = ({ children }) => {
//   const [showMoreDetails, setShowMoreDetails] = useState<boolean>(true);

//   const toggleDetails = () => {
//     setShowMoreDetails((prev) => !prev);
//   };

//   return (
//     <MoreDetailsContext.Provider value={{ showMoreDetails, toggleDetails, setShowMoreDetails }}>
//       {children}
//     </MoreDetailsContext.Provider>
//   );
// };

// // Custom hook to use the context
// export const useMoreDetailsContext = (): MoreDetailsContextType => {
//   const context = useContext(MoreDetailsContext);

//   if (!context) {
//     throw new Error("useMoreDetailsContext must be used within a MoreDetailsProvider");
//   }

//   return context;
// };


import React, { createContext, useContext, useState, ReactNode } from 'react';



interface MoreDetailsContextType {
  showMoreDetails: boolean;
  toggleDetails: () => void;
  setShowMoreDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value
export const MoreDetailsContext = createContext<MoreDetailsContextType>({
  showMoreDetails: true,
  toggleDetails: () => {},
  setShowMoreDetails: () => {}
});

// Provider component
export const MoreDetailsProvider = ({ children }:any) => {
  const [showMoreDetails, setShowMoreDetails] = useState(true);

  const toggleDetails = () => {
    setShowMoreDetails((prev) => !prev);
  };

  return (
    <MoreDetailsContext.Provider value={{ showMoreDetails, toggleDetails,setShowMoreDetails }}>
      {children}
    </MoreDetailsContext.Provider>
  );
};