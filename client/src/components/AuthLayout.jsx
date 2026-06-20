import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

const features = [
  'AI-generated technical & behavioral questions',
  'Personalized skill-gap analysis',
  'A day-by-day prep plan built for your target role',
];

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
      }}
    >
      {/* Left brand panel — hidden on small screens */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '42%',
          p: 6,
          borderRight: '1px solid',
          borderColor: 'divider',
          background:
            'linear-gradient(160deg, rgba(91,140,255,0.10), rgba(34,211,166,0.05) 60%, transparent)',
        }}
      >
        <Stack
          component={RouterLink}
          to="/"
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #5b8cff, #3f6bdb)',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            HireMind
          </Typography>
        </Stack>

        <Box>
          <Typography variant="h3" sx={{ mb: 2, fontSize: { md: '2.1rem', lg: '2.4rem' } }}>
            Walk into every interview already prepared.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420 }}>
            HireMind reads your resume and the job description, then builds the exact prep plan
            you need — questions, gaps, and a schedule to close them.
          </Typography>

          <Stack spacing={1.75}>
            {features.map((f) => (
              <Stack key={f} direction="row" spacing={1.25} alignItems="flex-start">
                <Box
                  sx={{
                    mt: '6px',
                    width: 7,
                    height: 7,
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #5b8cff, #22d3a6)',
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {f}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} HireMind. Built to help you land the offer.
        </Typography>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 5 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
