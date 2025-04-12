import React, { useEffect, useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { useDispatch, useSelector } from "react-redux";
import { removeWishList, getWishlist } from "../../Functions/user";
import { Link } from "react-router-dom";
import {DeleteOutlined} from "@ant-design/icons"

const Wishlist = () => {

  const [wishlist, setWishlist]= useState([]);
  const {user}= useSelector(state => ({...state}))

  useEffect(()=>{
    loadWishlist();
  },[]);

  const loadWishlist = ()=> {
      getWishlist(user.token).then((res)=>{
        //   console.log(res.data)
        setWishlist(res.data.wishlist)
      })
  }

  const handleRemove = (productId) =>
    removeWishList(productId, user.token).then((res)=> {
        // console.log("deleted")
        loadWishlist();
    });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
             <h4>
                Wishlist
             </h4>
             {
                 wishlist.map((p) => (
                     <div key={p._id} className="alert alert-secondary">
                        <Link to={`/product/${p.slug}`}>{p.title}</Link>
                        <span
                            onClick={()=> handleRemove(p._id)}
                            className="btn btn-sm float-right"
                        >
                            <DeleteOutlined/>
                        </span>
                     </div>
                 ))
             }
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
