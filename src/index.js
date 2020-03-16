import React from 'react';
import PropTypes from 'prop-types';
import { RecurlyProvider, Elements } from '@recurly/react-recurly';
import Form from './form';

class ReactStripeModal extends React.Component {
    render() {
        const { recurlyPublicKey, onCancel } = this.props;
        if (!recurlyPublicKey) {
            console.warn("@react-recurly-modal > missing property: recurlyPublicKey");
            return null;
        }

        if (!onCancel || typeof onCancel !== 'function') {
            console.warn("@react-recurly-modal > missing property: onCancel");
            return null;
        }
        return (
            this.props.open ?
                <RecurlyProvider publicKey={recurlyPublicKey}>
                    <Elements>
                        <Form {...this.props} />
                    </Elements>
                </RecurlyProvider>
            : null
        );
    }
}

ReactStripeModal.propTypes = {
    recurlyPublicKey: PropTypes.string
}

export default ReactStripeModal;