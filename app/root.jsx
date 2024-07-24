import { Links, Meta, Outlet, Scripts } from "@remix-run/react";

export const links = () => {
  return [
    { rel: "icon", href: "/favicon.ico" },
    { rel: "stylesheet", href: "/styles/global.css" },
  ];
};

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="uft-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
