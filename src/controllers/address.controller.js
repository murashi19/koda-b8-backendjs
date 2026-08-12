import { constants } from "node:http2";
import { default as db } from "../models/index.cjs";
import { logSuccess, logError, logInfo } from "../lib/logger.js";

const { Addresses, UserProfiles, sequelize } = db;

export async function GetAllAddress(req, res) {
  let userId;
  try {
    userId = req.user.id;
    logInfo(`Fetching all addresses for user ${userId}`);

    const addresses = await Addresses.findAll({
      include: [
        {
          model: UserProfiles,
          as: "profile",
          attributes: ["user_id", "full_name", "phone_number"],
          where: {
            user_id: userId,
          },
        },
      ],
      order: [
        ["is_default", "DESC"],
        ["id", "DESC"],
      ],
    });

    logSuccess(`Fetched ${addresses.length} address(es) for user ${userId}`);
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Get address successfully",
      data: addresses,
    });
  } catch (err) {
    logError(`Failed to fetch addresses for user ${userId}: ${err.message}`);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function GetAddressById(req, res) {
  let userId;
  let id;
  try {
    ({ id } = req.params);
    userId = req.user.id;
    logInfo(`Fetching address ${id} for user ${userId}`);

    const address = await Addresses.findOne({
      where: {
        id,
      },
      include: [
        {
          model: UserProfiles,
          as: "profile",
          attributes: ["user_id", "full_name", "phone_number"],
          where: {
            user_id: userId,
          },
        },
      ],
    });

    if (!address) {
      logError(`Address ${id} not found for user ${userId}`);
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Address not found",
      });
    }

    logSuccess(`Fetched address ${id} for user ${userId}`);
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Get address successfully",
      data: address,
    });
  } catch (err) {
    logError(
      `Failed to fetch address ${id} for user ${userId}: ${err.message}`,
    );

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function CreateAddress(req, res) {
  let userId;
  try {
    userId = req.user.id;
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

    logInfo(`Creating address for user ${userId}`);

    if (!label || !province || !city || !address) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Label, province, city and address are required",
      });
    }

    const transaction = await sequelize.transaction();

    try {
      const profile = await UserProfiles.findByPk(userId, {
        transaction,
      });

      if (!profile) {
        await transaction.rollback();
        logError(`User profile not found for user ${userId}`);
        return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
          success: false,
          message: "User profile not found",
        });
      }

      if (is_default) {
        await Addresses.update(
          {
            is_default: false,
          },
          {
            where: {
              user_profile_id: profile.user_id,
            },
            transaction,
          },
        );
      }

      const newAddress = await Addresses.create(
        {
          user_profile_id: profile.user_id,
          label,
          province,
          city,
          district,
          subdistrict,
          postal_code,
          address,
          note,
          is_default: is_default ?? false,
        },
        {
          transaction,
        },
      );

      await transaction.commit();
      logSuccess(
        `Address created for user ${userId} (label: "${newAddress.label}")`,
      );
      return res.status(constants.HTTP_STATUS_CREATED).json({
        success: true,
        message: "Address created successfully",
        data: newAddress,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    logError(`Failed to create address for user ${userId}: ${err.message}`);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function UpdateAddress(req, res) {
  let userId;
  let id;
  try {
    ({ id } = req.params);
    userId = req.user.id;
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

    logInfo(`Updating address ${id} for user ${userId}`);

    const data = {
      label,
      province,
      city,
      district,
      subdistrict,
      postal_code,
      address,
      note,
      is_default,
    };

    const transaction = await sequelize.transaction();

    try {
      if (is_default) {
        await Addresses.update(
          {
            is_default: false,
          },
          {
            where: {
              user_profile_id: userId,
            },
            transaction,
          },
        );
      }

      const [updatedRows] = await Addresses.update(data, {
        where: {
          id,
          user_profile_id: userId,
        },
        transaction,
      });

      if (updatedRows === 0) {
        await transaction.rollback();
        logError(`Address ${id} not found for user ${userId}`);
        return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
          success: false,
          message: "Address not found",
        });
      }

      const updated = await Addresses.findByPk(id, {
        transaction,
      });

      await transaction.commit();
      logSuccess(`Address ${id} updated for user ${userId}`);

      return res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "Address updated successfully",
        data: updated,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    logError(
      `Failed to update address ${id} for user ${userId}: ${err.message}`,
    );

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function DeleteAddress(req, res) {
  let userId;
  let id;
  try {
    ({ id } = req.params);
    userId = req.user.id;
    logInfo(`Deleting address ${id} for user ${userId}`);

    const deletedCount = await Addresses.destroy({
      where: {
        id,
        user_profile_id: userId,
      },
    });

    if (!deletedCount) {
      logError(`Address ${id} not found for user ${userId}`);
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Address not found",
      });
    }

    logSuccess(`Address ${id} deleted for user ${userId}`);
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (err) {
    logError(
      `Failed to delete address ${id} for user ${userId}: ${err.message}`,
    );

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
