import React, { useState, useEffect } from 'react';
import getData from './getData';
import VerticalBarChart from './chart'; 
import { USER_ID_QUERY, GET_USER_DETAILS, GET_AUDIT_DONE, GET_AUDIT_FAILED, TransactionQuery } from './qury'; 
import { ProgressLineChart } from './chart'; 
import './profile.css';

function Profile() {
  const [userID, setUserID] = useState('');
  const [userData, setUserData] = useState({});
  const [token, setToken] = useState('');
  const [chartData, setChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [auditRatio, setAuditRatio] = useState(0); 
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('hhh');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setUserData({ error: 'Token not found. Please log in.' });
    }
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!token) return;
      try {
        const data = await getData(USER_ID_QUERY, token);
        if (data?.data?.user?.[0]) {
          setUserID(data.data.user[0].id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error.message);
      }
    };
    fetchUserId();
  }, [token]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userID || !token) return;
      const variables = { userID };
      try {
        const data = await getData(GET_USER_DETAILS, token, variables);
        if (data?.data?.user?.[0]) {
          setUserData(data.data.user[0]);
        }
      } catch (error) {
        setUserData({ error: 'Error fetching user details' });
      }
    };
    fetchUserDetails();
  }, [userID, token]);

  useEffect(() => {
    const fetchAuditData = async () => {
      if (!userID || !token) return;
      const variables = { userID };
      try {
        const pass = await getData(GET_AUDIT_DONE, token, variables);
        const fail = await getData(GET_AUDIT_FAILED, token, variables);
        const numberPass = pass.data.audit.length;
        const numberFail = fail.data.audit.length;
        const ratio = pass.data.user[0].auditRatio;

        setChartData([
          { name: 'Pass', value: numberPass },
          { name: 'Fail', value: numberFail },
        ]);

        setAuditRatio(ratio);
      } catch (error) {
        console.error("Error fetching audit data:", error.message);
      }
    };
    fetchAuditData();
  }, [userID, token]);

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (!userID || !token) return;
      const variables = { userID };
      try {
        const data = await getData(TransactionQuery, token, variables);
        const groupedData = data.data.transaction.reduce((acc, transaction) => {
          const month = new Date(transaction.createdAt).toLocaleString('default', { month: 'short' });
          if (!acc[month]) acc[month] = 0;
          acc[month] += transaction.amount;
          return acc;
        }, {});
        const formattedData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({
          month,
          value: groupedData[month] || 0, 
        }));
        setLineChartData(formattedData);
      } catch (error) {
        console.error("Error fetching transaction data:", error.message);
      }
    };
    fetchTransactionData();
  }, [userID, token]);

  return (
    <div className="App">
      <div id="header">
        <h1>Welcome to your profile!</h1>
        <button id="logout" onClick={() => {
          sessionStorage.removeItem('hhh');
          window.location.href = '/';
        }}>Logout</button>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      <div id="content">
        <div id="details">
          <h3>User Details</h3>
          <ul>
          <li><strong>Username:</strong> {userData.login || 'N/A'}</li>
            <li><strong>Email:</strong> {userData.email || 'N/A'}</li>
            <li><strong>First name:</strong> {userData.firstName || 'N/A'}</li>
            <li><strong>Country:</strong> {userData.campus || 'N/A'}</li>
          </ul>
        </div>

        <div id="charts-container">
          <div className="chart-container" id="make_audit">
            <h3>Audit Chart</h3>
            <VerticalBarChart data={chartData} />
          </div>

          <div className="chart-container" id="progress">
            <h3>Progress Chart</h3>
            <ProgressLineChart data={lineChartData} />
          </div>

          <div className="chart-container" id="auditRatio">
            <h3>Audit Ratio</h3>
            <svg viewBox="0 0 36 36" width="150" height="150">
              <circle cx="18" cy="18" r="15" fill="none" stroke="lightgray" strokeWidth="4" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="green" strokeWidth="4" strokeDasharray={`${auditRatio}, 100`} />
              <text x="18" y="20.35" fontSize="10" textAnchor="middle" fill="var(--text-color)">
                {auditRatio.toFixed(2)}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
