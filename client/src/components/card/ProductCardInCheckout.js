import React from "react";
import ModalImage from "react-modal-image";
import defaultImage from "../../images/defaultImage.png";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";

const ProductCardInCheckout = ({ p }) => {
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];
  let dispatch = useDispatch();

  const handleColorChange = (e) => {
    console.log("colorChange", e.target.value);

    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].color = e.target.value;
        }
      });

      // console.log("cart updated color", cart);
      localStorage.setItem("cart", JSON.stringify(cart));

      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleQuantityChange = (e) => {
    // console.log("available quantity", p.quantity)

    let count = e.target.value < 1 ? 1 : e.target.value;
    if (count > p.quantity) {
      toast.error(`Maximum available quantity : ${p.quantity}`);
      return;
    }
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].count = count;
        }
      });

      // console.log("cart updated count", cart);
      localStorage.setItem("cart", JSON.stringify(cart));

      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleRemove=(e)=>{
    // console.log(p._id,"to remove");
    //remove this item from local storage and redux store
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, i) => {  
        if (product._id === p._id) {
          cart.splice(i,1);   //splice remove the product from that index to how many e.g splice(1,2) here from index 1 remove 2 product
        }
      });

      
      localStorage.setItem("cart", JSON.stringify(cart));

      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }

  }

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "100px", height: "auto" }}>
            {p.images.length ? (
              <ModalImage small={p.images[0].url} large={p.images[0].url} />
            ) : (
              <ModalImage small={defaultImage} large={defaultImage} />
            )}
          </div>
        </td>
        <td>{p.title}</td>
        <td>{p.price}</td>

        <td>
          <select
            onChange={handleColorChange}
            name="color"
            className="form-control"
            style={{ cursor: "pointer" }}
          >
            {p.color ? <option>{p.color}</option> : <option>Select</option>}
            {colors
              .filter((c) => c !== p.color) //removing the repeated color
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </td>
        <td className="text-center">
          <input
            type="number"
            className="form-control"
            value={p.count}
            onChange={handleQuantityChange}
          ></input>
        </td>
        <td className=" text-center">
          {p.shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success" />
          ) : (
            <CloseCircleOutlined className="text-danger" />
          )}
        </td>
        <td className=" text-center">
          <CloseOutlined onClick={handleRemove} className="text-danger pointer"/>
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
