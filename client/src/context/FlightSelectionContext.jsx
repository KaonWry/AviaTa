import React, { createContext, useContext, useState } from 'react';

const FlightSelectionContext = createContext();

export function FlightSelectionProvider({ children }) {
  const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <FlightSelectionContext.Provider value={{ selectedFlight, setSelectedFlight }}>
      {children}
    </FlightSelectionContext.Provider>
  );
}

export function useFlightSelection() {
  return useContext(FlightSelectionContext);
}
