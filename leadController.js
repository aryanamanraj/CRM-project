const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const filter = req.user.role === 'Sales' ? { assignedTo: req.user._id } : {};
    const leads = await Lead.find(filter).populate('assignedTo', 'name email');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, status, assignedTo } = req.body;
    
    const lead = new Lead({
      name,
      email,
      phone,
      company,
      source,
      status: status || 'New',
      assignedTo: assignedTo || req.user._id,
    });

    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, status, assignedTo, convertedToCustomer } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.name = name || lead.name;
      lead.email = email || lead.email;
      lead.phone = phone || lead.phone;
      lead.company = company || lead.company;
      lead.source = source || lead.source;
      lead.status = status || lead.status;
      lead.assignedTo = assignedTo || lead.assignedTo;
      lead.convertedToCustomer = convertedToCustomer || lead.convertedToCustomer;

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await lead.deleteOne();
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
};
