import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  createRoutesFromElements, Navigate, Route,
  RouterProvider
} from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import RequireGuest from "./components/RequireGuest";
import DashboardLayout from "./layouts/DashboardLayout";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LogSourcePage from "./pages/LogSourcePage";
import 'react-notifications/lib/notifications.css';


import "./styles/App.css";


// new react-router-dom 6.4 version upgrade
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* public routes */}

      {/* protected routes */}
      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="log-sources" element={<LogSourcePage />} />
        </Route>
      </Route>

      {/* require guest (not logined) */}
      <Route element={<RequireGuest />}>
        <Route path="login" element={<LoginPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
);

function App() {

  return (
    <>
      <RouterProvider router={router} />
    
    </>
  );
}

export default App;
