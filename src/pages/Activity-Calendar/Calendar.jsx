import React from 'react';

import MenuDrawer from 'common/components/navigation/MenuDrawer';

const Calendar = () => {
  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <MenuDrawer />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 30px 0',
            textAlign: 'center',
          }}
        >
          Google Calendar (Live View)
        </h1>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginTop: '0',
          }}
        >
          <iframe
            src='https://calendar.google.com/calendar/embed?src=b7cabec52d660eb660d4db1befd3c91afefa404148c923ebbebf2c2c0b12de55@group.calendar.google.com&ctz=Europe%2FPrague'
            style={{
              border: 0,
              width: '100%',
              height: '700px',
              borderRadius: '8px',
            }}
            frameBorder='0'
            scrolling='no'
            title='Google Calendar'
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
