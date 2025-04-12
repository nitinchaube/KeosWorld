import React , {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";

const LoadingToRedirect= () =>{
    const [count, setCount]=useState(5);
    let history=useHistory();   //for redirecting to particular routes

    useEffect(()=>{

        const interval= setInterval(()=>{   // its a inbuild method in js to setting the interval in windows.
            setCount((currentCount)=> --currentCount);
        },1000)
        //redirect when count == 0
        count === 0 && history.push("/");
        //cleanup
        return() => clearInterval(interval);
    },[count, history]);

    return (
        <div className="container p-5 text-center">
            <p>Redirecting you in {count} seconds.</p>
        </div>
    )
}

export default LoadingToRedirect;