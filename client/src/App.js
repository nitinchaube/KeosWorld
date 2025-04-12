import React,  { useEffect , lazy, Suspense }  from "react";
import { Switch, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./Functions/auth";
import {LoadingOutlined} from "@ant-design/icons";


const Header =lazy(()=> import("./components/nav/Header")) ;
const Login =lazy(()=> import("./pages/auth/Login")) ;
const Register =lazy(()=> import("./pages/auth/Register")) ;
const Home =lazy(()=> import("./pages/Home")) ;
const RegisterComplete =lazy(()=> import("./pages/auth/RegisterComplete")) ;
const History =lazy(()=> import("./pages/user/History")) ;
const UserRoute =lazy(()=> import("./components/routes/UserRoute")) ;
const AdminDashboard =lazy(()=> import("./pages/admin/AdminDashboard")) ;
const AdminRoute =lazy(()=> import("./components/routes/AdminRoute")) ;
const Password =lazy(()=> import("./pages/user/Password")) ;
const Wishlist =lazy(()=> import("./pages/user/Wishlist")) ;
const CategoryCreate =lazy(()=> import("./pages/admin/category/CategoryCreate")) ;
const CategoryUpdate =lazy(()=> import("./pages/admin/category/CategoryUpdate")) ;
const SubCreate =lazy(()=> import("./pages/admin/sub/subCreate")) ;
const SubUpdate =lazy(()=> import("./pages/admin/sub/subUpdate")) ;
const ProductCreate = lazy(()=> import("./pages/admin/product/ProductCreate")) ;
const AllProducts =lazy(()=> import("./pages/admin/product/AllProducts")) ;
const ProductUpdate =lazy(()=> import("./pages/admin/product/ProductUpdate")) ;
const Product =lazy(()=> import("./pages/admin/product/Product")) ;
const CategoryHome =lazy(()=> import("./pages/category/CategoryHome")) ;
const SubHome =lazy(()=> import("./pages/sub/SubHome")) ;
const Shop =lazy(()=> import("./pages/Shop")) ;
const Cart =lazy(()=> import("./pages/Cart")) ;
const ForgotPassword =lazy(()=> import("./pages/auth/ForgotPassword")) ;
const SideDrawer =lazy(()=> import("./components/drawer/SideDrawer")) ;
const Checkout =lazy(()=> import("./pages/Checkout")) ;
const CreateCouponPage =lazy(()=> import("./pages/admin/coupon/CreateCouponPage")) ;
const Payment =lazy(()=> import("./pages/Payment"));
const FooterComponent =lazy(()=> import("./components/nav/Footer"));
const App = () => {
  
  const dispatch = useDispatch();

  //to check firebase auth state
  useEffect(() => {
    const unsubscibe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult(); //getting user tokenid from firebase auth
        console.log("user", user);
        currentUser(idTokenResult.token)
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
          })
          .catch((err) => console.log(err));
      }
    
    });

    //cleanup
    return () => unsubscibe();
  }, [dispatch]);
 

  return (
    <Suspense
      fallback={
        <div className="col text-center p-5">
          __KE<LoadingOutlined />SWORLD__ :)
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <SideDrawer />
        <ToastContainer />
        
        <div style={{ flex: 1 }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/register/complete" component={RegisterComplete} />
            <Route exact path="/forgot/password" component={ForgotPassword} />
            <UserRoute exact path="/user/history" component={History} />
            <UserRoute exact path="/user/password" component={Password} />
            <UserRoute exact path="/user/wishlist" component={Wishlist} />
            <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
            <AdminRoute exact path="/admin/category" component={CategoryCreate} />
            <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate} />
            <AdminRoute exact path="/admin/sub" component={SubCreate} />
            <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate} />
            <AdminRoute exact path="/admin/product" component={ProductCreate} />
            <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate} />
            <AdminRoute exact path="/admin/products" component={AllProducts} />
            <Route exact path="/product/:slug" component={Product} />
            <Route exact path="/category/:slug" component={CategoryHome} />
            <Route exact path="/sub/:slug" component={SubHome} />
            <Route exact path="/shop" component={Shop} />
            <Route exact path="/cart" component={Cart} />
            <UserRoute exact path="/checkout" component={Checkout} />
            <AdminRoute exact path="/admin/coupon" component={CreateCouponPage} />
            <UserRoute exact path="/payment" component={Payment} />
          </Switch>
        </div>
  
        <FooterComponent />
      </div>
    </Suspense>
  );
};

export default App;
