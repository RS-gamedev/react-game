import React from 'react'
import styles from './Button.module.css';

type Props = {
    onClick: any,
    text: string,
    disabled: boolean,
    active: boolean,
    width: string,
    height: string
}

export default function Button({onClick, text, disabled, active, width, height}: Props) {

    function handleClick(event: any):any{
        event.preventDefault();
        event.stopPropagation();
        onClick(event);
    }



  return (
    <button disabled={disabled} style={{width:width, height:height}} className={styles.button + " " + styles[`${(disabled) ? 'disabled' : 'nothing'}`] + " " + styles[`${(active) ? 'active' : 'nothing'}`]} onClick={handleClick}>{text}</button>
  )
}