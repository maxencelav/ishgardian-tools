import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>

      <div className={styles.description}></div>


      <div className={styles.center}>
        <h1 className={styles.title}>
          Ishgardian Tools
        </h1>
        <p className={styles.description}>
          Coming soon... 
        </p>
      </div>

      <div className={styles.grid}>
        <a
          href="https://moogle-search.vercel.app/"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Moogle Search <span>-&gt;</span>
          </h2>
          <p>Check out a FFXIV multilingual search engine.</p>
        </a>

        <a
          href="https://garlandtools.org/"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Garland Tools <span>-&gt;</span>
          </h2>
          <p>The original FFXIV database website.</p>
        </a>

        <a
          href="https://github.com/maxencelav/ishgardian-tools"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Source code <span>-&gt;</span>
          </h2>
          <p>Go behind the scenes and see the source code.</p>
        </a>
      </div>
    </main>
  );
}
