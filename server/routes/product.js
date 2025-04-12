const express= require("express");

const router= express.Router();
//controllers
const {create, listAll, remove, read, update, list, productsCount, productStar, listRelated,searchFilters}=require("../controllers/product")


//middlewares
const {authCheck, adminCheck}= require("../middlewares/auth")

router.post("/product",authCheck,adminCheck, create);
router.get("/products/total",productsCount)
router.get("/product/related/:productId",listRelated)
router.get("/products/:count",listAll);
router.delete("/product/:slug",authCheck,adminCheck, remove);
router.get("/product/:slug",read);
router.put("/product/:slug",authCheck, adminCheck, update);

router.post("/products",list);


//ratings
router.put("/product/star/:productId",authCheck,productStar)

//search
router.post("/search/filters",searchFilters);







module.exports=router;