import React ,{ useState, useEffect }from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount, removeProduct } from "../../../Functions/product";
import AdminProductCard from "../../../components/card/AdminProductCard";
import {useSelector} from 'react-redux';
import {toast} from "react-toastify";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  //redux
  const {user}= useSelector((state)=>({...state}))
  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleRemove =(slug)=>{
    let ans=window.confirm(`Want to delete ${slug}?`)
    if(ans){
      // console.log("send delete req",slug)
      removeProduct(slug, user.token)
        .then(res => {
          loadAllProducts();
          toast.error(`${res.data.title} is deleted.`)
        })
        .catch(err =>{
          console.log(err);
          if(err.response.status === 400) toast.error(err.response.data)
        })
    }
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>All Products</h4>
          )}
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4 pb-3" key={product._id}>
                <AdminProductCard product={product} key={product._id} handleRemove={handleRemove} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
