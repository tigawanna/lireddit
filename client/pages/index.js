import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'


export default function Home() {
  return (
 <div className={styles.container}>
 <div className={styles.navbar}><Navbar/></div>
 <div className={styles.body}>
  <h1>My App</h1>
 </div>
    </div>
  )
}
