import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LazyRouter, ProtectedRoute } from './components';
import {
  Home,
  Login,
  Register,
  Error,
  ForgetPsw,
  ResetPsw,
  LandingPage
} from './common';

const Test = LazyRouter(() => import('./pages/Test'));
const Dashboard = LazyRouter(() => import('./pages/Dashboard'));
const Profile = LazyRouter(() => import('./pages/Profile'));
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path={'/dashboard'}
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path={'test'} element={<Test />} />
          <Route path={'dashboard'} element={<Dashboard />} />
          <Route path={'profile'} element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetPsw" element={<ForgetPsw />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPsw />} />

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
