// import React, { createContext, useContext, useState, ReactNode } from 'react';

// // Define the context's state type
// interface MoreDetailsContextType {
//   showMoreDetails: boolean;
//   toggleDetails: () => void;
// }

// // Create the context with a default value of `undefined`
// const MoreDetailsContext = createContext<MoreDetailsContextType | undefined>(undefined);

// // Provider component
// export const MoreDetailsProvider = ({ children }: { children: ReactNode }) => {
//   const [showMoreDetails, setShowMoreDetails] = useState(true);

//   const toggleDetails = () => {
//     setShowMoreDetails((prev) => !prev);
//   };

//   return (
//     <MoreDetailsContext.Provider value={{ showMoreDetails, toggleDetails }}>
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



// Create the context with a default value of `undefined`
export const MoreDetailsContext = createContext(null);

// Provider component
export const MoreDetailsProvider = ({ children }) => {
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