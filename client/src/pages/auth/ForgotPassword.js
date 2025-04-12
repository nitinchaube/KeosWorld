import React from "react";
import { useState, useEffect } from "react";
import { auth } from "../../firebase"; //firebase auth
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state })); //if user is already loggedin then taking the user info from redux

  useEffect(() => {
    if (user && user.token) {
      //if user is loggedin so prevent user user to go to this forgotPassword page manually
      history.push("/");
    }
  }, [user, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success(
          "Check Your Email for furthur process to reset your Password."
        );
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
        console.log(error);
      });
  };

  return (
    <div className="container col-md-6 offset-md-3 p-5">
      {loading ? (
        <h4 className="text-danger">Loading</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Type your Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <br />
        <br />

        <button
          className="btn btn-raised"
          block
          shape="round"
          disabled={!email}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
