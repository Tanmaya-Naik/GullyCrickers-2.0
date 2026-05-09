const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");

const {
  createMatch,
  getMatchById,
  Start_Innings,
  singleball,
  getCurrentInnings
} = require("../Controllers/matchcontroller");


// CREATE MATCH
router.post(
  "/create",
  authMiddleware,
  createMatch
);


// GET MATCH DETAILS
router.get(
  "/:id",
  getMatchById
);


// START INNINGS
router.post(
  "/start-innings",
  authMiddleware,
  Start_Innings
);


// SAVE BALL
router.post(
  "/ball",
  singleball
);


// GET CURRENT LIVE INNINGS
router.get(
  "/current-innings/:matchId",
  getCurrentInnings
);


module.exports = router;