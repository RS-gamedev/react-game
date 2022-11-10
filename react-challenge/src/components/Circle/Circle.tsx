import styles from './Circle.module.css';
type Props = {
  x: number;
  y: number;
}

export default function Circle({x, y}: Props) {

  return (
    <div style={{left:x - 50, top:y - 50}} className={styles.circle}></div>
  )
}