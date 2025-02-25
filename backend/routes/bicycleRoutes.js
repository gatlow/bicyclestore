// Bicycle Routes
const express = require("express");
const bicycleController = require("../controllers/bicycleController");

const bicycleRouter = express.Router();
bicycleRouter.get("/", bicycleController.getAllBicycles);
bicycleRouter.get("/:id", bicycleController.getBicycleById);
bicycleRouter.post("/", bicycleController.createBicycle);
bicycleRouter.put("/:id", bicycleController.updateBicycle);
bicycleRouter.delete("/:id", bicycleController.deleteBicycle);

module.exports = bicycleRouter;
