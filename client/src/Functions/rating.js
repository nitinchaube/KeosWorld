import React from "react";
import StarRatings from "react-star-ratings";


export const showAverage =(p)=>{
    if(p && p.ratings){
        let ratingsArray= p && p.ratings    //getting all the rating array
        let total=[]                        //for storing the star value of each array
        let length = ratingsArray.length    // numbers of rating 

        ratingsArray.map((r)=>total.push(r.star))

        /* how reduce fuction  works , it takes previous and pressent number to perform some function,  reduce(function, initialvalue)
          [1,4,6,7]
          1+4=5
          5+6=11
          11+7=18
        */
        let totalReduced = total.reduce((p,n)=> p+n , 0)
        // console.log(totalReduced);
        let highest= length*5;
        // console.log("highest",highest);
        let result= (totalReduced*5)/highest;
        // console.log("result",result);

        return (
            <div className="text-center pt-1 pb-3">
                <span>
                    <StarRatings starDimension="20px" starSpacing="2px" starRatedColor="red" rating={result} editing={false}/>
                    {" "} ({p.ratings.length})
                </span>
            </div>
        )
    }
}