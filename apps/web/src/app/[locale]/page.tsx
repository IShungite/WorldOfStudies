import { useTranslations } from "next-intl";
import styles from "./page.module.css";

export default function Home() {

  const t = useTranslations('Home');

  return (
    <main className={styles.main}>
      <div>
        {t("title")}
      </div>
    </main>
  );
}
