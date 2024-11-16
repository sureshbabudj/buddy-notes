import { BrowserRouter, RouteObject, useRoutes } from "react-router-dom";
import Layout from "@/pages/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { Note } from "./pages/Note";
import { Provider } from "jotai";
import { CreateNote } from "./pages/CreateNote";
import { SearchPage } from "./pages/Search";

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
    path: "/search",
    element: <Layout />,
    children: [{ index: true, element: <SearchPage /> }],
  },
  {
    path: "/note/:id",
    element: <Layout />,
    children: [{ index: true, element: <Note /> }],
  },
  {
    path: "/*",
    element: <NotFound />,
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
