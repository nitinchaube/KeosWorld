const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");
const { rawListeners } = require("../models/product");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.body.title);
    req.body.slug = slugify(req.body.title);
    console.log(req.body);
    //now everything is there in req.body so directly saving it
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    // res.status(400).send("Create Product Failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product delete Failed");
  }
};
exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      //for updating the slug
      req.body.slug = slugify(req.body.title);
    }
    // console.log("got it");
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log("Product update Error --->", err);
    res.status(400).json({
      err: err.message,
    });
  }
};

// exports.list =async(req, res)=>{         //without pagenation
//   try{

//     const {sort, order, limit}=req.body         //created At/updatedAt, asc/desc, countlimit
//     const products=await Product.find({})
//       .populate('category')
//       .populate('subs')
//       .sort([[sort,order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   }catch (err){
//     console.log(err);
//   }
// }

exports.list = async (req, res) => {
  //with pagenation
  try {
    const { sort, order, page } = req.body; //created At/updatedAt, asc/desc, countlimit
    const currentPage = page || 1;
    const perPage = 3;
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage) //skipping the product in previous page ie. for page 3 skip 2*3=6 products
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

//ratings
exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  //check if currently logged in user have already added rating to  this product
  let existingRatingObject = product.ratings.find(
    (ele) => ele.postedBy.toString() === user._id.toString()
  );

  //if user havent left rating yet, push it
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded);
  } else {
    //if user have already left rating , update it
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: existingRatingObject } },
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();
    console.log("ratingUpdated", ratingUpdated);
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.json(related);
};

//Search Filter

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } }) // it search if the query is present in which of the products
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      //finding products having price in rangex and y i.e. price:[x,y]
      price: {
        $gte: price[0], //greater than equal to
        $lte: price[1], //less than equal to
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleStar = (req, res, stars) => {
  Product.aggregate([
    //there are many ratings for a product so using aggregate
    {
      $project: {
        document: "$$ROOT", //gives the whole product as a documnets
        floorAverage: {
          $floor: { $avg: "$ratings.star" }, // taking the avg of all the ratings of a product and taking the floor of it
        },
      },
    },
    {
      $match: { floorAverage: stars }, // taking those product having floorAverage=== stars
    },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregate error", err);
      Product.find({ _id: aggregates }) //finding the product having id as aggregates
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          if (err) console.log("Product Aggregate error", err);
          res.json(products);
        });
    });
};

const handleSub = async (req, res, sub) => {
  const product = await Product.find({ subs: sub })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(product);
};

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    sub,
    shipping,
    color,
    brand,
  } = req.body;

  if (query) {
    console.log("query", query);
    await handleQuery(req, res, query);
  }
  // price based filtering [from, to]
  if (price !== undefined) {
    console.log("price--->", price);
    await handlePrice(req, res, price);
  }
  //category based filtering
  if (category) {
    console.log("category", category);
    await handleCategory(req, res, category);
  }
  //ratings based filtering
  if (stars) {
    console.log("stars", stars);
    await handleStar(req, res, stars);
  }
  //Subcategories based filtering
  if (sub) {
    console.log("Sub--", sub);
    await handleSub(req, res, sub);
  }
  //shipping based filtering
  if (shipping) {
    console.log("Shipping--->", shipping);
    await handleShipping(req, res, shipping);
  }
  //color based filtering
  if (color) {
    console.log("Color--->", color);
    await handleColor(req, res, color);
  }
  //brand based filtering
  if (brand) {
    console.log("Brand--->", brand);
    await handleBrand(req, res, brand);
  }
};
