import "../../styles/Checkout.css";
import apple from "../../assets/applepay.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { Checkout as ddd } from "checkout-sdk-node";
// import  ApplePaySession  from "../../../node_modules/apple-pay-sdk";
// import { initializeApplePaySession } from "../../applePaySession";

export const Apple = () => {
  

  // useEffect(() => {
  //   Moyasar.init({
  //     element: ".mysr-form",
  //     amount: 1000,
  //     currency: "SAR",
  //     description: "Coffee Order #1",
  //     publishable_api_key: "pk_live_ejqQo8ppVL6hYFQNYAkat9AbjdzFbYvpKpULBBYA",
  //     methods: ["applepay"],
  //     callback_url: `https://localhost:5173/report/new`,
  //     apple_pay: {
  //       country: "SA",
  //       label: "Awesome Cookie Store",
  //       validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
  //     },
  //     on_completed: function (payment) {
  //       return new Promise(function (resolve, reject) {
  //         // savePayment is just an example, your usage may vary.
  //         if (savePayment(payment)) {
  //           resolve({});
  //         } else {
  //           reject();
  //         }
  //       });
  //     },
  //   });
  // }, [])
  const navigate = useNavigate();

  const handleSubmit = async (e, to) => {
    event.preventDefault();

    fetch("https://einvoice.nozzm.com/api/pay_token", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        axios
          .post(
            "https://api.sandbox.checkout.com/applepay/signing-requests",
            {},
            {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
            navigate(`/report/new/${to}`);
          });
      })
      .catch((err) => console.log(err));
    // console.log(res.json())
  };


  return (
    <div className="checkout">
      <div className="checkout-container">
        <div class="mysr-form"></div>
        {/* <form
            id="payment-form"
            method="POST"
            action="https://merchant.com/charge-card"
            onSubmit={handleSubmit}
          >
            <div className="one-liner">
              <div className="card-frame"></div>
            </div>
            <p className="error-message"></p>
            <p className="success-payment-message"></p>
          </form> */}
        {/* <div style={buttonStyle}>
          <button
            style={{
              width: "var(--apple-pay-button-width)",
              height: "var(--apple-pay-button-height)",
              borderRadius: "var(--apple-pay-button-border-radius)",
              padding: "var(--apple-pay-button-padding)",
              boxSizing: "var(--apple-pay-button-box-sizing)",
            }}
            onClick={onApplePayButtonClicked}
            type="button"
          >
            Apple Pay
          </button>
        </div> */}
        <Button
          text="Pay with "
          id="pay-button"
          onClick={(e) => handleSubmit(e, '5')}
          // to={props.path}
        />
      </div>
    </div>
  );
};

// const Input = (props) => (
//   <div className="input">
//     <label>{props.label}</label>
//     <div className="input-field">
//       <input type={props.type} name={props.name} />
//       <img src={props.imgSrc} />
//     </div>
//   </div>
// );

const Button = (props) => (
  <button className="checkout-btn" type="button" onClick={props.onClick}>
    {props.text}
    <img src={apple} width={25} height={30} />
  </button>
);
