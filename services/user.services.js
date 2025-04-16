const db = require("../config/db");
module.exports.getAll = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const [users, [{ count }]] = await Promise.all([
    db("user").select("*").limit(limit).offset(offset),
    db("user").count("* as count"),
  ]);

  return {
    users,
    pagination: {
      total: parseInt(count),
      page,
      limit,
    },
  };
};
module.exports.getOne = async (id) => {
  return await db("user").where("id", id).first();
};
module.exports.createOne = async (email, password, avatarUrl) => {
  return await db("user").insert({
    email: email,
    password: password,
    avatarUrl: avatarUrl,
  });
};
module.exports.updateOne = async (id, updateData) => {
  return await db("user").where("id", id).update(updateData);
};

module.exports.deleteOne = async (id) => {
  return await db("user").where("id", id).del();
};
