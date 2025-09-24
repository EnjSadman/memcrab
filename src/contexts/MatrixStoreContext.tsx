import { createContext, useContext, useMemo, ReactNode } from "react";
import { MatrixStore } from "../lib/MatrixStore";

const MatrixStoreContext = createContext<MatrixStore | null>(null);

interface MatrixStoreProviderProps {
  children: ReactNode;
}

export const MatrixStoreProvider = ({ children }: MatrixStoreProviderProps) => {
  const store = useMemo(() => new MatrixStore(), []);

  return (
    <MatrixStoreContext.Provider value={store}>
      {children}
    </MatrixStoreContext.Provider>
  );
};

export const useMatrixStore = (): MatrixStore => {
  const store = useContext(MatrixStoreContext);

  if (!store) {
    throw new Error("useMatrixStore must be used within a MatrixStoreProvider");
  }

  return store;
};
