const express = require('express');
const router = express.Router();

// Item Model
const Item = require('../../models/Item');

// @route   GET api/items
// @desc    Get All Items
// @access  Public
router.get('/', (req, res) => {
    Item.find()
        .sort({ date: -1 })
        .then(items => {
            console.log('Items retrieved from MongoDB:', items);
            res.json(items);
        })
        .catch(err => {
            console.error('Error retrieving items from MongoDB:', err);
            res.status(500).json({ error: 'Failed to retrieve items' });
        });
});

// @route   POST api/items
// @desc    Create A Item
// @access  Public
router.post('/', (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });

    newItem.save()
        .then(item => {
            console.log('New item saved to MongoDB:', item);
            res.json(item);
        })
        .catch(err => {
            console.error('Error saving item to MongoDB:', err);
            res.status(500).json({ error: 'Failed to save item' });
        });
});

// @route   DELETE api/items/:id
// @desc    Delete An Item
// @access  Public
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => {
            if (!item) {
                return res.status(404).json({ success: false, error: 'Item not found' });
            }
            return item.deleteOne().then(() => {
                console.log('Item deleted from MongoDB:', req.params.id);
                res.json({ success: true });
            });
        })
        .catch(err => {
            console.error('Error deleting item from MongoDB:', err);
            res.status(500).json({ success: false, error: 'Failed to delete item' });
        });
});

module.exports = router;