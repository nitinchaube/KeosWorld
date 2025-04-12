import React from "react";
import { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase"; //firebase auth
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";

import { createOrUpdateUser } from "../../Functions/auth";

const Login = ({ history }) => {
  let dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state })); //if user is already loggedin then taking the user info from redux
  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) {
        //if user is loggedin so prevent user user to go to this Login page manually
        history.push("/");
      }
    }
  }, [user, history]);

  const roleBasedRedirect = (res) => {
    //check if intended .Check RatingMOdel.js for bettterr understanding. we are going to page afterlgin on whick we were ther before login
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      //role based
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    //console.log(email,password)
    try {
      const result = await auth.signInWithEmailAndPassword(email, password); //firebase inbuilt function
      console.log(result);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult(); //firebase

      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
          roleBasedRedirect(res); //instead of history.push we are redirecting based on the role of the user
        })
        .catch((err) => console.log(err));

      //history.push("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult(); //firebase

        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
            roleBasedRedirect(res); //instead of history.push we are redirecting based on the role of the user
          })
          .catch((err) => console.log(err));
        //history.push("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          placeholder="Enter your Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        ></input>
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Enter your Password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>

      <br />

      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );
  return (
    <div className="container pt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading ...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {loginForm()}

          {/* //signin with google */}
          <Button
            onClick={googleLogin}
            type="danger"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with google
          </Button>

          <Link to="/forgot/password" className="float-right text-danger">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
