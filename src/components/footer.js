import React from 'react';
import styles from '../styles.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

export default props => {
    const { valid, errors, onSubmit, close, buttonStyle, submitLabel = "Save changes", isPending } = props;

    return (
        <div className={styles.footer}>
            <div className={styles.errors}>
                {!valid && errors && Object.values(errors).length ?
                    <ul>
                        {Object.values(errors).filter(e => e).map(e => <li key={e}>{e}</li>)}
                    </ul>
                : null}
            </div>
            {isPending ?
                    <span className={styles.submit}><FontAwesomeIcon icon={faCircleNotch} spin /></span>
                :
                    <input type="submit"
                        className={styles.submit}
                        style={buttonStyle}
                        onClick={onSubmit}
                        value={submitLabel}
                        disabled={!valid}
                    />
            }
            <span className={styles.cancel} onClick={close}>Cancel</span>
        </div>
    );
}