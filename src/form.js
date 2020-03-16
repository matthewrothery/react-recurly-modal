import React from 'react';
import autobind from 'class-autobind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.less';
import CardNumber from './components/card-number';
import CardExpiry from './components/card-expiry';
import CardCVC from './components/card-cvc';
import Footer from './components/footer';
import { useRecurly } from '@recurly/react-recurly';
import './recurly.css';

class Form extends React.Component {

    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            cardType: null,
            isPending: false,
            errors: {
                cardNumber: null,
                cardExpiry: null,
                cardCvc: null,
                submitError: null,
                onSubmitParent: props.errorMessage || null,
            },
            fields: {
                card: null,
                expiry: null,
                cvc: null
            },
            hasSubmitted: false,
        }
    }

    onChange(element) {
        const { elementType } = element;

        let cardType = this.state.cardType;
        let errors = this.state.errors || {};
        let fields = this.state.fields;

        errors.submitError = null;
        errors.onSubmitParent = null;

        if (elementType === 'cardNumber') {
            cardType = element.brand === 'unknown' ? null : element.brand;
        }

        if (!element.error) {
            if (elementType === 'cardNumber') {
                fields.card = true;
            } else if (elementType === 'cardExpiry') {
                fields.expiry = true;
            } else if (elementType === 'cardCvc') {
                fields.cvc = true;
            }
        }

        // Check for errors
        if (element.error && element.error.message) {
            errors[elementType] = element.error.message;
        } else if (element.empty) {
            if (elementType === 'cardNumber') {
                errors[elementType] = "Card number cannot be empty";
            } else if (elementType === 'cardExpiry') {
                errors[elementType] = "Card Expiry cannot be empty";
            } else if (elementType === 'cardCvc') {
                errors[elementType] = "Card CVC cannot be empty";
            }
        } else {
            errors[elementType] = null
        }

        this.setState({
            cardType,
            errors,
            fields,
            hasSubmitted: false,
        });
    }

    // Handle form submission
    onSubmit(evt, recurly) {
        const { customerEmail, onSubmit, stripe, customerName } = this.props;
        evt.preventDefault();
        this.setState({
            isPending: true,
        }, () => {

            recurly.token(myFormRef.current, (err, token) => {
                if (err) {
                    // handle error
                } else {
                    // save the token.id, and submit it to the Recurly API from your server
                }
            });

            // stripe.createToken({ type: 'card', name: customerName, email: customerEmail }).then((data) => {
            //     if (data.error && data.error.message) {
            //         let message = "";

            //         switch (data.error.type) {
            //             case 'incomplete_number': message = 'Invalid card number'; break;
            //             case 'incomplete_cvc': message = 'Invalid CVC'; break;
            //             case 'incomplete_expiry': message = 'Invalid expiry'; break;
            //             case 'invalid_request_error': {
            //                 message = 'Invalid request - please try again later';
            //                 console.warn("@react-stripe-modal > invalid Stripe API Key");
            //                 break;
            //             }
            //             default: message = 'Invalid form data'; break;
            //         }

            //         this.setState({
            //             errors: {
            //                 ...this.state.errors,
            //                 submitError: message
            //             },
            //             isPending: false,
            //             hasSubmitted: true,
            //         });
            //     } else {
            //         // There are no errors, lets fetch the token &
            //         // send the token to parent component
            //         if (onSubmit && typeof onSubmit === 'function') {
            //             onSubmit(data.token);
            //         } else {
            //             console.warn("@react-stripe-modal > missing onSubmit property");
            //         }
            //         this.setState({
            //             isPending: false,
            //             hasSubmitted: true,
            //         });
            //     }
            // });
        });
    }


    componentDidUpdate(prevProps) {
        const { errorMessage } = this.props;
        if (errorMessage && (this.state.errors ? (!this.state.errors.onSubmit || this.state.errors.onSubmit !== errorMessage) : true) && this.isValid() && this.state.hasSubmitted) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    onSubmitParent: errorMessage,
                }
            });
        }
    }

    isValid() {
        return Object.values(this.state.errors).filter(e => e).length === 0;
    }

    render() {
        const { headerColor, headerBackgroundColor, buttonStyle, onCancel, submitLabel } = this.props;
        return (
            <div className={styles.modal}>
                <div className={styles.content}>
                    <div className={styles.header} style={{ backgroundColor: headerBackgroundColor ? headerBackgroundColor : null, color: headerColor ? headerColor : null }}>
                        <span className={styles.title}><FontAwesomeIcon icon={faLock} style={{ marginBottom: '-1px' }} /> Payment Details</span>
                        <span className={styles.icons}>
                            <FontAwesomeIcon icon={faCcVisa} title={"Visa"} />
                            <FontAwesomeIcon icon={faCcMastercard} title={"Mastercard"} />
                            <FontAwesomeIcon icon={faCcAmex} title={"American Express"} />
                        </span>
                    </div>
                    <FunctionalComponentForm
                        cardtype={this.state.cardType}
                        onChange={this.onChange}
                        isValid={this.isValid}
                        errors={this.state.errors}
                        onSubmit={this.onSubmit}
                        onCancel={this.onCancel}
                        buttonStyle={buttonStyle}
                        submitLabel={submitLabel}
                        isPending={this.state.isPending}
                    />
                </div>
            </div>
        );
    }
}

export default Form;


function FunctionalComponentForm(props) {
    const { cardType, onChange, isValid, errors, onSubmit, onCancel, buttonStyle, submitLabel, isPending } = props;
    const recurly = useRecurly();

    return (
        <div className={styles.body}>
            <CardNumber type={cardType} onChange={onChange} />
            <CardExpiry onChange={onChange} />
            <CardCVC onChange={onChange} />
            <Footer valid={isValid()} errors={errors} onSubmit={(evt) => onSubmit(evt, recurly)} close={onCancel} buttonStyle={buttonStyle} submitLabel={submitLabel} isPending={isPending} />
        </div>
    );
}

