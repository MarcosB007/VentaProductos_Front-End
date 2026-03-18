import { AuthProvider } from "./context/AuthContext";
import { AppRouter } from "./routes/AppRouter"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <AuthProvider>
      <AppRouter/>
    </AuthProvider>
  )
}

export default App
