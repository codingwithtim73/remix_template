import { useOutletContext } from "@remix-run/react";

export default function Settings() {
  const { sidebarVisible } = useOutletContext();
  console.log(sidebarVisible);

  return (
    <div>
      <h2>Settings</h2>
      <p>Manage your settings here.</p>
      <p>Sidebar is {sidebarVisible ? "visible" : "hidden"}</p>
    </div>
  );
}
