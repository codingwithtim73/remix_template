import { Links, Meta, Outlet, Scripts, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/react";
import Header from "./components/header";
import Footer from "./components/footer";
import { getSession } from "./sessions.server";
import User from "../models/User.js";

export const loader = async ({ request }) => {
  const cookie = request.headers.get("Cookie");
  console.log("the cookie in the loader", cookie);
  const session = await getSession(cookie);
  console.log("The session in the loader is ", session);
  const userId = session?.passport?.user || null; // Check for session.passport.user

  let user = null;
  if (userId) {
    user = await User.findById(userId).lean(); // Fetch user data from your database
  }

  console.log("The user in the loader is ", user);
  return json({ user });
};

export const links = () => {
  return [
    { rel: "icon", href: "/favicon.ico" },
    { rel: "stylesheet", href: "/styles/global.css" },
  ];
};

export default function App() {
  const { user } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="uft-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header user={user} />
        <main className="main-content">
          <Outlet context={{ user }} />
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
