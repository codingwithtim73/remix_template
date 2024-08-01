import styles from "./banner.module.css";

export default function Banner({ imageSrc, title, text }) {
  return (
    <div className={styles.banner}>
      <div
        className={styles.imageContainer}
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className={styles.overlay}></div>
      </div>
      <h1>{title}</h1>
      <h2>{text}</h2>
    </div>
  );
}
