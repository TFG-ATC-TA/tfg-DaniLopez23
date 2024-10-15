const Board = require("../models/Board");
const boardRouter = require("express").Router();

boardRouter.get("/", async (req, res) => {
  const boards = await Board.find({});
  console.log(boards);
  res.json(boards);
});

module.exports = boardRouter;