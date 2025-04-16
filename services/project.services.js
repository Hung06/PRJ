const db = require("../config/db");

module.exports.getAll = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const [projects, [{ count }]] = await Promise.all([
    db("project").select("*").limit(limit).offset(offset),
    db("project").count("* as count"),
  ]);

  return {
    projects,
    pagination: {
      total: parseInt(count),
      page,
      limit,
    },
  };
};
module.exports.getOne = async (id) => {
  return await db("project").where("id", id).first();
};

module.exports.createOne = async (name, description, user_id) => {
  return await db("project").insert({ name, description, user_id });
};

module.exports.updateOne = async (id, name, description, user_id) => {
  return await db("project").where("id", id).update({ name, description, user_id });
};

module.exports.deleteOne = async (id) => {
  return await db("project").where("id", id).del();
};
