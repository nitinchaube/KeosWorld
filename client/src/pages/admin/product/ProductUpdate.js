import React from "react";
import { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getProduct,updateProduct } from "../../../Functions/product";

import {
  getCategories,
  getCategoriesSubs,
} from "../../../Functions/categories";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "",
  brand: "",
};

//to get the slug from the the router we can use two method 1st:using match param of reactRouter and 2nd : using reacthook useParams
const ProductUpdate = ({ match, history }) => {
  //state
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOption] = useState([]);
  const [categories, setCategories] = useState([]);
  const [arrayOfSubs, setArrayOfSubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [loading, setLoading] = useState(false);

  //redux state
  const { user } = useSelector((state) => ({ ...state }));
  //router
  const { slug } = match.params;

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = () => {
    getProduct(slug).then((p) => {
      //   console.log("single Product", p);
      setValues({ ...values, ...p.data });
      //load single product category subs
      getCategoriesSubs(p.data.category._id).then((res) => {
        setSubOption(res.data);
      });
      //prepare array of sub ids to show as default sub for antd Select in prouct update form
      let arr = [];
      p.data.subs.map((s) => {
        arr.push(s._id);
      });
      setArrayOfSubs((prev) => arr); //required for antd select
    });
  };
  const loadCategories = () => {
    getCategories().then((c) => setCategories(c.data));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    //setLoading(true);
    // console.log("nitin")
    
    values.subs = arrayOfSubs;
    values.category = selectedCategory ? selectedCategory : values.category;

    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false)
        toast.success(`"${res.data.title}" is updated.`);
        history.push('/admin/products')
      })
      .catch(err => {
        setLoading(false)
        console.log(err);
        toast.error(err.response.data.err);
      })
  };
  const handleCategoryChange = (e) => {
    //GETTING ALL THE SUB BELONGING TO THIS CATEGORY
    e.preventDefault();
    console.log("CLICKED CATEGORY-->", e.target.value);
    setValues({ ...values, subs: [] });
    setSelectedCategory(e.target.value);

    getCategoriesSubs(e.target.value).then((res) => {
      console.log("data of subs -> ", res.data);
      setSubOption(res.data);
    });
    //if users click back to the original category then show its sub categories in default
    if (values.category._id === e.target.value) {
      loadProduct();
    }

    setArrayOfSubs([]); //when the category is changed ,remove all the selected subs
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // console.log(e.target.name,"-----",e.target.value)
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          <h3> Product update</h3>
          {/* {JSON.stringify(values)} */}
          {loading ? <LoadingOutlined /> : <p></p>}
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubs={arrayOfSubs}
            setArrayOfSubs={setArrayOfSubs}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
