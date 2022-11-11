import React from 'react'
import { Resource } from '../../../models/Resource';
import Icon from '../../Icon/Icon';
import styles from './ResourceItem.module.css';

type Props = {
    resource: Resource, 
    amount: number
}

export default function ResourceItem({resource, amount}: Props) {
  return (
    <div className={styles.resourceItem}>
        <Icon color={resource.color} fontSize='1em' name={resource.icon}></Icon>
        <span style={{fontSize: '0.8em'}}>{amount}</span>
    </div>

  )
}