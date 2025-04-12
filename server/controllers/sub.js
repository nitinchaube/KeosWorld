const Sub = require("../models/sub");
const slugify = require("slugify");
const Product = require("../models/product");


exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    //creating new subCategory
    const subCategory = await new Sub({ name,parent, slug: slugify(name) }).save();
    res.json(subCategory);
  } catch (err) {
    console.log("Sub Create Failed -->",err)
    res.status(400).send("Create subCategory Failed");
  }
};

exports.list = async (req, res) => {
  res.json(await Sub.find({}).sort({ createdAt: -1 }).exec());
};

exports.read = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec(); //collecting the slug from params
  const products = await Product.find({ subs: sub })
    .populate("category")
    .exec();
  res.json({
    sub,
    products
  });
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;

  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name: name,parent,  slug: slugify(name) },
      { new: true } // for passign the newly updated in json
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("subCategory update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("subCategory delete Failed");
  }
};
