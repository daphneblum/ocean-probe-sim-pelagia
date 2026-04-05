import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/layout/RootLayout";
import { LandingPage } from "@/pages/LandingPage";
import { SimulationPage } from "@/pages/SimulationPage";
import { SystemOverviewPage } from "@/pages/SystemOverviewPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "simulation", element: <SimulationPage /> },
      { path: "system-overview", element: <SystemOverviewPage /> },
    ],
  },
]);
