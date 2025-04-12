import React from "react";


const ShowPaymentInfo =({order, showStatus=true}) => (
    <div>
        <p>
            {console.log("order: -----------",order)}
            <span><b>Order Id: <p className="text-primary">{order.paymentIntent.id}</p></b></span>
            <span>
                <b>Amount:</b>
                {(order.paymentIntent.amount /= 100).toLocaleString("en-US", {
                    style : "currency",
                    currency: "INR",
                })}
            </span>
            {" |  "}
            <span><b>Currency:</b> {order.paymentIntent.currency.toUpperCase()}</span>{" |  "}
            <span><b>Method :</b> {order.paymentIntent.payment_method_types[0]}</span>{" |  "}
            <span><b>Payment :</b> {order.paymentIntent.status.toUpperCase()}</span>{" |  "}
            <span>
                <b>Ordered on:</b> {" |  "}
                {new Date(order.paymentIntent.created * 1000).toLocaleString()}
            </span>
            {/* <br/>
            <hr/> */}
            <br/>
            
            { showStatus && <span className="badge bg-primary text-white">STATUS: {order.orderStatus}</span>}

        </p>
    </div>
);

export default ShowPaymentInfo;