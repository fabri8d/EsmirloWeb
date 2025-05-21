const { createProductService, purchaseVariantService, changePriceProductService } = require("../services/productService");

async function createProduct(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const result = await createProductService(dataSource, req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: err.message });
  }
};

async function purchaseVariant(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const result = await purchaseVariantService(dataSource, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function changePriceProduct(req,res) {
    try {
    const dataSource = req.app.get("dataSource");
    const result = await changePriceProductService(dataSource, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
    
}


module.exports = {
  createProduct,
  purchaseVariant,
  changePriceProduct
};
