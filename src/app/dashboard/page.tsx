// src/app/locations/page.tsx
"use client";

import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';

import { useAppContext } from '../../context';
import withAuth from '../../hoc/withAuth';
import PieChart from '../../components/charts/PieCharts';
import DoughnutChart from '../../components/charts/DoughnutCharts';
import LineChart from '../../components/charts/LineCharts';
import BarCharts from '../../components/charts/BarCharts';
import { useEffect, useState } from 'react';
import { Car, Order, User } from '@prisma/client';

const DashboardPage = () => {
  const { state } = useAppContext();
  const [orders, setOrders] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: [];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: '# of Orders',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const [users, setUsers] = useState({});
  const [cars, setCars] = useState<Car[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState<boolean>(true);

  const getOrders = async () => {
    setIsOrdersLoading(true);
    let formattedData: any = [];
    try {
      const ordersData = await fetch('/api/orders').then((res) => res.json());

      const statusCounts = ordersData.reduce((acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(statusCounts);
      const data = Object.values(statusCounts) as [];

      setOrders({
        labels,
        datasets: [
          {
            label: '# of Orders',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      
    } finally {
      setIsOrdersLoading(false);
    }
  }
  const getUsers = async () => {
    setUsers({});
    setIsUsersLoading(true);
    try {
      const users = await fetch('/api/users').then((res) => res.json());
      const roleCounts = users.reduce((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(roleCounts);
      const data = Object.values(roleCounts);
      const userPieData = {
        labels,
        datasets: [
          {
            label: '# of Users',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
      setUsers(userPieData);
    } catch (error) {
      
    } finally {
      setIsUsersLoading(false);
    }
  }

  const getCars = async () => {

    try {
      const ordersData = await fetch('/api/inventory').then((res) => res.json());
      setCars(ordersData);
    } catch (error) {
      
    } 
  }

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [1, 5, 10, 15, 20, 25],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    setIsLoading(true)
    getOrders()
    getUsers()
    getCars()
    setIsLoading(false)
  }, [])
  
  return (
    <DashboardLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        {state.dictionary?.menu?.dashboard}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} padding={10}>
          {isUsersLoading ? <CircularProgress /> : <PieChart data={users} title={state.dictionary?.menu?.users} />}
        </Grid>
        <Grid item xs={6} padding={10}>
          <DoughnutChart data={doughnutData} title='Doughnut Chart'/>
        </Grid>
        <Grid item xs={6} padding={10}>
          {isOrdersLoading ? <CircularProgress /> : <LineChart data={orders} title={state.dictionary?.menu?.orders} />}
        </Grid>
        <Grid item xs={6} padding={10}>
          <BarCharts data={barData} title='Bar Chart' />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default withAuth(DashboardPage);
