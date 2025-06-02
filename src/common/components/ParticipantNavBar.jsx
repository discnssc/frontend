// This is the participant navigation bar that is used to navigate the participant pages
// Not the three lines in the top left corner
import React from 'react';

import { useParams } from 'react-router-dom';

import NavBar from './navigation/NavBar';

export default function ParticipantNavBar() {
  const { id } = useParams();
  const participantTabs = [
    { label: 'General Info', to: `/participant/generalinfo/${id}`, end: true },
    { label: 'Demographics', to: `/participant/demographics/${id}` },
    //{ label: 'HOW Info', to: `/participant/howinfo/${id}` },
    //{ label: 'Cases/Services', to: `/participant/cases/${id}` },
    { label: 'Activity Logs', to: `/participant/activities/${id}` },
  ];
  return <NavBar tabs={participantTabs} />;
}
