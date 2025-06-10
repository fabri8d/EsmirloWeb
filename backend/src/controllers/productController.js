const { createProductService, purchaseVariantService, changePriceProductService, getProductsService, getProductByIDService, getProductsByCategoryService, getProductsByNameService, getVariantsByProductService, updateVariantStockService, deleteProductService, deleteVariantService, createVariantService } = require("../services/productService");

async function createProduct(req, res) {
  try {
    const dataSource = req.app.get("dataSource");

    let variantsParsed = [];
    if (typeof req.body.variants === "string") {
      variantsParsed = JSON.parse(req.body.variants);
    } else if (Array.isArray(req.body.variants)) {
      variantsParsed = req.body.variants;
    }

    const productData = {
      ...req.body,
      variants: variantsParsed,
      image: req.file
    };

    const result = await createProductService(dataSource, productData);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: err.message });
  }
}



async function purchaseVariant(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const result = await purchaseVariantService(dataSource, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function changePriceProduct(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const productId = req.params.id;
    const newPrice = req.body.price;
    const result = await changePriceProductService(dataSource, productId, newPrice);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getProducts(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getProductsService(dataSource, page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProductByID(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const id = req.params.id;
    const product = await getProductByIDService(dataSource, id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProductsByName(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const name = req.params.name;
    const products = await getProductsByNameService(dataSource, name);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProductsByCategory(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const category = req.params.category;
    const products = await getProductsByCategoryService(dataSource, category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getVariantsByProduct(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const products = await getVariantsByProductService(dataSource, req.body);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function updateVariantStock(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const variantId = req.params.id;
    const updatedData = req.body;

    const result = await updateVariantStockService(dataSource, variantId, updatedData);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
async function deleteProduct(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const productId = req.params.id;
    const result = await deleteProductService(dataSource, productId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function deleteVariant(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const variantId = req.params.id;
    const result = await deleteVariantService(dataSource, variantId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function createVariant(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const productId = req.body.productId;
    const variantData = req.body;

    const result = await createVariantService(dataSource, productId, variantData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
  createProduct,
  purchaseVariant,
  changePriceProduct,
  getProducts,
  getProductByID,
  getProductsByCategory,
  getProductsByName,
  getVariantsByProduct,
  updateVariantStock,
  deleteProduct,
  deleteVariant,
  createVariant
};
