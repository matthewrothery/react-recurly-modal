import React from 'react';
import { CardMonthElement, CardYearElement } from '@recurly/react-recurly';
import styles from '../styles.less';

export default props => {
    const { onChange } = props;

    return (
        <div className={styles.cardExpiry}>
            <div className={styles.label}>Expiry Date (MM/YY)</div>
            <CardMonthElement className={styles.month} onChange={v => onChange({ ...v, type: 'cardExpiryMonth' })} style={{ fontSize: '14px', placeholder: { content: 'MM' } }} />
            <CardYearElement className={styles.year} onChange={v => onChange({ ...v, type: 'cardExpiryYear' })} style={{ fontSize: '14px', placeholder: { content: 'YY' } }} />
        </div>
    );
}