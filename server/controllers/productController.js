const Product= require("../models/Product");

exports.getProducts=async(req,res)=>{
    try{
        const products=await Product.find();
        res.json(products);
    }
    catch(error){
        res.status(500).json({message: "Server Error"});
    }
};
exports.getProductById=async(req,res)=>{
    try{
        const product=await product.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(400).json({message:"Product Not found"});
        }

    }
    catch(error){
        res.status(500).json({message:" Server Error"});
    }
};

exports.createProduct=async(req,res)=>{
    try{
        const {name, description, price, category, image, countInStock }=req.body;
        const product = new Product({
      name,
      description,
      price,
      category,
      image,
      countInStock
    });
    const createdProduct= await product.save();
    res.status(201).json(createdProduct);
    }
    catch(error){
        res.status(500).json({ message: "Error creating product" });
    }
};


exports.updateProduct= async(req,res)=>{
    try{
        const product= await Product.findById(req.params.id);
        if(product){
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.image = req.body.image || product.image;
      product.countInStock = req.body.countInStock || product.countInStock;
      
      const updatedProduct=await product.save();
      res.json(updatedProduct); 
    }
    else{
        res.status(404).json({message:"Product Not Found"});
    }

    }
     catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
