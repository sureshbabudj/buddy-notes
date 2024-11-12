import React from "react";

import { BrowserRouter, RouteObject, useRoutes } from "react-router-dom";
import Layout from "@/pages/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { Note } from "./pages/Note";
import { Provider } from "jotai";
import { CreateNote } from "./pages/CreateNote";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "/create",
    element: <Layout />,
    children: [{ index: true, element: <CreateNote /> }],
  },
  {
    path: "/note/:id",
    element: <Layout />,
    children: [{ index: true, element: <Note /> }],
  },
  {
    path: "/*",
    element: <NotFound />,
    children: [{ index: false, element: <NotFound /> }],
  },
] as RouteObject[];

function AppRouter() {
  const element = useRoutes(routes);
  return <Provider>{element}</Provider>;
}

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
