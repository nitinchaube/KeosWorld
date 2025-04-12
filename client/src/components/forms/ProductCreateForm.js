import React from "react";
import { Select } from "antd";
const { Option } = Select;

const ProductCreateForm = ({
  handleChange,
  handleSubmit,
  values,
  setValues,
  handleCategoryChange,
  subOptions,
  showSub,
}) => {
  //destrcture
  const {
    title,
    description,
    price,
    categories,
    category,
    subs,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>
          <b>Title</b>
        </label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={title}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>
          <b>Description</b>
        </label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>
          <b>Price</b>
        </label>
        <input
          type="text"
          name="price"
          className="form-control"
          value={price}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>
          <b>Shipping</b>
        </label>
        <select
          name="shipping"
          className="form-control"
          onChange={handleChange}
        >
          <option>Please Select</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div className="form-group">
        <label>
          <b>Quantity</b>
        </label>
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={quantity}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>
          <b>Color</b>
        </label>
        <select name="color" className="form-control" onChange={handleChange}>
          <option>Please Select</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>
          <b>Brand</b>
        </label>
        <select name="brand" className="form-control" onChange={handleChange}>
          <option>Please Select</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>
          {" "}
          <b>Category :</b>
        </label>
        <select
          className="form-control"
          name="category"
          onChange={handleCategoryChange}
        >
          <option>Please Select a Category</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      {showSub && (
        <div>
          <label>
            {" "}
            <b>Sub Categories :</b>
          </label>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            value={subs}
            onChange={(value) => setValues({ ...values, subs: value })}
          >
            {subOptions.length &&
              subOptions.map((s) => (
                <Option key={s._id} value={s._id}>
                  {s.name}
                </Option>
              ))}
          </Select>
        </div>
      )}
      <br />

      <button className="btn btn-outline-info">Save</button>
    </form>
  );
};

export default ProductCreateForm;
