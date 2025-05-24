const { createProductService, purchaseVariantService, changePriceProductService, getProductsService, getProductByIDService, getProductsByCategoryService, getProductsByNameService, getVariantsByProductService } = require("../services/productService");

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
    const result = await changePriceProductService(dataSource, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

}

async function getProducts(req, res) {
  try {
    const dataSource = req.app.get("dataSource");
    const products = await getProductsService(dataSource);
    res.json(products);
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
module.exports = {
  createProduct,
  purchaseVariant,
  changePriceProduct,
  getProducts,
  getProductByID,
  getProductsByCategory,
  getProductsByName,
  getVariantsByProduct
};
