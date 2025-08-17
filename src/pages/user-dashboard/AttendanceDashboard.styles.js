import styled from 'styled-components';

/* ======= index.jsx (UserDashboard) styles ======= */
export const DashboardContainer = styled.div`
  background: #f4f4f4;
  min-height: 100vh;
  min-width: 100vw;
  position: relative;
`;

export const ContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  margin-top: 70px;
  padding: 32px 0 0 0;
  min-height: 100vh;
  padding-bottom: 64px;
`;

export const WelcomeTitle = styled.h1`
  font-weight: 700;
  font-size: 2rem;
  margin: 0 0 32px 0;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 16px;
  margin-bottom: 16px;
  margin-top: 60px;
`;

export const ScheduleTitle = styled.span`
  font-weight: 500;
  font-size: 1.2rem;
`;

export const ExportButton = styled.button`
  background: #005696;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #004a7a;
  }
`;

export const LoadingMessage = styled.div`
  font-size: 18px;
  color: #999;
  text-align: center;
  padding: 20px;
`;

export const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 20px;
  font-weight: 500;
`;

export const BottomSpacer = styled.div`
  height: 48px;
`;

/* ======= AttendanceTable styles ======= */
export const TableContainer = styled.div`
  margin-bottom: 48px;
`;

export const TableHeader = styled.div`
  background: rgb(0, 86, 150);
  color: white;
  padding: 10px 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  font-size: 1.08rem;
`;

export const TableRow = styled.tr`
  background: ${(props) => (props.index % 2 === 0 ? '#f9fbfd' : 'white')};
  transition: background 0.2s;
  cursor: pointer;

  &:hover {
    background: #eaf2fa;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 12px 10px;
  background: rgb(0, 86, 150);
  color: white;
  font-weight: 500;
  border: 1px solid #d0d0d0;
  text-align: center;
`;

export const TableCell = styled.td`
  padding: 12px 10px;
  border: 1px solid #e0e0e0;
  vertical-align: middle;
  text-align: ${(props) => props.align || 'left'};
`;

export const EmptyStateCell = styled.td`
  text-align: center;
  color: #888;
  padding: 24px;
  border: 1px solid #e0e0e0;
  background: #fff;
  font-size: 1.08rem;
`;

export const TimeInput = styled.input`
  width: 120px;
  font-size: 1rem;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #005696;
  }
`;

export const CodeSelect = styled.select`
  width: 70px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #005696;
  }
`;

export const SaveButton = styled.button`
  background: #005696;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #004a7a;
  }
`;
/* ======= Add Unscheduled Participant button styles ======= */

export const AddButtonContainer = styled.div`
  margin-top: 12px;
  text-align: right;
`;

export const AddButton = styled.button`
  background: #005696;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #004a7a;
  }
`;

/* ======= AddUnscheduledModal styles ======= */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  min-width: 340px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
`;

export const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 16px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #005696;
  }
`;

export const ParticipantsList = styled.div`
  max-height: 220px;
  overflow-y: auto;
`;

export const ParticipantItem = styled.div`
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
  background: #f7f7f7;
  transition: background 0.2s;

  &:hover {
    background: #e8e8e8;
  }
`;

export const NoParticipantsMessage = styled.div`
  color: #888;
  text-align: center;
  padding: 20px;
`;

export const CancelButton = styled.button`
  margin-top: 18px;
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  background: #005699;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #004a7a;
  }
`;
