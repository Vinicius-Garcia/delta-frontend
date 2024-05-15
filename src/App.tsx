import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
//@ts-ignore
import Aluno from './pages/register/Aluno/Aluno.jsx';

import SignUp from './pages/Authentication/SignUp';

import { ToastContainer } from 'react-toastify';

interface User {
  client_id: Number;
  email: string;
  id: Number;
  is_active: boolean;
  is_admin: boolean;
  locals: Array<any>;
  user_type: string;
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null); // Modificação aqui

  useEffect(() => {
    var x: string | null = sessionStorage.getItem('user');
    if (x) {
      const userData: User = JSON.parse(x);
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <HashRouter>
        <Routes>
          <Route
            path="/register/register-aluno"
            element={
              <>
                <PageTitle title="Registrar Alunos" />
                <Aluno />
              </>
            }
          />

          <Route
            index
            path="/"
            element={
              <>
                <PageTitle title="Login" />
                <SignIn />
              </>
            }
          />
          <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Cadastrar" />
              <SignUp />
            </>
          }
        />
        </Routes>
      </HashRouter>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;
