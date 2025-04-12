import React from "react";
import {useEffect ,useState} from 'react';
import {getProduct, getRelated, productStar} from "../../../Functions/product";
import SingleProduct from "../../../components/card/SingleProduct";
import {useSelector} from "react-redux";
import ProductCard from "../../../components/card/ProductCard";

const Product =({match})=>{
    const [product, setProduct]= useState({});
    const [related, setRelated]= useState([]);
    const [star, setStar]= useState(0);
    //redux
    const {user}=useSelector((state)=> ({...state}));

    const {slug}= match.params;

    useEffect(()=>{
        loadSingleProduct()
    },[slug]);

    useEffect(()=>{
        if(product.ratings && user){
            let existingRatingObject= product.ratings.find(
                (ele)=> ele.postedBy.toString() === user._id.toString()
            );
            existingRatingObject && setStar(existingRatingObject.star);     //current user star rating
        }
    })

    const loadSingleProduct=()=>{
        getProduct(slug).then((res)=> {
         setProduct(res.data);
         //load related as well
         getRelated(res.data._id).then(res => setRelated(res.data))
        });
    }

    const onStarClick=(newRating, name)=>{
        // console.table(newRating,name);
        setStar(newRating);
        productStar(name, newRating, user.token).then((res)=>{
            console.log("rating clicked",res.data);
            loadSingleProduct();     //for showing updated rating
        })
    }

    return (
       <div className="container-fluid">
            <div className="row pt-4">
                <SingleProduct product={product} onStarClick={onStarClick} star={star}/>
            </div>

            <div className="row">
                <div className="col text-center pt-5 pb-5">
                    <hr/>
                    <h4>Related products</h4>
                    {/* {JSON.stringify(related)} */}
                    
                    <hr/>
                </div>
            </div>
            <div className="row pb-5">
                {
                    related.length ? (related.map((r)=> <div className="col-md-4" key={r._id}>
                        <ProductCard product={r}/>
                    </div>))
                    : (<div className="text-center col">
                            No Related Products
                        </div>)
                }
            </div>
       </div>
    )
}

export default Product;