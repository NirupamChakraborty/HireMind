import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

const steps = [
  {
    icon: <DescriptionOutlinedIcon />,
    title: 'Share your details',
    body: 'Upload your resume or write a quick self-description, plus the job description you’re targeting.',
  },
  {
    icon: <PsychologyOutlinedIcon />,
    title: 'AI analyzes the fit',
    body: 'HireMind compares your background against the role and scores your match.',
  },
  {
    icon: <ChecklistRtlOutlinedIcon />,
    title: 'Get your game plan',
    body: 'Receive tailored questions, a skill-gap breakdown, and a day-by-day prep schedule.',
  },
];

const features = [
  {
    icon: <AssignmentTurnedInOutlinedIcon />,
    title: 'Technical & behavioral questions',
    body: 'Practice with questions written for the exact role — each one explained: why it’s asked and how to answer it.',
  },
  {
    icon: <TimelineOutlinedIcon />,
    title: 'Skill-gap analysis',
    body: 'See precisely where your profile falls short of the job description, ranked by severity.',
  },
  {
    icon: <ChecklistRtlOutlinedIcon />,
    title: 'Day-by-day prep plan',
    body: 'A focused, achievable schedule that turns "I should prepare" into a concrete checklist.',
  },
];

const Landing = () => {
  return (
    <Box>
      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(11,13,18,0.7)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '9px',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(135deg, #5b8cff, #3f6bdb)',
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 18, color: '#fff' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                HireMind
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button component={RouterLink} to="/login" color="inherit">
                Log in
              </Button>
              <Button component={RouterLink} to="/register" variant="contained" color="primary">
                Get started
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 } }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Chip
            label="AI-powered interview preparation"
            size="small"
            sx={{
              bgcolor: 'rgba(91,140,255,0.12)',
              color: 'primary.main',
              border: '1px solid rgba(91,140,255,0.3)',
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
              lineHeight: 1.08,
              maxWidth: 820,
            }}
          >
            Prepare for any interview like you&apos;ve seen the questions already.
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 620, fontWeight: 400, fontSize: { xs: '1rem', md: '1.15rem' } }}
          >
            Paste a job description, share your resume, and HireMind generates the exact
            questions, skill gaps, and prep schedule you need to walk in ready.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4, py: 1.4, fontSize: '1rem' }}
            >
              Generate my interview plan
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.4, fontSize: '1rem', borderColor: 'divider' }}
            >
              I already have an account
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
            Free to start · No credit card required
          </Typography>
        </Stack>
      </Container>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h3" textAlign="center" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 1 }}>
          How it works
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
          Three steps between you and a personalized prep plan.
        </Typography>

        <Grid container spacing={3}>
          {steps.map((step, i) => (
            <Grid key={step.title} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', borderRadius: 3, p: 1 }}>
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(91,140,255,0.12)',
                        color: 'primary.main',
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{ fontSize: '2rem', color: 'rgba(255,255,255,0.08)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.body}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
          <Typography variant="h3" textAlign="center" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 1 }}>
            Everything you need to walk in confident
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            One report, built specifically for the role you&apos;re targeting.
          </Typography>

          <Grid container spacing={3}>
            {features.map((f) => (
              <Grid key={f.title} size={{ xs: 12, md: 4 }}>
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      display: 'grid',
                      placeItems: 'center',
                      background: 'rgba(34,211,166,0.12)',
                      color: 'secondary.main',
                    }}
                  >
                    {f.icon}
                  </Box>
                  <Typography variant="h6">{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.body}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 11 } }}>
        <Card
          sx={{
            borderRadius: 4,
            p: { xs: 4, md: 7 },
            textAlign: 'center',
            background:
              'linear-gradient(135deg, rgba(91,140,255,0.14), rgba(34,211,166,0.08))',
          }}
        >
          <Typography variant="h3" sx={{ fontSize: { xs: '1.7rem', md: '2.1rem' }, mb: 1.5 }}>
            Your next interview deserves real preparation.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480, mx: 'auto' }}>
            It takes about 30 seconds to generate your first report. See exactly what to expect.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
          >
            Get started for free
          </Button>
        </Card>
      </Container>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 4 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} HireMind/Nirupam Chakraborty. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography
                component="a"
                href="#"
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}
              >
                Privacy Policy
              </Typography>
              <Typography
                component="a"
                href="#"
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}
              >
                Terms of Service
              </Typography>
              <Typography
                component="a"
                href="#"
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}
              >
                Help Center
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
