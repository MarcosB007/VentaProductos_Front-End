import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import { AppRouter } from "./routes/AppRouter"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <AuthProvider>
      <CarritoProvider>
        <AppRouter/>
      </CarritoProvider>
    </AuthProvider>
  )
}

export default App
