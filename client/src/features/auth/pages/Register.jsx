import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score; // 0-5
};

const strengthMeta = [
  { label: 'Very weak', color: 'error' },
  { label: 'Weak', color: 'error' },
  { label: 'Fair', color: 'warning' },
  { label: 'Good', color: 'warning' },
  { label: 'Strong', color: 'success' },
  { label: 'Excellent', color: 'success' },
];

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const strengthScore = useMemo(() => getPasswordStrength(password), [password]);
  const meta = strengthMeta[strengthScore];
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (/\S+@\S+\.\S+/.test(username)) {
      setError('Username cannot be an email address.');
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await handleRegister({ username, email, password });
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Stack spacing={0.75} sx={{ mb: 4 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            display: 'grid',
            placeItems: 'center',
            mb: 1.5,
            background: 'rgba(34,211,166,0.12)',
            border: '1px solid rgba(34,211,166,0.3)',
          }}
        >
          <BadgeOutlinedIcon sx={{ color: 'secondary.main' }} />
        </Box>
        <Typography variant="h4" sx={{ fontSize: '1.7rem' }}>
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Free to start — generate your first interview report in minutes.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.25}>
          <TextField
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="janedoe"
            required
            fullWidth
            autoComplete="off"
            helperText="No spaces or @ symbols — this isn't your email."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            fullWidth
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <Box>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              fullWidth
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      size="small"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {password.length > 0 && (
              <Box sx={{ mt: 1, px: 0.25 }}>
                <LinearProgress
                  variant="determinate"
                  value={(strengthScore / 5) * 100}
                  color={meta.color}
                  sx={{ height: 5, borderRadius: 4, mb: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Password strength: {meta.label}
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
            fullWidth
            autoComplete="new-password"
            error={passwordsMismatch}
            helperText={passwordsMismatch ? 'Passwords do not match' : ' '}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={submitting}
            sx={{ mt: 0.5, py: 1.4 }}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Create account'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3.5, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 600 }}>
          Log in
        </Link>
      </Typography>
    </AuthLayout>
  );
};

export default Register;
