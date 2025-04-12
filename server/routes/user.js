const express= require("express");
const { auth } = require("firebase-admin");

const router= express.Router();
//controller
const {userCart, getUserCart, emptyCart,saveAddress, applyCouponToUserCart, createOrder,createCashOrder, orders, addToWishList, wishlist, removeFromWishList} = require("../controllers/user")
//middlewares
const {authCheck, adminCheck}= require("../middlewares/auth")

// router.get("/user",(req,res)=>{
//     res.json({
//         data:"hey you hit user  API endpoint",
//     })
// })

//route for saving the cart
router.post("/user/cart",authCheck, userCart);
router.get("/user/cart",authCheck, getUserCart);
router.delete("/user/cart",authCheck, emptyCart);
router.post("/user/address",authCheck, saveAddress);

router.post("/user/order",authCheck, createOrder);
router.get("/user/orders",authCheck, orders);
router.post("/user/cash-order", authCheck, createCashOrder);

//coupon
router.post('/user/cart/coupon',authCheck, applyCouponToUserCart);
//wishlist

router.post("/user/wishlist",authCheck, addToWishList);
router.get("/user/wishlist",authCheck, wishlist);
router.put("/user/wishlist/:productId",authCheck, removeFromWishList);

module.exports=router;