import { redirect, RouteObject } from "react-router-dom"
import { Layout } from "../components/Layout"
import Home from "./Home"
import Register from "./Register"
import Login from "./Login"
import App from "../components/App"
import { isLoggedIn, logout } from "../features/auth/authSlice"
import { store } from "../app/store"

const routes: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
        // loader({ request }) {
        //   return fetch(createAPIPath("trending/movie/week"), { signal: request.signal })
        // }
      },
      {
        path: "register",
        Component: Register,
        loader: pbLoader
      },
      {
        path: "login",
        Component: Login,
        loader: pbLoader
      },
      {
        path: "contacts",
        loader: async () => await isLoggedIn() ? null : redirect("/login"),
        Component: App
      },
    ]
  }, {
    path: "/logout",
    async action() {
      const resultAction = await store.dispatch(logout());
      if (logout.fulfilled.match(resultAction))
        return redirect("/");
    },
  },
]
export default routes

async function pbLoader() {
  return await isLoggedIn() ? redirect("/contacts") : null;
}