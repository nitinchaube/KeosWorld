const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const user = require("../models/user");
const uniqueid = require("uniqueid")

exports.userCart = async (req, res) => {
  const { cart } = req.body;

  let products = [];

  const user = await User.findOne({ email: req.user.email }).exec(); //finding the loggedin User

  //check if cart with logged in userId already exist

  let cartExistByThisUser = await Cart.findOne({ orderdBy: user._id }).exec();
  // console.log("cart exist", cartExistByThisUser)
  if (cartExistByThisUser) {
    cartExistByThisUser.remove();
    console.log("removed old cart");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};

    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    //get actual price for creating total from database
    let productFromDb = await Product.findById(cart[i]._id)
      .select("price")
      .exec();
    object.price = productFromDb.price;

    products.push(object); //pushing the product from cart one by one in product array
  }

  // console.log("Products", products);

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    //getting the total price of cart
    cartTotal = cartTotal + products[i].price * products[i].count;
  }
  // console.log("cart total", cartTotal);

  let newCart = await new Cart({
    //saving the cart in database
    products,
    cartTotal,
    orderdBy: user._id,
  }).save();

  console.log("new Cart", newCart);
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderdBy: user._id })
    .populate("products.product", "_id title price totalAfterdiscount")
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOneAndRemove({ orderdBy: user._id }).exec();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();
  res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log("Coupon", coupon);
  const validCoupon = await Coupon.findOne({ name: coupon }).exec();

  if (validCoupon === null) {
    return res.json({
      err: "Invalid Coupon",
    });
  }
  console.log("Valid Coupon", validCoupon);

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products, cartTotal } = await Cart.findOne({
    orderdBy: user._id,
  })
    .populate("products.product", "_id title price")
    .exec();

  console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

  //total after discount
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2); //99.99999 will become 99.99 bt tofixed

  Cart.findOneAndUpdate(
    { orderdBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  res.json(totalAfterDiscount);
};

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  // console.log(paymentIntent);
  const user = await User.findOne({ email: req.user.email }).exec();
  let { products } = await Cart.findOne({ orderdBy: user._id }).exec();

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderdBy: user._id,
  }).save();

  //decrement the quantity of product and increment the sold number
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, //important item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  //  console.log("Updated Product quantity decr and sold ++", updated);

  console.log("NEW ORDER SAVER ", newOrder);

  res.json({ ok: true });
};

exports.createCashOrder=async (req, res) => {
  const { COD, couponApplied } = req.body;
  //if COD is true create order with status of cash on delivery as true
  if(!COD){
    return res.status(400).send("Create cash order failed.")
  }
  // console.log(paymentIntent);
  const user = await User.findOne({ email: req.user.email }).exec();
  let userCart = await Cart.findOne({ orderdBy: user._id }).exec();

  let finalAmount =0;
  if(couponApplied && userCart.totalAfterDiscount){
    finalAmount= userCart.totalAfterDiscount *100;
  }else {
    finalAmount= userCart.cartTotal *100;
  }
  let today= Date.now()
  
  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      _id: uniqueid(),
      amount: finalAmount,
      currency: "INR",
      status: "Cash On Delivery",
      created: today,
      payment_method_types: ["Cash"],
    },
    orderdBy: user._id,
    orderStatus: "Cash On Delivery"
  }).save();

  //decrement the quantity of product and increment the sold number
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, //important item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  //  console.log("Updated Product quantity decr and sold ++", updated);

  console.log("NEW ORDER SAVER ", newOrder);

  res.json({ ok: true });
}

exports.orders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let userOrders = await Order.find({ orderdBy: user._id })
    .populate(
      "products.product" // products is an array of all the product in cart
    )
    .exec();

  res.json(userOrders);
};

exports.addToWishList = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec();
  res.send({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();
  res.json(list);
};

exports.removeFromWishList = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();
  res.send({ok: true})
};
