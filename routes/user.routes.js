const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");
const { authenticate, authorize } = require("../middlewares/auth.middlewares");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../public`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let { originalname } = file;
    originalname = originalname.split(".");
    let extension = originalname[originalname.length - 1];
    let fileName = file.fieldname + "-" + uniqueSuffix + `.${extension}`;
    cb(null, fileName);
    req.fileName = fileName;
  },
});

const mulStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../public`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let { originalname } = file;
    originalname = originalname.split(".");
    let extension = originalname[originalname.length - 1];
    let fileName = file.fieldname + "-" + uniqueSuffix + `.${extension}`;
    cb(null, fileName);
    req.fileName = fileName;
  },
});

const upload = multer({ storage });
// middleware dành cho việc upload nhiều file cùng 1 lúc
const uploadMulti = multer({ storage: mulStorage });

// authorization - phân quyền

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng ( chỉ dành cho admin)
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số người dùng mỗi trang
 *     responses:
 *       200:
 *         description: Lấy thành công danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: GET ALL SUCCESSFULLY
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Chưa xác thực (Unauthorized)
 *       403:
 *         description: Không có quyền truy cập (Forbidden)
 */
router.get("/", authenticate, authorize(["admin"]), userController.getAll);


/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một người dùng (Admin)
 *     security:
 *       - BearerAuth: []  # Cần token JWT
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Chưa xác thực (Unauthorized)
 *       403:
 *         description: Không có quyền truy cập (Forbidden)
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get("/:id", authenticate, userController.getOne);

// dành cho cả admin và user
router.get(
  "/:id",
  // authenticate,
  // authorize(["ADMIN", "USER"]),
  userController.getOne
);

router.post("/", upload.single("avatar"), userController.createOne);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần cập nhật
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *               username:
 *                 type: string
 *                 description: ten nguoi dung
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "UPDATE ONE SUCCESSFULLY"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Chưa xác thực (Unauthorized)
 *       403:
 *         description: Không có quyền truy cập (Forbidden)
 *       404:
 *         description: Người dùng không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */

router.put("/:id", userController.updateOne);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng (Chỉ dành cho admin)
 *     security:
 *       - BearerAuth: []  # Bắt buộc nhập token JWT
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần xóa
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "DELETE ONE SUCCESSFULLY"
 *       401:
 *         description: Chưa xác thực (Unauthorized)
 *       403:
 *         description: Không có quyền truy cập (Forbidden)
 *       404:
 *         description: Người dùng không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/:id", authenticate, authorize(["admin"]), userController.deleteOne);


module.exports = router;
