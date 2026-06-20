import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useInterview } from '../hooks/useInterview.js';

const scoreColor = (score) => (score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error');

const Home = () => {
  const { loading, generateReport, getReports, reports } = useInterview();
  const { user, handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getReports().catch(() => {});
  }, []);

  const handleGenerateReport = async () => {
    setError('');

    const resumeFile = resumeInputRef.current?.files?.[0];
    if (!resumeFile) {
      setError('Please upload your resume as a PDF.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.');
      return;
    }

    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile });
      if (data?._id) {
        navigate(`/interview/${data._id}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to generate report. Please try again.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
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
                  width: 32,
                  height: 32,
                  borderRadius: '9px',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(135deg, #5b8cff, #3f6bdb)',
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 17, color: '#fff' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                HireMind
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              {user?.username && (
                <Typography variant="body2" color="text.secondary">
                  {user.username}
                </Typography>
              )}
              <Button
                onClick={handleLogout}
                size="small"
                color="inherit"
                startIcon={<LogoutOutlinedIcon fontSize="small" />}
              >
                Log out
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Stack spacing={1} sx={{ mb: 5, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            Create your custom <Box component="span" sx={{ color: 'primary.main' }}>interview plan</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Let AI analyze the job requirements and your profile to build a winning strategy.
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={4}>
              {/* Job description */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                  <WorkOutlineOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 600 }}>
                    Target job description
                  </Typography>
                  <Chip label="Required" size="small" color="primary" variant="outlined" />
                </Stack>
                <TextField
                  multiline
                  minRows={10}
                  maxRows={10}
                  fullWidth
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  inputProps={{ maxLength: 5000 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {jobDescription.length} / 5000 chars
                </Typography>
              </Grid>

              {/* Profile */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Your profile
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    Upload resume
                  </Typography>
                  <Chip label="Best results" size="small" color="secondary" variant="outlined" />
                </Stack>

                <Box
                  component="label"
                  htmlFor="resume"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    py: 3,
                    mb: 2,
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(91,140,255,0.04)' },
                  }}
                >
                  <UploadFileOutlinedIcon sx={{ fontSize: 26, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {fileName || 'Click to upload or drag & drop'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF only (Max 5MB)
                  </Typography>
                  <input
                    ref={resumeInputRef}
                    hidden
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                  />
                </Box>

                <Divider sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">OR</Typography>
                </Divider>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Quick self-description
                </Typography>
                <TextField
                  multiline
                  minRows={3}
                  maxRows={3}
                  fullWidth
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Briefly describe your experience and key skills..."
                  sx={{ mb: 2 }}
                />

                <Alert severity="info" icon={false} sx={{ bgcolor: 'rgba(91,140,255,0.08)', color: 'text.secondary' }}>
                  A <strong>resume</strong> is required to generate a personalized plan.
                </Alert>
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ px: { xs: 3, md: 4 }, py: 2.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              AI-powered strategy generation &bull; Approx. 30s
            </Typography>
            <Button
              onClick={handleGenerateReport}
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{ px: 3 }}
            >
              {loading ? 'Generating...' : 'Generate my interview strategy'}
            </Button>
          </Stack>
        </Card>

        {/* Recent reports */}
        {reports.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ mb: 2.5 }}>
              My recent interview plans
            </Typography>
            <Grid container spacing={2}>
              {reports.map((r) => (
                <Grid key={r._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    onClick={() => navigate(`/interview/${r._id}`)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 2.5,
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {r.title || 'Untitled position'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                        Generated on {new Date(r.createdAt).toLocaleDateString()}
                      </Typography>
                      <Chip
                        size="small"
                        label={`Match score: ${r.matchScore}%`}
                        color={scoreColor(r.matchScore)}
                        variant="outlined"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;
