import { useEffect } from "react";
import { Matrix } from "./components/Matrix";
import {
  MatrixStoreProvider,
  useMatrixStore,
} from "./contexts/MatrixStoreContext";
import { MATRIX_DEFAULTS } from "./constants/values";

function MatrixApp() {
  const matrixStore = useMatrixStore();

  const { M, N, X } = MATRIX_DEFAULTS;

  useEffect(() => {
    matrixStore.init(M, N, X);
  }, [matrixStore]);

  return (
    <div className="app-container">
      <Matrix />
    </div>
  );
}

function App() {
  return (
    <MatrixStoreProvider>
      <MatrixApp />
    </MatrixStoreProvider>
  );
}

export default App;
