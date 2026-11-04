const express = require("express");
const router = express.Router();
const Device = require("../models/Device");

// GET: Lấy danh sách và tìm kiếm thiết bị
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;

        let filter = {};

        if (search) {
            const keyword = search.trim();

            filter = {
                $or: [
                    { deviceId: { $regex: keyword, $options: "i" } },
                    { name: { $regex: keyword, $options: "i" } },
                    { deviceType: { $regex: keyword, $options: "i" } },
                    { room: { $regex: keyword, $options: "i" } }
                ]
            };
        }

        const devices = await Device.find(filter);

        res.status(200).json({
            success: true,
            count: devices.length,
            data: devices
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET: Xem chi tiết một thiết bị
router.get("/:id", async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thiết bị"
            });
        }

        res.status(200).json({
            success: true,
            data: device
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "ID thiết bị không hợp lệ"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// POST: Thêm thiết bị mới
router.post("/", async (req, res) => {
    try {
        const device = await Device.create(req.body);

        res.status(201).json({
            success: true,
            message: "Thêm thiết bị thành công",
            data: device
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Mã thiết bị đã tồn tại"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// PUT: Cập nhật thiết bị
router.put("/:id", async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thiết bị"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật thiết bị thành công",
            data: device
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Mã thiết bị đã tồn tại"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "ID thiết bị không hợp lệ"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const devices = await Device.find();

        res.status(200).json({
            success: true,
            count: devices.length,
            data: devices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE: Xóa thiết bị
router.delete("/:id", async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thiết bị"
            });
        }

        res.status(200).json({
            success: true,
            message: "Xóa thiết bị thành công"
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "ID thiết bị không hợp lệ"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;