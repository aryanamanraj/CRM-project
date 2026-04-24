const Deal = require('../models/Deal');

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
const getDeals = async (req, res) => {
  try {
    const filter = req.user.role === 'Sales' ? { assignedTo: req.user._id } : {};
    const deals = await Deal.find(filter)
      .populate('customer', 'name email')
      .populate('assignedTo', 'name');
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a deal
// @route   POST /api/deals
// @access  Private
const createDeal = async (req, res) => {
  try {
    const { title, amount, customer, stage, expectedCloseDate, assignedTo } = req.body;
    
    const deal = new Deal({
      title,
      amount,
      customer,
      stage: stage || 'Prospect',
      expectedCloseDate,
      assignedTo: assignedTo || req.user._id,
    });

    const createdDeal = await deal.save();
    res.status(201).json(createdDeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a deal
// @route   PUT /api/deals/:id
// @access  Private
const updateDeal = async (req, res) => {
  try {
    const { title, amount, customer, stage, expectedCloseDate, assignedTo } = req.body;

    const deal = await Deal.findById(req.params.id);

    if (deal) {
      deal.title = title || deal.title;
      deal.amount = amount || deal.amount;
      deal.customer = customer || deal.customer;
      deal.stage = stage || deal.stage;
      deal.expectedCloseDate = expectedCloseDate || deal.expectedCloseDate;
      deal.assignedTo = assignedTo || deal.assignedTo;

      const updatedDeal = await deal.save();
      res.json(updatedDeal);
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a deal
// @route   DELETE /api/deals/:id
// @access  Private/Admin
const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (deal) {
      await deal.deleteOne();
      res.json({ message: 'Deal removed' });
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDeals,
  createDeal,
  updateDeal,
  deleteDeal,
};
