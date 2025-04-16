const db = require("../config/db");
const bcrypt = require("bcryptjs");
const userService = require("./user.services");
const jwt = require("jsonwebtoken");

module.exports.register = async function (email, password) {
  // Sử dụng thông tin email và password để tạo ra 1 đối tượng user
  // Mã hoá mật khẩu của user
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  console.log(hash);

  return await userService.createOne(email, hash);
};

module.exports.signIn = async function (email, password) {
  // Tìm kiếm đối tượng user trùng email với email được gửi lên từ client

  let result = await db("user").select("*").where("email", email);

  if (result.length === 0) {
    return {
      message: `User with email: ${email} not existed`,
    };
  } else {
    let [user] = result;
    // so sánh user.password và password (client)
    let comparedResult = await bcrypt.compare(password, user.password);
    if (comparedResult) {
      // Đăng nhập thành công
      // Generate token (Tạo ra 1 token)
      let token = jwt.sign(
        { user_id: user.id, role: user.role },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h"}
      );
      return token;
    } else {
      console.log("Hello world");
      // Mật khẩu không đúng
      return {
        message: `Password is incorrect`,
      };
    }
  }
};

