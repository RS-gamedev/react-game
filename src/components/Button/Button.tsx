import styles from './Button.module.css';
import Icon from '../Icon/Icon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Price } from '../../models/Price';
import React from 'react';

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
  imageName?: string,
  imageHeight: string
}

const Button = React.memo(({ onClick, text, disabled, active, width, height, icon, iconColor, price, imageName, imageHeight }: Props) => {
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
          <Icon fontSize={'1.5em'} name={icon} color={iconColor} height={height}></Icon> :
          <></>
        }
        {(imageName) ?
          <Icon fontSize={'1em'} imageName={imageName} height={imageHeight}></Icon> :
          <></>
        }
      </div>
      {(!imageName) ?
        <span className={styles.title}>{text}</span> :
        <></>
      }
      {(price) ?
        <div style={{ width: '100%', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          {price.map((_price, index) => {
            return <div key={text + index} >
              <Icon color={_price.type?.color} fontSize='1em' name={_price.type?.icon} imageName={_price.type?.image} height={'10px'}></Icon>
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