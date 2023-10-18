const theatersService = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// calls list service and sends response for "/theaters" route.

async function list(req, res, next) {
        const data = await theatersService.list();
        res.json({ data });
  }


module.exports = {
    list: asyncErrorBoundary(list)
}