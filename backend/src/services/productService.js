const Product = require("../models/products/Product.js");
const ProductVariant = require("../models/products/ProductVariant.js");
const Category = require("../models/products/Category.js");
async function createProductService(dataSource, productData) {
  const productRepo = dataSource.getRepository("Product");
  const variantRepo = dataSource.getRepository("ProductVariant");
  const categoryRepo = dataSource.getRepository("Category");

  const existingProduct = await productRepo.findOne({ where: { name: productData.name } });
  if (existingProduct) {
    throw new Error("Ya existe un producto con ese nombre.");
  }



  // Crear el producto
  const product = productRepo.create({
    name: productData.name,
    description: productData.description,
    category: productData.category,
    price: productData.price,
    image: productData.imageUrl,
  });

  await productRepo.save(product);

  // Verificar duplicados de variantes (ya tenemos el producto guardado)
  for (const variant of productData.variants) {
    const duplicateVariant = await variantRepo.findOne({
      where: {
        product: { id: product.id },
        size: variant.size,
        color: variant.color,
      },
      relations: ["product"],
    });

    if (duplicateVariant) {
      throw new Error(`Ya existe una variante con tamaño "${variant.size}" y color "${variant.color}".`);
    }
  }

  // Crear y guardar variantes
  const variants = productData.variants.map(variant =>
    variantRepo.create({
      size: variant.size,
      color: variant.color,
      stock: variant.stock,
      product: product,
    })
  );

  await variantRepo.save(variants);

  // Limpiar referencias circulares
  const cleanVariants = variants.map(({ product, ...rest }) => rest);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    image: product.image,
    variants: cleanVariants,
  };
}



/**
 * Realizar compra de una variante (actualiza stock)
 */
async function purchaseVariantService(dataSource, { productId, variant, quantity }) {
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);

  const product = await productRepo.findOne({
    where: { id: productId },
    relations: ["variants"],
  });

  if (!product) throw new Error("Producto no encontrado");

  const selectedVariant = product.variants.find(v =>
    v.size === variant.size && v.color === variant.color
  );

  if (!selectedVariant) throw new Error("Variante no encontrada");

  if (selectedVariant.stock < quantity) throw new Error("Stock insuficiente");

  selectedVariant.stock -= quantity;
  await variantRepo.save(selectedVariant);

  return {
    message: "Compra realizada con éxito",
    product: product.name,
    variant: {
      size: selectedVariant.size,
      color: selectedVariant.color,
      stockRestante: selectedVariant.stock,
    },
  };
}

async function changePriceProductService(dataSource, { productId, newPrice}) {
  const productRepo = dataSource.getRepository(Product);

  const product = await productRepo.findOne({
    where: { id: productId },
  });

  if (!product) throw new Error("Producto no encontrado");
  if (typeof newPrice !== "number" || newPrice <= 0) {
    throw new Error("El nuevo precio debe ser un número mayor que cero.");
  }

  product.price = newPrice;
  await productRepo.save(product);

  return {
    message: "Cambio de precio realizado con exito",
    product: {name:product.name, price: product.price}
  };
}


module.exports = {
  createProductService,
  purchaseVariantService,
  changePriceProductService,
};
