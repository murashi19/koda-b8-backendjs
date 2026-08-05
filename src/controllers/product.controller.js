import ProductModel from "../models/product.models.js";
import { constants } from "node:http2";

export async function GetAllProduct(req, res) {
  try {
    const products = await ProductModel.GetAllProduct();
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Lists Product",
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}

export async function GetProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await ProductModel.GetProductByID(id);
    if (!product) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Product detail",
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch product detail",
    });
  }
}

export async function CreateProduct(req, res) {
  try {
    const {
      brand,
      name,
      image,
      category_id,
      regular_price,
      discount_price,
      stock,
    } = req.body;

    // validasi field wajib
    if (!brand || !name || !category_id || !regular_price) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "brand, name, category_id, dan regular_price wajib diisi",
      });
    }

    const newProduct = await ProductModel.CreateProduct({
      brand,
      name,
      image,
      category_id,
      regular_price,
      discount_price,
      stock,
    });

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Product created",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create product",
    });
  }
}

export async function UpdateProduct(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Product not Found",
    });
  }

  const { ...data } = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "No data to update",
    });
  }
  try {
    const updateProduct = await ProductModel.UpdateProduct(id, data);
    if (!updateProduct) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update Product Successfully",
      data: updateProduct,
    });
  } catch (err) {
    console.log(err);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Product not found",
    });
  }
  const destroy = await ProductModel.DeleteProduct(id);
  res.json({
    success: true,
    message: "Deleted product successfully",
  });
}
