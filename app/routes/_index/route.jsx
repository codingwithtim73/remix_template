import { Link } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "Our Remix App Home Page" },
    { name: "description", content: "This is the home page of our Remix app." },
  ];
};

export default function Home() {
  return (
    <div>
      <h1>Hello Remix from Folder</h1>
      <Link to="/about">Go to the About Us Page</Link>
    </div>
  );
}
