import React from 'react';
import { CardNumberElement } from '@recurly/react-recurly';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCcVisa, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons'
import styles from '../styles.less';

const cardIcon = type => {
    switch(type) {
        case 'visa': return <FontAwesomeIcon icon={faCcVisa} title={"Visa"} />;
        case 'mastercard': return <FontAwesomeIcon icon={faCcMastercard} title={"Mastercard"} />;
        case 'amex': return <FontAwesomeIcon icon={faCcAmex} title={"American Express"} />;
        default: return null;
    }
}

export default props => {
    const { type, onChange } = props;

    return (
        <div className={styles.cardNumber}>
            <div className={styles.label}>Card Number {cardIcon(type)}</div>
            <CardNumberElement onChange={onChange} style={{ fontSize: '14px', placeholder: { content: '1234 1234 1234 1234' } }} />
        </div>
    );
}