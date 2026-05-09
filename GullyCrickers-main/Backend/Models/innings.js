const mongoose = require("mongoose");

const inningsSchema = new mongoose.Schema({

  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true
  },

  innings: {
    type: Number,
    enum: [1, 2],
    required: true
  },

  striker: {
    type: String,
    required: true
  },

  nonStriker: {
    type: String,
    required: true
  },

  bowler: {
    type: String,
    required: true
  },

  strikerRuns: {
    type: Number,
    default: 0
  },

  strikerBalls: {
    type: Number,
    default: 0
  },

  nonStrikerRuns: {
    type: Number,
    default: 0
  },

  nonStrikerBalls: {
    type: Number,
    default: 0
  },

  totalRuns: {
    type: Number,
    default: 0
  },

  totalWickets: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },

  currentOver: {
    type: Number,
    default: 0
  },

  ballInOver: {
    type: Number,
    default: 0,
    min: 0,
    max: 6
  },

  status: {
    type: String,
    enum: ["live", "completed"],
    default: "live"
  }

}, { timestamps: true });

module.exports = mongoose.model("Innings", inningsSchema);