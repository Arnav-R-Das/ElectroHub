const express = require('express')
const router = express.Router()
const modelTemplate = require('../models/modelTemplate')

// CREATE one
router.post('/', async (req, res) => {
    const data = new modelTemplate({
        var1: req.body.var1,
        var2: req.body.var2
    })
    try {
        const newData = await data.save()
        res.status(201).json(newData)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// READ all
router.get('/', async (req, res) => {
    try {
        const data = await modelTemplate.find()
        res.json(data)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// READ One
router.get('/:id', getData, (req, res) => {
    res.json(res.data)
})

// UPDATE one
router.patch('/:id', getData, async (req, res) => {
    if (req.body.var1 != null) {
        res.data.var1 = req.body.var1
    }
    if (req.body.var2 != null) {
        res.data.var2 = req.body.var2
    }
    try {
        const updatedData = await res.data.save()
        res.json(updatedData)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// DELETE one
router.delete('/:id', getData, async (req, res) => {
    try {
        await res.data.deleteOne()
        res.json({ message: 'Deletion Successful' })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Middleware
async function getData(req, res, next) {
    let data
    try {
        data = await modelTemplate.findById(req.params.id)
        if (data == null) {
            return res.status(404).json({ message: 'Cannot find data' })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.data = data
    next()
}

module.exports = router