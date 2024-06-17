import { redirect, RouteObject } from "react-router-dom"
import { Layout } from "../components/Layout"
import Home from "./Home"
import Register from "./Register"
import Login from "./Login"
import App from "../components/App"
import { logout, selectAuth } from "../features/auth/authSlice"
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
        loader(/* { request } */) {
          // If the user is not logged in and tries to access `/protected`, we redirect
          // them to `/login` with a `from` parameter that allows login to redirect back
          // to this page upon successful authentication
          const auth = selectAuth(store.getState())
          if (!auth.isLoggedIn) {
            // const params = new URLSearchParams();
            // params.set("from", new URL(request.url).pathname);
            return redirect("/login"/*"?" + params.toString() */);
          }
          return null;
        },
        Component: App
      },
    ]
  }, {
    path: "/logout",
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      store.dispatch(logout());
      return redirect("/");
    },
  },
]
export default routes

function pbLoader() {
  const auth = selectAuth(store.getState())
  return auth.isLoggedIn ? redirect("/contacts") : null;
}