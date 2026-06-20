import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './features/auth/auth.context';
import Protected from './features/auth/components/Protected';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import { InterviewProvider } from './features/interview/Interview.context';
import Home from './features/interview/pages/Home';
import Interview from './features/interview/pages/Interview';
import Landing from './features/landing/pages/Landing';

const App = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <Protected>
                <Home />
              </Protected>
            }
          />
          <Route
            path="/interview/:interviewId"
            element={
              <Protected>
                <Interview />
              </Protected>
            }
          />
        </Routes>
      </InterviewProvider>
    </AuthProvider>
  );
};

export default App;
