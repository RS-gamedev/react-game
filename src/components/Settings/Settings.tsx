import React, { useEffect } from 'react';
import { Shape } from '../../models/Shape';
import Button from '../Button/Button';
import styles from './Settings.module.css';

type Props = {
    shapes: Shape[],
    onClick: (shape: Shape) => void
}

const Settings = React.memo(({shapes, onClick}: Props) => {
    console.log('rendered settings');
    return (
        <div className={styles.settingsBox}>
            <h3 className={styles.title} style={{ margin: 0 }}>Buildings</h3>
            <div className={styles.shapePicker}>
                {
                    shapes.map(option => {
                        return <Button imageHeight={'50%'} key={option.id} price={option.price} active={option.selected} disabled={false} text={option.name} onClick={() => onClick(option)} width="100px" height='100px' icon={option.icon} iconColor={option.iconColor}></Button>
                    })
                }
            </div>
        </div>
    )
})
export default Settings;