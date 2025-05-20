import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {
  //PrivateRoute,
  PublicOnlyRoute,
} from 'common/components/routes/ProtectedRoutes';
import { UserProvider } from 'common/contexts/UserContext';
import NavLayout from 'common/layouts/NavLayout';
import ActivityLogs from 'pages/Activity-Logs/Activities';
import Cases from 'pages/Cases-Services/Cases';
import HowInfo from 'pages/HOW-info/HowInfo';
import AuthCallback from 'pages/account/AuthCallback';
import Login from 'pages/account/Login';
import RequestPasswordReset from 'pages/account/RequestPasswordReset';
import ResetPassword from 'pages/account/ResetPassword';
import SignUp from 'pages/account/SignUp';
//import ActivityLogs from 'pages/Activity-Logs/Activities';
//import Cases from 'pages/Cases-Services/Cases';
import Demographics from 'pages/demographics/demographics';
import GeneralInfo from 'pages/general-info/GeneralInfo';
//import Home from 'pages/home/Home';
//import HowInfo from 'pages/HOW-info/HowInfo';
import NotFound from 'pages/not-found/NotFound';
import ParticipantDatabase from 'pages/participant_database/ParticipantDatabase';
import ParticipantSchedule from 'pages/scheduling/ParticipantSchedule';

import './App.css';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NavLayout />}>
            {/* Make ParticipantDatabase the home page */}
            <Route index element={<ParticipantDatabase />} />

            {/* Public routes */}
            <Route element={<PublicOnlyRoute />}>
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<SignUp />} />
              <Route
                path='forgot-password'
                element={<RequestPasswordReset />}
              />
            </Route>

            {/* Participant-specific routes */}
            <Route
              path='/participant/generalinfo/:id'
              element={<GeneralInfo />}
            />
            <Route
              path='/participant/demographics/:id'
              element={<Demographics />}
            />
            <Route path='/participant/howinfo/:id' element={<HowInfo />} />
            <Route path='/participant/cases/:id' element={<Cases />} />
            <Route
              path='/participant/activities/:id'
              element={<ActivityLogs />}
            />

            {/* Auth-related routes */}
            <Route path='auth/callback' element={<AuthCallback />} />
            <Route
              path='participant-database'
              element={<ParticipantDatabase />}
            />
            <Route path='auth/reset-password' element={<ResetPassword />} />

            {/* Admin routes */}
            <Route
              path='/admin/participant-schedule'
              element={<ParticipantSchedule />}
            />

            {/* Catch-all route for 404 */}
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
