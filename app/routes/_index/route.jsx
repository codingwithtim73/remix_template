import { Link } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "Our Remix Website" },
    { name: "description", content: "Welcome to our Remix website!" },
  ];
};
export default function Home() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <Link to="/about">Go to the About Us Page</Link>
    </div>
  );
}
