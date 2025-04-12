import React, { useState } from "react";
import { Card , Tooltip } from "antd";
import defaultImage from "../../images/defaultImage.png";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { showAverage } from "../../Functions/rating";
import _ from "lodash";
import {useSelector, useDispatch} from "react-redux";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const [tooltip, setTooltip]= useState("Click To Add")
  //redux
  const {user, cart} = useSelector((state)=>({ ...state }));
  const dispatch= useDispatch()

  const handleAddToCart = () => {
    
    //create cart array
    let cart=[]
    if(typeof window !== 'undefined'){
      //if cart is in local storage get it
      if (localStorage.getItem('cart')){
        cart= JSON.parse(localStorage.getItem('cart'));
      }
      //push new product to cart
      cart.push({
        ...product,
        count:1,
      });
      //remove the duplicates product
      let unique= _.uniqWith(cart, _.isEqual);
      //save to local storage
      // console.log("unique",unique);
      localStorage.setItem("cart",JSON.stringify(unique));

      //show tooltip
      setTooltip("Added") 

      //add to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique
      })

      //show cart item inside the drawer
      dispatch({
        type:"SET_VISIBLE",
        payload: true,
      })
    }

  }

  const { images, title, description, slug, price } = product;
  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">No Ratings yet.</div>
      )}

      <Card
        hoverable
        cover={
          <img
            src={images && images.length ? images[0].url : defaultImage}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
          ></img>
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" />
            <br /> View Product
          </Link>,
          <Tooltip title={tooltip}>
             <a onClick={handleAddToCart} disabled={product.quantity < 1}>
            <ShoppingCartOutlined className="text-danger" />
            <br /> {product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
          </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title}`}
          description={`${description && description.substring(0, 50)}...`}
        />
        <h6 className="float-right text-danger">- ₹ {`${price}`} </h6>
      </Card>
    </>
  );
};

export default ProductCard;
