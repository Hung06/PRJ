const userService = require("../services/user.services");

module.exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let { users, pagination } = await userService.getAll(page, limit);

    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }

    res.status(200).json({
      message: "GET ALL SUCCESSFULLY",
      data: users,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error occurred while fetching users",
      error: error.message,
    });
  }
};

module.exports.getOne = async (req, res) => {
  let { id } = req.params;
  let result = await userService.getOne(id);
  res.json(result);
};
module.exports.createOne = async (req, res) => {
  let { email, password } = req.body;
  let { fileName } = req;
  try {
    let result = await userService.createOne(email, password, fileName);
    console.log(result);
    res.json({
      create_user_id: result[0],
      message: "POST ONE SUCCESSFULLY",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      message: "Error occurred on server",
    });
  }
};

module.exports.updateOne = async (req, res) => {
  let { id } = req.params;
  let updateData = req.body;
  try {
    await userService.updateOne(id, updateData);
    res.json({ message: "UPDATE ONE SUCCESSFULLY" });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while updating user",
      error: error.message,
    });
  }
};

module.exports.deleteOne = async (req, res) => {
  let { id } = req.params;
  try {
    await userService.deleteOne(id);
    res.json({ message: "DELETE ONE SUCCESSFULLY" });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while deleting user",
      error: error.message,
    });
  }
};
