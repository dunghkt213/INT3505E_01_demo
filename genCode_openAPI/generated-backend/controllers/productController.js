const Product = require('../models/Product');

// ✅ GET /products
module.exports.getProducts = async function(req, res) {
  const products = await Product.find();
  return res.status(200).json(products);
};

// ✅ POST /products
module.exports.createProduct = async function(req, res) {
  const product = await Product.create(req.body);
  return res.status(201).json(product);
};

// ✅ GET /products/{id}
module.exports.getProductById = async function(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(product);
};

// ✅ PUT /products/{id}
module.exports.updateProduct = async function(req, res) {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!product) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(product);
};

// ✅ DELETE /products/{id}
module.exports.deleteProduct = async function(req, res) {
  await Product.findByIdAndDelete(req.params.id);
  return res.status(204).send();
};
