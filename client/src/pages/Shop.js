import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../Functions/product";
import { getCategories } from "../Functions/categories";
import { getSubs } from "../Functions/sub";
import ProductCard from "../components/card/ProductCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Star from "../components/forms/Star";

const { SubMenu, ItemGroup } = Menu;
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState("");
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
  ]);
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [shipping, setShipping]=useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");

  let dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search; //search reduer has attribute text in the made reducer

  useEffect(() => {
    loadAllProducts();
    //fetch categories
    getCategories().then((res) => setCategories(res.data));
    //fetch subCategories
    getSubs().then((res) => setSubs(res.data));
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  //1: load products by default on page load
  const loadAllProducts = () => {
    getProductsByCount(12).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  //2: load products on user search input
  useEffect(() => {
    //settimeout is used to dalay the request on typing in searchbox at time many requests get sent so we are delaying it by 300 ms.
    const delayed = setTimeout(() => {
      fetchProducts({ query: text }); //in backend we are accepting text as query
      if(!text){
        loadAllProducts();
      }
    }, 300);

    return () => clearTimeout(delayed);
  }, [text]);

  //3:load prodcuts based on price range
  useEffect(() => {
    console.log("ok to request");
    fetchProducts({ price }); //sending the price range to backend
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" }, //removing the text in search bar
    });
    setCategoryIds([]); // removing all the checked categories.
    setStar(""); //reset the star to nothing
    setPrice(value);
    setSub(""); //reset the selected sub state to empty
    setBrand(""); //reset the selected brand to none
    setColor("") //empty the if selected color
    setShipping(""); //set the shipping value to empty
    setTimeout(() => {
      //delaying the time by 300ms
      setOk(!ok);
    }, 300);
  };

  //4: Load products based on categories
  const showCategories = () =>
    categories.map((c) => (
      <div className="p-1" key={c._id}>
        <Checkbox
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          onChange={handleCheck}
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  const handleCheck = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" }, //removing the text in search bar
    });
    setPrice([0, 0]);
    setStar(""); //reset the star to nothing
    setSub(""); //reset the selected sub state to empty
    setBrand(""); //reset the selected brand to none
    setColor("") //empty the if selected color
    setShipping(""); //set the shipping value to empty

    // console.log(e.target.value)
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); //it returns the index of that element or -1

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1); //splice(index from which u want to remove , how many from there)
    }

    setCategoryIds(inTheState);

    fetchProducts({ category: inTheState });
  };

  //5: load product by star rating

  const handleStarClick = (num) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" }, //removing the text in search bar
    });
    setPrice([0, 0]); //reset the price
    setCategoryIds([]); //reset the selected categories to none selected
    setSub(""); //reset the selected sub state to empty
    setBrand(""); //reset the selected brand to none
    setColor("") //empty the if selected color
    setShipping(""); //set the shipping value to empty
    fetchProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  //6: show products by subCategory
  const showSubs = () =>
    subs.map((s) => (
      <div
        key={s._id}
        onClick={() => handleSub(s)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: "pointer" }}
      >
        {s.name}
      </div>
    ));

  const handleSub = (sub) => {
    //console.log("sub", sub);
    setSub(sub);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" }, //removing the text in search bar
    });
    setPrice([0, 0]); //reset the price
    setCategoryIds([]); //reset the selected categories to none selected
    setStar(""); // reset the stars selected
    setBrand(""); //reset the selected brand to none
    setColor("") //empty the if selected color
    setShipping(""); //set the shipping value to empty
    fetchProducts({ sub: sub });
  };

  //7: show brands and its filtering

  const showBrands = () =>
    brands.map((b) => (
      <Radio
        key={b}
        value={b}
        name={b}
        checked={b == brand}
        onChange={handleBrand}
        className="pb-1 pl-4 pr-5"
      >
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" }, //removing the text in search bar
    });
    setPrice([0, 0]); //reset the price
    setCategoryIds([]); //reset the selected categories to none selected
    setStar(""); // reset the stars selected
    setColor("") //empty the if selected color
    setShipping(""); //set the shipping value to empty
    setBrand(e.target.value);
    fetchProducts({ brand: e.target.value });
  };

  //8:show products based on color
  const showColors=()=> colors.map((c)=>(
    <Radio
        key={c}
        value={c}
        name={c}
        checked={c == color}
        onChange={handleColor}
        className="pb-1 pl-4 pr-5"
      >
        {c}
      </Radio>
  ))

  const handleColor=(e)=>{
    setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" }, //removing the text in search bar
    });
    setPrice([0, 0]); //reset the price
    setCategoryIds([]); //reset the selected categories to none selected
    setStar(""); // reset the stars selected
    setBrand("");   // set the brand to empty
    setShipping(""); //set the shipping value to empty
    setColor(e.target.value)
    fetchProducts({ color: e.target.value });
  }

  //9: Shipping based filtering
  const showShipping=()=>(
    <>
      <Checkbox className="pb-2 pl-4 pr-4" onChange={handleShippingChange} value="Yes" checked={shipping === "Yes"}>
        Yes
      </Checkbox>
      <Checkbox className="pb-2 pl-4 pr-4" onChange={handleShippingChange} value="No" checked={shipping === "No"}>
        No
      </Checkbox>
    </>
  )

  const handleShippingChange=(e)=>{
    setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" }, //removing the text in search bar
    });
    setPrice([0, 0]); //reset the price
    setCategoryIds([]); //reset the selected categories to none selected
    setStar(""); // reset the stars selected
    setBrand("");   // set the brand to empty
    setColor(""); // setting the color if selected to empty
    setShipping(e.target.value)
    fetchProducts({ shipping: e.target.value });
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search / Filter</h4>
          <hr />
          <Menu defaultOpenKeys={["1", "3","6","7","4"]} mode="inline">
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined />
                  Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => v}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="1000000"
                />
              </div>
            </SubMenu>
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Categories
                </span>
              }
            >
              <div
                style={{
                  marginTop: "3px",
                  height: "200px",
                  overflow: "scroll",
                  overflowX: "hidden",
                }}
              >
                {showCategories()}
              </div>
            </SubMenu>
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined />
                  Ratings
                </span>
              }
            >
              <div
                style={{
                  marginTop: "3px",
                }}
              >
                {showStars()}
              </div>
            </SubMenu>
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Sub Categories
                </span>
              }
            >
              <div
                className="pl-4 pr-4"
                style={{
                  marginTop: "3px",
                }}
              >
                {showSubs()}
              </div>
            </SubMenu>
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Brands
                </span>
              }
            >
              <div
                style={{
                  marginTop: "3px",
                }}
                className="pr-5"
              >
                {showBrands()}
              </div>
            </SubMenu>
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Colors
                </span>
              }
            >
              <div
                style={{
                  marginTop: "3px",
                }}
                className="pr-5"
              >
                {showColors()}
              </div>
            </SubMenu>
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Shipping
                </span>
              }
            >
              <div
                style={{
                  marginTop: "3px",
                }}
                className="pr-5"
              >
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 pt-3">
          {loading ? (
            <h4 className="text-danger">Loading ....</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}
          {products.length < 1 && <p>No Products found </p>}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
