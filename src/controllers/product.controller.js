import { default as db } from "../models/index.cjs";
import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import { constants } from "node:http2";
import buildSearchWhere from "../utils/search.js";

const { Product, ProductImage, ProductDetail, Category, Tag } = db;

function parseTagIds(body) {
  if (!body || body.has_tag_ids === undefined) {
    return undefined;
  }

  const raw = body.tag_ids;
  if (raw === undefined) {
    return [];
  }

  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);
}

//  GET ALL PRODUCT
export async function GetAllProduct(req, res) {
  try {
    const where = buildSearchWhere(req.query.search); // <-- tambahin ini

    const products = await Product.findAll({
      where, // <-- tambahin ini
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url", "sort_order"],
          separate: true,
          order: [["sort_order", "ASC"]],
        },
        {
          model: ProductDetail,
          as: "detail",
          attributes: ["description", "specifications"],
        },
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
      order: [["created_at", "ASC"]],
    });

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Lists Product",
      data: products,
    });
  } catch (error) {
    console.error("GetAllProduct:", error);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}

// GET PRODUCT BY ID
export async function GetProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },

        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url", "sort_order"],
          separate: true,
          order: [["sort_order", "ASC"]],
        },

        {
          model: ProductDetail,
          as: "detail",
          attributes: ["description", "specifications"],
        },

        {
          model: Tag,
          as: "tags",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });

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
    console.error("GetProductById:", error);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch product detail",
    });
  }
}

// CREATE PRODUCT
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

    // Validasi
    if (!brand || !name || !category_id || !regular_price) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "brand, name, category_id, dan regular_price wajib diisi",
      });
    }

    if (!req.file) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Product image wajib diupload",
      });
    }

    const category = await Category.findByPk(category_id);

    if (!category) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Category not found",
      });
    }
    const tagIds = parseTagIds(req.body);
    const uploaded = await uploadToCloudinary(req.file.buffer, {
      folder: "products",
    });

    try {
      const product = await Product.create({
        brand,
        name,
        image: uploaded.secure_url,
        category_id,
        regular_price,
        discount_price: discount_price === "" ? null : discount_price,
        stock: stock || 0,
      });

      await ProductImage.create({
        product_id: product.id,
        image_url: uploaded.secure_url,
        image_public_id: uploaded.public_id,
        sort_order: 0,
      });

      if (description) {
        await ProductDetail.create({
          product_id: product.id,
          description,
        });
      }

      if (Array.isArray(tagIds) && tagIds.length > 0) {
        await product.setTags(tagIds);
      }

      const createdProduct = await Product.findByPk(product.id, {
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"],
          },
          {
            model: ProductImage,
            as: "images",
            attributes: ["id", "image_url", "sort_order"],
          },
          {
            model: ProductDetail,
            as: "detail",
            attributes: ["description", "specifications"],
          },
          {
            model: Tag,
            as: "tags",
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
        ],
      });

      return res.status(constants.HTTP_STATUS_CREATED).json({
        success: true,
        message: "Product created",
        data: createdProduct,
      });
    } catch (databaseError) {
      await deleteFromCloudinary(uploaded.public_id);

      throw databaseError;
    }
  } catch (error) {
    console.error("CreateProduct:", error);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create product",
    });
  }
}

//  UPDATE PRODUCT
export async function UpdateProduct(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Product id is required",
    });
  }
  let oldPublicId = null;
  let uploadedImage = null;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      brand,
      name,
      category_id,
      regular_price,
      discount_price,
      stock,
      description,
      specifications,
    } = req.body;

    const updateData = {};
    if (brand !== undefined) {
      updateData.brand = brand;
    }
    if (name !== undefined) {
      updateData.name = name;
    }

    if (category_id !== undefined) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Category not found",
        });
      }
      updateData.category_id = category_id;
    }

    if (regular_price !== undefined) {
      updateData.regular_price = regular_price;
    }
    if (discount_price !== undefined) {
      updateData.discount_price = discount_price === "" ? null : discount_price;
    }
    if (stock !== undefined) {
      updateData.stock = stock;
    }

    const tagIds = parseTagIds(req.body);
    if (req.file) {
      const oldImage = await ProductImage.findOne({
        where: {
          product_id: id,
          sort_order: 0,
        },
      });

      oldPublicId = oldImage?.image_public_id || null;

      // Upload image baru
      uploadedImage = await uploadToCloudinary(req.file.buffer, {
        folder: "products",
      });

      updateData.image = uploadedImage.secure_url;

      // Update product_images
      if (oldImage) {
        await oldImage.update({
          image_url: uploadedImage.secure_url,
          image_public_id: uploadedImage.public_id,
        });
      } else {
        await ProductImage.create({
          product_id: id,
          image_url: uploadedImage.secure_url,
          image_public_id: uploadedImage.public_id,
          sort_order: 0,
        });
      }
    }
    //  Update product
    await product.update(updateData);
    // UPDATE DETAIL
    if (description !== undefined) {
      const [detail, created] = await ProductDetail.findOrCreate({
        where: {
          product_id: id,
        },
        defaults: {
          product_id: id,
          description,
          specifications,
        },
      });

      if (!created) {
        await detail.update({
          description,
          specifications,
        });
      }
    }

    if (tagIds !== undefined) {
      await product.setTags(tagIds);
    }
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }

    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url", "sort_order"],
          separate: true,
          order: [["sort_order", "ASC"]],
        },
        {
          model: ProductDetail,
          as: "detail",
          attributes: ["description", "specifications"],
        },
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update Product Successfully",
      data: updatedProduct,
    });
  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch (cloudinaryError) {
        console.error("Failed to cleanup Cloudinary image:", cloudinaryError);
      }
    }

    console.error("UpdateProduct:", error);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// DELETE PRODUCT
export async function deleteProduct(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Product id is required",
    });
  }

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    const images = await ProductImage.findAll({
      where: {
        product_id: id,
      },
    });

    for (const image of images) {
      if (image.image_public_id) {
        await deleteFromCloudinary(image.image_public_id);
      }
    }
    await product.destroy();

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Deleted product successfully",
    });
  } catch (error) {
    console.error("deleteProduct:", error);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
