const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/',    async (_req, res) => { const s = await Student.find(); res.json({ success: true, data: s }); });
router.post('/',   async (req, res)  => { const s = await Student.create(req.body); res.status(201).json({ success: true, data: s }); });

module.exports = router;
