import { Link, useOutletContext } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "Our Remix App Home Page" },
    { name: "description", content: "This is the home page of our Remix app." },
  ];
};

export default function Home() {
  const { user } = useOutletContext();
  console.log("the user from the outLetContext", user);
  return (
    <div>
      <h1>
        Welcome to the App {user.firstName} {user.lastName}
      </h1>
      {user ? (
        <div>
          <h2>Articles for Logged-in Users</h2>
          <p>Exclusive content for logged-in users...</p>
        </div>
      ) : (
        <div>
          <h2>Public Articles</h2>
          <p>Content available for everyone...</p>
          <Link to="/login">Login to see more</Link>
        </div>
      )}
    </div>
  );
}
