import { RouteObject, useRoutes } from "react-router-dom";
import Layout from "@/pages/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { Note } from "./pages/Note";
import { Provider } from "jotai";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <Home /> }],
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

function App() {
  const element = useRoutes(routes);
  return <Provider>{element}</Provider>;
}

export default App;
