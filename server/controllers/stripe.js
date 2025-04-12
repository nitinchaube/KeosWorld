const User= require("../models/user")
const Cart= require("../models/cart")
const Product= require("../models/product")
const Coupon= require("../models/coupon")
const stripe= require("stripe")(process.env.STRIPE_SECRET);


exports.createPaymentIntent= async(req, res)=>{
    // console.log(req.body.couponApplied);
    
    //1:find the user
    const user= await User.findOne({email: req.user.email}).exec();
    //2:get user cart total
    const {cartTotal, totalAfterDiscount}= await Cart.findOne({orderdBy: user._id}).exec()
    // console.log("CART TOTAL CHARGED:",cartTotal, "AFTER DISCOUNT", totalAfterDiscount)
    let finalAmount = 0;

    if(req.body.couponApplied && totalAfterDiscount){
        finalAmount=(totalAfterDiscount * 100);
    }else {
        finalAmount=cartTotal*100;
    }
    
    // create payment intent with order amount and currency
    const paymentIntent= await stripe.paymentIntents.create({
        amount:finalAmount,       //converting into paise or cents
        currency: "inr",
        description:"Got the Money"
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable: finalAmount
    });
};