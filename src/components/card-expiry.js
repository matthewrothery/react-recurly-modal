import React from 'react';
import { CardMonthElement, CardYearElement } from '@recurly/react-recurly';
// import { CardExpiryElement } from 'react-stripe-elements';
import styles from '../styles.less';

export default props => {
    const { onChange } = props;

    // const handleChange = (change) => {
    //     console.log(change);
    // }
    return (
        <div className={styles.cardExpiry}>
            <div className={styles.label}>Expiry Date (MM/YY)</div>
            <CardMonthElement className={styles.month} onChange={onChange} style={{ fontSize: '14px', placeholder: { content: 'MM' } }} />
            <CardYearElement className={styles.year} onChange={onChange} style={{ fontSize: '14px', placeholder: { content: 'YY' } }} />
        </div>
    );
}