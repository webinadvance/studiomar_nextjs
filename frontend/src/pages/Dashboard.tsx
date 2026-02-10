import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function Dashboard() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Typography variant={isSmall ? 'h5' : 'h4'} gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={isSmall ? 2 : 3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Scadenze
              </Typography>
              <Typography variant={isSmall ? 'h6' : 'h5'}>—</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant={isSmall ? 'h6' : 'h5'}>—</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Clients
              </Typography>
              <Typography variant={isSmall ? 'h6' : 'h5'}>—</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
