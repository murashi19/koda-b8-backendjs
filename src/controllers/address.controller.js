import { constants } from "node:http2";
import AddressModel from "../models/address.models.js";

export async function GetAllAddress(req, res) {
  try {
    const addresses = await AddressModel.getAll(req.user.id);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Get address successfully",
      data: addresses,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function GetAddressById(req, res) {
  try {
    const { id } = req.params;

    const address = await AddressModel.getById(id, req.user.id);

    if (!address) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Get address successfully",
      data: address,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function CreateAddress(req, res) {
  try {
    const userId = req.user.id;
    const {
      label,
      province,
      city,
      district,
      subdistrict,
      postal_code,
      address,
      note,
      is_default,
    } = req.body;

    console.log("Ini user id", userId);
    if (!label || !province || !city || !address) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Label, province, city and address are required",
      });
    }

    const newAddress = await AddressModel.create(userId, {
      label,
      province,
      city,
      district,
      subdistrict,
      postal_code,
      address,
      note,
      is_default,
    });

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Address created successfully",
      data: newAddress,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function UpdateAddress(req, res) {
  try {
    const { id } = req.params;

    const updated = await AddressModel.update(id, req.user.id, req.body);

    if (!updated) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Address updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function DeleteAddress(req, res) {
  try {
    const { id } = req.params;

    const deleted = await AddressModel.delete(id, req.user.id);

    if (!deleted) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
