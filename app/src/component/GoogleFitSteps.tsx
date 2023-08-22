import { Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const GoogleFitSteps = () => {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const SCOPES = import.meta.env.VITE_SCOPES;
  const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
  const [stepCounts, setStepCounts] = useState<{ date: string; stepCount: number }[]>([]);

  useEffect(() => {
    const getToken = async (code: string) => {
      try {
        const response = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            code,
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            client_secret: CLIENT_SECRET,
            grant_type: "authorization_code",
          }
        );
        const token = response.data.access_token;
        getStepCounts(token);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      getToken(code);
    }
  }, []);

  const handleSignIn = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}`;
    window.location.href = authUrl;
  };

  const getStepCounts = async (token: string) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const dateCursor = new Date(startDate);
      const newStepCounts = [];

      while (dateCursor <= endDate) {
        const dateString = dateCursor.toISOString().split("T")[0];
        const googleUrl = `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`;

        const response = await axios.post(
          googleUrl,
          {
            aggregateBy: [
              {
                dataTypeName: "com.google.step_count.delta",
                dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
              },
            ],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: dateCursor.setHours(0, 0, 0, 0),
            endTimeMillis: dateCursor.setHours(23, 59, 59, 999),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const stepNum = response.data.bucket[0].dataset[0].point[0].value[0].intVal;
        newStepCounts.push({ date: dateString, stepCount: stepNum });
        dateCursor.setDate(dateCursor.getDate() + 1);
      }

      setStepCounts(newStepCounts);
    } catch (error) {
      console.error("Error getting step counts:", error);
    }
  };

  const addSteps = ()=>{
    console.log("sample")
  }

  return (
    <div>
      <h1>Google Fit 歩数取得</h1>
      <button onClick={handleSignIn}>Googleでログイン</button>
      <List>
        {stepCounts.map(({ date, stepCount }) => (
          <ListItem key={date}>
            <ListItemText primary={`Date: ${date}, Steps: ${stepCount}`} />
            <Button onClick={addSteps} variant="outlined" color="primary">歩数を追加する</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default GoogleFitSteps;
