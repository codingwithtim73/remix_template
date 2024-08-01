import { useOutletContext } from "@remix-run/react";

export default function Profile() {
  const { sidebarVisible } = useOutletContext();
  console.log("the values of sidebarVisible", sidebarVisible);

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Manage your profile information here.</p>
      <p>Sidebar is {sidebarVisible ? "visible" : "hidden"}</p>
    </div>
  );
}
