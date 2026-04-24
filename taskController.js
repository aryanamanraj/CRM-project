const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const filter = req.user.role === 'Sales' ? { assignedTo: req.user._id } : {};
    const tasks = await Task.find(filter).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, type, status, priority, assignedTo, relatedToModel, relatedTo } = req.body;
    
    const task = new Task({
      title,
      description,
      dueDate,
      type: type || 'Follow-up',
      status: status || 'Pending',
      priority: priority || 'Medium',
      assignedTo: assignedTo || req.user._id,
      relatedToModel,
      relatedTo,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, type, status, priority, assignedTo, relatedToModel, relatedTo } = req.body;

    const task = await Task.findById(req.params.id);

    if (task) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.type = type || task.type;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.assignedTo = assignedTo || task.assignedTo;
      task.relatedToModel = relatedToModel || task.relatedToModel;
      task.relatedTo = relatedTo || task.relatedTo;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
