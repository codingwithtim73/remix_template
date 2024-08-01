import { useOutletContext } from "@remix-run/react";

export default function AccountHome() {
  const { sidebarVisible } = useOutletContext();
  console.log(
    "the values of sidebarVisible in accountHome Function",
    sidebarVisible
  );
  return (
    <div>
      <h2>Dashboard Home</h2>
      <p>Welcome to your dashboard!</p>
      <p>Sidebar is {sidebarVisible ? "visible" : "hidden"}</p>
    </div>
  );
}
