import styles from './Button.module.css';
import Icon from '../Icon/Icon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Price } from '../../models/Price';
import React from 'react';
import { VillagerType } from '../../models/enums/VillagerType';

type Props = {
  onClick: any,
  text: string,
  disabled: boolean,
  active: boolean,
  width: string,
  height: string,
  icon?: IconProp,
  iconColor?: string,
  price?: Price[],
  type?: VillagerType
}

const Button = React.memo(({ onClick, text, disabled, active, width, height, icon, iconColor, price, type }: Props) => {
  function handleClick(event: any): any {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  }
  return (
    <button disabled={disabled}
      style={{ width: width, height: height }}
      className={styles.button + " " + styles[`${(disabled) ? 'disabled' : 'nothing'}`] + " " + styles[`${(active) ? 'active' : 'nothing'}`]}
      onClick={handleClick}>
      <div className={styles.itemIcon}>
        {(icon && iconColor) ?
          <Icon fontSize={'1.5em'} name={icon} color={iconColor}></Icon> :
          <></>
        }
        {(type) ?
          <Icon fontSize={'1em'} type={type}></Icon> :
          <></>
        }
      </div>
      {(!type) ?
        <span className={styles.title}>{text}</span> :
        <></>
      }
      {(price) ?
        <div style={{ width: '100%', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          {price.map((_price, index) => {
            return <div key={text + index} >
              <Icon color={_price.type?.color} fontSize='1em' name={_price.type?.icon}></Icon>
              <span>{_price.amount}</span>
            </div>
          })}
        </div> :
        <></>
      }

    </button>
  )
})

export default Button;