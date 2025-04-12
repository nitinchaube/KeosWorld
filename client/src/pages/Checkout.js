import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserCart, emptyUserCart, saveUserAddress, applyCoupon, createCashOrderForUser } from "../Functions/user";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = ({history}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon , setCoupon]= useState("");
  const [totalAfterDiscount, settotalAfterDiscount]=useState(0);
  const [discountError, setDiscountError]=useState("");

  const dispatch = useDispatch();
  const { user, COD } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log("user carrt res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const emptyCart = () => {
    //remover cart from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    //remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    //remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      settotalAfterDiscount(0)
      toast.success("Cart is empty. Continue Shopping");
    });
  };

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address Saved");
      }
    });
  };

  const applyDiscountCoupon=()=>{
    //   console.log('send coupon to backend', coupon)
    applyCoupon(user.token, coupon)
    .then(res =>{
         console.log("res on coupon Applied",res.data);
         if(res.data){
             settotalAfterDiscount(res.data);
             //update redux coupon applied true/false
             dispatch({
                type:"COUPON_APPLIED",
                payload: true
             });
         }
         if(res.data.err){
             setDiscountError(res.data.err);
             
             //update redux coupon applied
             dispatch({
                type:"COUPON_APPLIED",
                payload: false
             });
         }
    })

  }

  const showAddress = () => (
    <>
      {/* the whole value of address will be set automatically by onChange by react quill */}
      <ReactQuill className="pl-3" theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () => (
    products.map((p, i) => (
        <div key={i}>
          <b>
            <p>
              {p.product.title} ({p.color}) x {p.count}= ₹
              {p.product.price * p.count}
            </p>
          </b>
        </div>
      ))
    )

  const showApplyCoupon=()=>(
      <div>
          <input placeholder="Put Coupon here" onChange={(e)=>{setCoupon(e.target.value); setDiscountError("")}} value={coupon} type="text" className="form-control pl-3"></input>
          <button className="btn btn-primary mt-2" onClick={applyDiscountCoupon}>Apply Coupon</button>
      </div>
  )

  const createCashOrder=()=> {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res)=>{
      console.log("USER CASH ORDER CREATED RES ",res);
      //empty cart from redux, localstorage, reset coupon, reset COD, redirect
      if(res.data.ok){
        //empty localStorage
        if(typeof window !== 'undefined') localStorage.removeItem('cart')
        //empty redux cart
        dispatch({
          type: "ADD_TO_CART",
          payload: []
        });
        //empty redux coupon
        dispatch({
          type: "COUPON_APPLIED",
          payload:false
        })
        // empty redux COD
        dispatch({
          type: "COD",
          payload: false
        });
        //empty cart from backend
        emptyUserCart(user.token);
        //redirect 
        setTimeout(()=>{
          history.push("/user/history")
        },1000)
      }
    })
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br/>
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products: {products.length}</p>
        <hr />
        {showProductSummary()}
        <hr />
        <b>
          <h4>Cart total: ₹{total}</h4>
        </b>
        <br/>
        {totalAfterDiscount>0 && (
            <p className="bg-success p-2">Discount Applied: Total Payable: ₹{totalAfterDiscount}</p>
        )}
        <div className="row">
          <div className="col-md-6">
            {COD ?
              (
                <button
                onClick={createCashOrder}
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
              >
              Place Order.
            </button>
              )
             : 
            (
              <button
              onClick={()=> history.push("/payment")}
              className="btn btn-primary"
              disabled={!addressSaved || !products.length}
            >
              Place Order
            </button>
            )}
          </div>
          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
