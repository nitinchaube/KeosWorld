import React from "react";
import { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  createSub,
  getSub,
  getSubs,
  removeSub,
} from "../../../Functions/sub";
import {
  getCategories
} from "../../../Functions/categories";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory]=useState("");
  const [subs, setSubs]=useState([]);
  //searching Filtering
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = () => {
    getCategories().then((c) => setCategories(c.data));
  };

  const loadSubs = () => {
    getSubs().then((c) => setSubs(c.data));
    // console.log(subs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(name);
    setLoading(true);
    createSub({ name, parent:category }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`${res.data.name} SubCategory is created`);
        loadSubs();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleRemove = async (slug) => {
    let answer = window.confirm("Confirm Delete?");
    if (answer) {
      setLoading(true);
      removeSub(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error(`${res.data.name} subCategory deleted`);
          loadSubs();
        })
        .catch((err) => {
          console.log(err);

          if (err.response.status === 400) {
            setLoading(false);
            toast.error(err.response.data);
          }
        });
    }
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? <h4>Loading ...</h4> : <h4>Create SubCategory</h4>}

          <div className="form-group">
            <label><b> Parent Category :</b></label>
            <select className="form-control" name="category" onChange={(e)=>setCategory(e.target.value)}>
              <option>Please Select a Category</option>
              {categories.length > 0 && categories.map((c)=>(
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {subs.filter(searched(keyword)).map((s) => (
            <div className="alert alert-secondary" key={s._id}>
              {s.name}
              <span
                className="btn btn-sm float-right"
                onClick={() => handleRemove(s.slug)}
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/sub/${s.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCreate;
