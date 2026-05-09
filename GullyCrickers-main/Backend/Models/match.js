const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({

  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  teamAName: {
    type:String,
    required: true,
    trim: true
  },

  teamBName:{
    type:String,
    required: true,
    trim: true
  },

  overs: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },

  status:{
    type:String,
    enum: ["completed","live"],
   default: "live"
  },

  target:{
    type:Number,
    default:null
  }

}, {timestamps: true});

module.exports = mongoose.model("Match", matchSchema);