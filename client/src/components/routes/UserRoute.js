// for making the user routes only for users  in short(protecting the routes)
import React from "react";
import {Route} from "react-router-dom";
import {useSelector} from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute =({children, ...rest})=>{

    //teking the user from redux store
    const {user}= useSelector((state)=> ({...state}));

    return user && user.token ? (
        <Route {...rest}/>
    ) : (
        <LoadingToRedirect/>
    )
}

export default UserRoute;