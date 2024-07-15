import { Link } from "@remix-run/react";
import styles from "./about.module.css";

export const meta = () => {
  return [
    { title: "Our Remix App About Page" },
    {
      name: "description",
      content: "This is the about us page of our Remix app.",
    },
  ];
};

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.message}>I'm the about us page</h1>
      <Link className={styles.link} to="/">
        Go to the Home Page
      </Link>
    </div>
  );
}
