import { useRouter } from 'next/router';
import styles from './header.module.scss';

export default function Header(): any {
  const router = useRouter();

  function handleBackHome(): any {
    router.push('/', expect.anything(), expect.anything());
  }

  return (
    <div className={styles.spacingtraveling}>
      <img onClick={handleBackHome} src="/images/Logo.svg" alt="logo" />
    </div>
  );
}
