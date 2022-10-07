import { ReactNode, createContext, useState } from 'react';

interface IApp {
  activeNavIndex: number | undefined;
  setActiveNavIndex: (index?: number) => void;
}

export const AppContext = createContext<IApp>({
  activeNavIndex: 0,
  setActiveNavIndex: () => {},
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeNavIndex, setActiveNavIndex] = useState<number | undefined>();

  return (
    <AppContext.Provider value={{ activeNavIndex, setActiveNavIndex }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
