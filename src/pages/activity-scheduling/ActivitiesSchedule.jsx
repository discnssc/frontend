import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

const buildUrl = (endpoint) =>
  `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

export default function ActivitiesSchedule() {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(buildUrl('/activities'));
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, []);
  return (
    <div>
      <h1>Activities Schedule</h1>
      <table border='1' style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time Start</th>
            <th>Lead Staff</th>
            <th>Staff</th>
            <th>Volunteers</th>
            <th>Location</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <tr key={activity.id} style={{ cursor: 'pointer' }}>
                <td>
                  <Link
                    to={`/activity/${activity.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {activity.name}
                  </Link>
                </td>
                <td>{activity.date}</td>
                <td>{activity.time_start}</td>
                <td>{activity.lead_staff}</td>
                <td>{activity.staff}</td>
                <td>{activity.volunteers}</td>
                <td>{activity.location}</td>
                <td>{activity.notes}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='8' style={{ textAlign: 'center' }}>
                No activities available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
