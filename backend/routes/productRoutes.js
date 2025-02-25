const express = require("express");
const productController = require("../controllers/productController");

const productRouter = express.Router();
productRouter.get("/", productController.getAllProducts);
productRouter.get("/search", productController.searchProducts); // Новый маршрут для поиска
productRouter.get("/:id", productController.getProductById);
productRouter.post("/", productController.createProduct);
productRouter.put("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);

module.exports = productRouter;