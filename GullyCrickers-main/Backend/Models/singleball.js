const mongoose = require("mongoose");

const ballSchema = new mongoose.Schema({

  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },

  innings: {
    type: Number,
    enum: [1, 2],
    required: true
  },

  overNumber: {
    type: Number,
    required: true
  },

  ballNumber: {
    type: Number,
    required: true
  },

  // CHANGED FROM ObjectId -> String
  bowler: {
    type: String
  },

  striker: {
    type: String
  },

  nonStriker: {
    type: String
  },

  runs: {
    bat: { 
      type: Number, 
      default: 0 
    },

    extras: { 
      type: Number, 
      default: 0 
    },

    total: { 
      type: Number, 
      default: 0 
    },

    extraType: {
      type: String,
      enum: ['wide', 'noball', 'bye', 'legbye', 'penalty'],
      default: null
    }
  },

  wicket: {

    isWicket: {
      type: Boolean,
      default: false
    },

    // CHANGED FROM ObjectId -> String
    playerOut: { 
      type: String
    },

    type: { 
      type: String, 
      enum: ['caught', 'bowled', 'lbw', 'runout', 'stumped', 'others'] 
    },

    // CHANGED FROM ObjectId -> String
    fielder: { 
      type: String
    }

  },

  isValidBall: {
    type: Boolean,
    default: true
  },

  timestamp: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Ball", ballSchema);