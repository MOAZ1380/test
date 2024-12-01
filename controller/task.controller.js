const Task = require('../models/Task_Schema');
const asyncWrapper = require('../middleware/asyncWrapper');

const add_task = asyncWrapper(async (req, res, next) => {
    const { title, description, status, dueDate, type, createdBy, assignedTo, relatedClient } = req.body;

    let taskData = {
        title,
        description,
        createdBy,
        status: status || "pending",
        dueDate,
        type: type || "general",
        assignedTo: assignedTo || null,
        relatedClient: relatedClient || null,
    };

    if (type === "general") {
        taskData.assignedTo = null;
        taskData.relatedClient = null;
    }

    const task = new Task(taskData);
    const savedTask = await task.save();
    res.status(201).json({ message: 'Task created successfully', task: savedTask });
});

const get_all_task = asyncWrapper(async (req, res, next) => {
    const tasks = await Task.find({}, { "__v": false, '_id': false })
        .populate('assignedTo', "-__v")
        .populate('createdBy', "-__v")
        .populate('relatedClient', "-__v")
        .sort({ dueDate: -1 });

    res.status(200).json(tasks);
});

const update_task = asyncWrapper(async (req, res, next) => {
    const taskId = req.params.id;
    const { title, description, status, dueDate, type, assignedTo, relatedClient } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            title,
            description,
            status,
            dueDate,
            type,
            assignedTo,
            relatedClient
        },
        { new: true }
    );

    if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', updatedTask });
});

const delete_task = asyncWrapper(async (req, res, next) => {
    const taskId = req.params.id;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
});

module.exports = {
    add_task,
    get_all_task,
    update_task,
    delete_task
};
