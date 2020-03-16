import React from 'react';
import { CardCvvElement } from '@recurly/react-recurly';
import styles from '../styles.less';

export default props => {
    const { onChange } = props;

    return (
        <div className={styles.cardCVC}>
            <div className={styles.label}>CVC Code</div>
            <CardCvvElement onChange={onChange} style={{ fontSize: '14px', placeholder: { content: 'CVC' } }} />
        </div>
    );
}