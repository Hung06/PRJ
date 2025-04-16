const projectService = require("../services/project.services");
const userService = require("../services/user.services");  // Import user service

module.exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { projects, pagination } = await projectService.getAll(page, limit);

    res.status(200).json({
      message: "GET ALL SUCCESSFULLY",
      data: projects,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred on server",
      error: error.message,
    });
  }
};

module.exports.getOne = async (req, res) => {
  const { id } = req.params;  // Lấy ID từ URL

  try {
    // Truy vấn thông tin project từ database
    const project = await projectService.getOne(id);

    // Kiểm tra nếu không tìm thấy project
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      project,  // Trả về thông tin của project
      message: "GET ONE SUCCESSFULLY",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred on server",
      error,
    });
  }
};


module.exports.createOne = async (req, res) => {
  const { name, description, user_id } = req.body;

  try {
    // Kiểm tra user_id có hợp lệ không
    const user = await userService.getOne(user_id);
    if (!user) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    const result = await projectService.createOne(name, description, user_id);
    res.status(201).json({
      id: result[0],
      message: "POST ONE SUCCESSFULLY",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error occurred on server",
      error,
    });
  }
};

module.exports.updateOne = async (req, res) => {
  const { name, description, user_id } = req.body;
  const { id } = req.params;

  try {
    // Kiểm tra user_id có hợp lệ không
    const user = await userService.getOne(user_id);
    if (!user) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    const result = await projectService.updateOne(id, name, description, user_id);
    res.status(200).json({
      message: "UPDATE ONE SUCCESSFULLY",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred on server",
      error,
    });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { id } = req.params;  // Lấy ID từ URL

  try {
    // Kiểm tra nếu dự án tồn tại trong cơ sở dữ liệu
    const project = await projectService.getOne(id);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Xóa dự án khỏi cơ sở dữ liệu
    await projectService.deleteOne(id);

    res.status(200).json({
      message: "DELETE ONE SUCCESSFULLY",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred on server",
      error,
    });
  }
};
