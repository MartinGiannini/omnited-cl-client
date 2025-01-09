import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

export default function Espacio() {
  const theme = useTheme();
  return (
    <Box sx={{ paddingLeft: 1, width: '100%', ml: { xs: 0, md: 1 } }}>
      
    </Box>
  );
}