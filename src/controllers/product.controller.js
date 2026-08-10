import ProductModel from "../models/product.models.js";
import { constants } from "node:http2";
import path from "node:path";

function resolveUploadedImagePath(file) {
  const publicPath = path
    .relative("public", file.path)
    .split(path.sep)
    .join("/");
  return `/${publicPath}`;
}

function parseTagIds(body) {
  if (!body || body.has_tag_ids === undefined) return undefined;
  const raw = body.tag_ids;
  if (raw === undefined) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((v) => Number(v)).filter((v) => Number.isInteger(v) && v > 0);
}

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
      category_id,
      regular_price,
      discount_price,
      stock,
      description,
    } = req.body;

    const image = req.file
      ? resolveUploadedImagePath(req.file)
      : req.body.image;

    // validasi field wajib
    if (!brand || !name || !category_id || !regular_price || !image) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message:
          "brand, name, category_id, regular_price, dan image wajib diisi",
      });
    }

    const tagIds = parseTagIds(req.body);

    const newProduct = await ProductModel.CreateProduct({
      brand,
      name,
      image,
      category_id,
      regular_price,
      discount_price: discount_price || null,
      stock,
      description,
      tagIds,
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

  const { has_tag_ids, tag_ids, ...data } = req.body;
  if (req.file) {
    data.image = resolveUploadedImagePath(req.file);
  }

  if (data.regular_price !== undefined && data.discount_price === undefined) {
    data.discount_price = "";
  }

  const tagIds = has_tag_ids !== undefined ? parseTagIds(req.body) : undefined;

  if ((!data || Object.keys(data).length === 0) && tagIds === undefined) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "No data to update",
    });
  }
  try {
    const updateProduct = await ProductModel.UpdateProduct(id, data, tagIds);
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
  try {
    const destroyed = await ProductModel.DeleteProduct(id);
    if (!destroyed) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Deleted product successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
