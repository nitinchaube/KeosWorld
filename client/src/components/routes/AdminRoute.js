// for making the admin routes only for admin  in short(protecting the routes)
import React , {useEffect, useState} from "react";
import {Route} from "react-router-dom";
import {useSelector} from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import {currentAdmin} from "../../Functions/auth"

const UserRoute =({children, ...rest})=>{

    //teking the user from redux store
    const {user}= useSelector((state)=> ({...state}));
    const [ok, setOk]=useState(false);

    useEffect(() => {
        if(user && user.token){
            currentAdmin(user.token)        //chckingfrom backend whether user is admin , if admin then set ok to true
                .then(res => {
                    console.log("current admin response")
                    setOk(true);
                })
                .catch(err => {
                    console.log("admin route error",err);
                    setOk(false);
                })
        }
    }, [user]);

    return ok ? (
        <Route {...rest}/>
    ) : (
        <LoadingToRedirect/>
    )
}

export default UserRoute;