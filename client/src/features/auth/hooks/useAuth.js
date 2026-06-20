import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context';
import { getMe, login, logout, register } from '../services/auth.api.js';

const resolveAuthErrorMessage = (err, fallback) => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.request) {
    // Request was sent but no response came back — server unreachable, CORS, etc.
    return 'Could not reach the server. Check your connection and try again.';
  }
  return fallback;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser, loading, setLoading, authError, setAuthError } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = resolveAuthErrorMessage(err, 'Unable to log in. Please try again.');
      setAuthError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = resolveAuthErrorMessage(err, 'Unable to create account. Please try again.');
      setAuthError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, []);

  return { user, loading, authError, handleRegister, handleLogin, handleLogout };
};
