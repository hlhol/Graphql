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

  useEffect(() => {
    const storedToken = sessionStorage.getItem('hhh');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("Token not found in sessionStorage");
      setUserData({ error: 'Token not found. Please log in.' });
    }
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!token) return;
      try {
        const data = await getData(USER_ID_QUERY, token);
        console.log("User ID data:", data);
        if (data?.data?.user?.[0]) {
          setUserID(data.data.user[0].id);
        } else {
          console.error('Failed to load user ID');
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
        console.log("User details data:", data);

        if (data?.data?.user?.[0]) {
          setUserData(data.data.user[0]);
        } else {
          setUserData({ error: 'Failed to load user details' });
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
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
        console.log("Audit pass:", pass);
        const numberPass = pass.data.audit.length;

        const fail = await getData(GET_AUDIT_FAILED, token, variables);
        console.log("Audit fail:", fail);
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
        console.log("Transaction data:", data);

        const groupedData = data.data.transaction.reduce((acc, transaction) => {
          const month = new Date(transaction.createdAt).toLocaleString('default', { month: 'short' });
          if (!acc[month]) acc[month] = 0;
          acc[month] += transaction.amount;
          return acc;
        }, {});

        const sortedMonths = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const formattedData = sortedMonths.map(month => ({
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
      </div>
      <div id="content">
        <div id="details">
          <h3><strong>User Detail:</strong></h3>
          <ul>
            <li><strong>Username:</strong> {userData.login || 'N/A'}</li>
            <li><strong>Email:</strong> {userData.email || 'N/A'}</li>
            <li><strong>First name:</strong> {userData.firstName || 'N/A'}</li>
            <li><strong>Country:</strong> {userData.campus || 'N/A'}</li>
          </ul>
        </div>
        <div id="charts-container">
          <div id="auditRatio" className="chart-container">
            <h3>Audit Ratio:</h3>
            <svg width="200" height="200" id='audit-ratio-chart'>
              <circle cx="100" cy="100" r="90" stroke="lightgray" strokeWidth="20" fill="none" />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="green"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${auditRatio} ${100 - auditRatio}`}
                transform="rotate(-90 100 100)"
              />
              <text x="50%" y="50%" textAnchor="middle" stroke="#000" strokeWidth="1px" dy=".3em" fontSize="24px" fill="#000">
                {auditRatio.toFixed(2)}
              </text>
            </svg>
          </div>
          <div id="make_audit" className="chart-container">
            <h3>Make Audit Pass vs Fail:</h3>
            {chartData.length > 0 && <VerticalBarChart data={chartData} />}
          </div>
          <div id="progress" className="chart-container">
            <h3>Points by month</h3>
            {lineChartData.length > 0 && <ProgressLineChart data={lineChartData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
