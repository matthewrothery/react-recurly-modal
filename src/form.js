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

        this.form = React.createRef();
        this.state = {
            cardType: null,
            isPending: false,
            errors: {
                cardNumber: null,
                cardExpiryMonth: null,
                cardExpiryYear: null,
                cardCvc: null,
                submitError: null,
                onSubmitParent: props.errorMessage || null,
            },
            fields: {
                card: null,
                expiryMonth: null,
                expiryYear: null,
                cvc: null
            },
            hasSubmitted: false,
        }
    }

    onChange(element) {
        let cardType = this.state.cardType;
        let errors = this.state.errors || {};
        let fields = this.state.fields;

        if (element.focus && element.length) {
            fields[element.type] = element;
        } else if (!element.focus && element.length && fields[element.type].focus) {
            // We can continue!
            errors.submitError = null;
            errors.onSubmitParent = null;

            if (element.type === 'cardNumber') {
                cardType = element.brand === 'unknown' ? null : element.brand;
            }

            // Check for errors
            if (!element.valid) {
                if (element.type === 'cardNumber') {
                    errors[element.type] = "Card number is invalid";
                } else if (element.type === 'cardExpiryMonth') {
                    errors[element.type] = "Card expiry month is invalid";
                } else if (element.type === 'cardExpiryYear') {
                    errors[element.type] = "Card expiry year is invalid";
                } else if (element.type === 'cardCvc') {
                    errors[element.type] = "Card CVC is invalid";
                }
            } else if (element.empty) {
                if (element.type === 'cardNumber') {
                    errors[element.type] = "Card number cannot be empty";
                } else if (element.type === 'cardExpiry') {
                    errors[element.type] = "Card Expiry cannot be empty";
                } else if (element.type === 'cardCvc') {
                    errors[element.type] = "Card CVC cannot be empty";
                }
            } else {
                errors[element.type] = null;
            }
        } else if (!element.focus && fields[element.type] && fields[element.type].focus && !element.length) {
            errors[element.type] = null;
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
        const { onSubmit } = this.props;
        evt.preventDefault();
        this.setState({
            isPending: true,
        }, () => {
            recurly.token(this.form.current, (err, token) => {
                if (err) {
                    // handle error - TODO: handle errors individually
                    this.setState({
                        errors: { ...this.state.errors, ['submitError']: "Please fill out all fields" }
                    });
                } else {
                    // save the token.id, and submit it to the Recurly API from your server
                    // There are no errors, lets fetch the token &
                    // send the token to parent component
                    if (onSubmit && typeof onSubmit === 'function') {
                        onSubmit(token);
                    } else {
                        console.warn("@react-recurly-modal > missing onSubmit property");
                    }
                    this.setState({
                        isPending: false,
                        hasSubmitted: true,
                    });
                }
            });
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
        const { headerColor, headerBackgroundColor, buttonStyle, onCancel, submitLabel, customerFirstname, customerLastname } = this.props;
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
                        onCancel={onCancel}
                        buttonStyle={buttonStyle}
                        submitLabel={submitLabel}
                        isPending={this.state.isPending}
                        form={this.form}
                        firstname={customerFirstname}
                        lastname={customerLastname}
                    />
                </div>
            </div>
        );
    }
}

export default Form;

function FunctionalComponentForm(props) {
    const { cardType, onChange, isValid, errors, onSubmit, onCancel, buttonStyle, submitLabel, isPending, form, firstname, lastname } = props;
    const recurly = useRecurly();

    return (
        <form className={styles.body} ref={form}>
            <input type="hidden" data-recurly="first_name" value={firstname} />
            <input type="hidden" data-recurly="last_name" value={lastname} />
            <CardNumber type={cardType} onChange={onChange} />
            <CardExpiry onChange={onChange} />
            <CardCVC onChange={onChange} />
            <Footer valid={isValid()} errors={errors} onSubmit={(evt) => onSubmit(evt, recurly)} close={onCancel} buttonStyle={buttonStyle} submitLabel={submitLabel} isPending={isPending} />
        </form>
    );
}

