import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Pie, Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const PieChart = ({ data, title }: {data: any, title: string}) =>{
  
  return (
    <Box mt={2}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Pie data={data} />
      </Box>
    </Box>
  );
};

export default PieChart;
