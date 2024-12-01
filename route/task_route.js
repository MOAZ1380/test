const express = require('express');
const task_controller = require('../controller/task.controller');
// var isAuthenticated = require("../middlewares/authentication");
// var authorization = require("../middlewares/authorization");

const router = express.Router();

router.route('/admin')
    .post(task_controller.add_task)
    .get( task_controller.get_all_task);


router.route('/admin/:id')
    .patch(task_controller.update_task)
    .delete(task_controller.delete_task);


// router.route('/user/my_task')
//     .get(task_controller.get_my_tasks)

module.exports = router;
