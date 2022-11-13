import { useEffect } from 'react';
import Button from '../../Button/Button';
import styles from './SettingsShapePicker.module.css';

type Shape = {
    name: string,
    image: string,
    selected: boolean
}

type Props = {
    shapes: Shape[]
}

export default function SettingsShapePicker({shapes}: Props) {


    useEffect(() => {
        
    }, [])

    return (
        <div className={styles.shapePicker}>
           
        </div>
    )
}