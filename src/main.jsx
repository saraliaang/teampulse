import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider.jsx";
import './styles/global.css'


import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CheckInPage from "./pages/CheckInPage.jsx";
import ManagerDashboardPage from "./pages/ManagerDashboardPage.jsx";
import NavBar from './components/NavBar.jsx';
import ManagerOnly from "./components/ManagerOnly";
import UserDashboardPage from "./pages/UserDashboardPage.jsx";
import PermissionDeniedPage from "./pages/PermissionDeniedPage";
import NotFoundPage from "./pages/404Page.jsx";


const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <HomePage />,
  // },

  {
    path: '/',
    element: <NavBar />,
    children: [
      {path:'/', element: <HomePage />},
      { path: "/signup", element: <SignupPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/checkin", element: <CheckInPage /> },
      { path: "/user-dashboard", element: <UserDashboardPage /> },
      {
        path: "/no-permission",
        element: <PermissionDeniedPage />,
      },
      { path: "*", element: <NotFoundPage /> },
      {
        path: "/manager-dashboard",
        element: (
          <ManagerOnly>
            <ManagerDashboardPage />
          </ManagerOnly>
        ),
      },
      {
        path: "/user-dashboard/:userId",
        element: (
          <ManagerOnly>
            <UserDashboardPage />
          </ManagerOnly>
        ),
      },
    ],
  },
  // Permission denied page


]);

// function AppRoot() {
//   const [showIntro, setShowIntro] = useState(true);

//   return showIntro ? (
//     <LandingAnimation onFinish={() => setShowIntro(false)} />
//   ) : (
//     <RouterProvider router={router} />
//   );
// }



function AppRoot() {
  return (
    <RouterProvider router={router} />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  </React.StrictMode>
);