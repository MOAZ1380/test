const allowed = ['admin', 'salesagent'];
module.exports = ((req, res, next) => {
        console.log("Role received:", req.user.role);
        if (req.user.role != "admin"){
            err.message = "user not allowed here";
            return next(err);
        }
        next();
});