import React from 'react';

import MenuDrawer from 'common/components/navigation/MenuDrawer';

import AddUnscheduledModal from './AddUnscheduledModal';
import AttendanceTable from './AttendanceTable';
import { SESSION_TYPES } from './dashboardConstants';
import { useDashboardData } from './useDashboardData';

function UserDashboard() {
  const {
    loading,
    error,
    showModal,
    search,
    setShowModal,
    setSearch,
    getSessionParticipants,
    handleSaveRow,
    handleAddUnscheduled,
    handleSelectParticipant,
    getAvailableParticipants,
  } = useDashboardData();

  return (
    <div
      style={{
        background: '#f4f4f4',
        minHeight: '100vh',
        minWidth: '100vw',
        position: 'relative',
      }}
    >
      <MenuDrawer />
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '32px 0 0 0',
          minHeight: '100vh',
          paddingBottom: 64,
        }}
      >
        <h1 style={{ fontWeight: 700, fontSize: '2rem', margin: '0 0 32px 0' }}>
          Welcome Back, Angie!
        </h1>
        <div
          style={{
            marginLeft: 16,
            marginBottom: 16,
            fontWeight: 500,
            fontSize: '1.2rem',
          }}
        >
          Todays Participant Schedule
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          SESSION_TYPES.map((session) => (
            <AttendanceTable
              key={session.key}
              title={session.label}
              data={getSessionParticipants(session.key)}
              onAddUnscheduled={() => handleAddUnscheduled(session.key)}
              onSaveRow={handleSaveRow}
            />
          ))
        )}
        <div style={{ height: 48 }} />
      </div>
      {showModal && (
        <AddUnscheduledModal
          search={search}
          setSearch={setSearch}
          getAvailableParticipants={getAvailableParticipants}
          handleSelectParticipant={handleSelectParticipant}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}

export default UserDashboard;
