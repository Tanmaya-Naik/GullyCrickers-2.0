const mongoose = require("mongoose");
const Match = require("../Models/match");
const Innings=require("../Models/innings");
const Ball = require("../Models/singleball");
const {getIo} = require("../socket");

// Create Match
const createMatch = async (req, res) => {
  try {
    const { teamAName, teamBName, overs } = req.body;

    if (!teamAName || !teamBName || !overs) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (teamAName === teamBName) {
      return res.status(400).json({ message: "Teams cannot be the same" });
    }

    if (overs <= 0 || overs > 50) {
      return res.status(400).json({ message: "Overs must be between 1 and 50" });
    }

    const match = await Match.create({
      hostId: req.user.id,
      teamAName,
      teamBName,
      overs
    });

    res.status(201).json({
      message: "Match created successfully",
      matchId: match._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get Match by ID
const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid match ID format" });
    }

    const match = await Match.findById(id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json(match);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};  

//START INNINGSS
const Start_Innings = async(req,res)=> {
  try{
    const {matchId,striker,nonStriker,bowler} = req.body;

    if (!matchId || !striker || !nonStriker || !bowler) { 
      return res.status(400).json(
        { message: "All fields are required" }); 
      }


         if (striker === nonStriker) { 
          return res.status(400).json({ message: "Striker and non-striker cannot be same" }); 
        }


           if (!mongoose.Types.ObjectId.isValid(matchId)) {
             return res.status(400).json({ message: "Invalid matchId format" });
             }

    

    const match = await Match.findById(matchId);

    if(!match){
      return res.status(401).json({message:"Match not found"})
    }

    if(match.status != "live"){
      return res.status(400).json({message:"Match is already finished"})
    }

    const existing = await Innings.find({matchId});
    
    if(existing.length >=2){
      return res.status(400).json({
        message:"Match has already 2 innings"
      })
    }

    let innings = existing.length === 0 ? 1 : 2;


   const newInnings = await Innings.create({

  matchId,

  innings,

  striker,

  nonStriker,

  bowler,

  strikerRuns: 0,
  strikerBalls: 0,

  nonStrikerRuns: 0,
  nonStrikerBalls: 0,

  totalRuns: 0,

  totalWickets: 0,

  currentOver: 0,

  ballInOver: 0,

  status: "live"

});

    return res.status(201).json({
      message:`Innings ${innings} has started`,
      data:newInnings
    })

  }
  catch(error){
    console.log(error);
    res.status(500).json({
      message:"Sever error"
    })

  }
}

//ALL BALL AND RUN LOGIC
const singleball = async(req,res)=>{

  try{

    const { matchid } = req.body;

    if(!mongoose.Types.ObjectId.isValid(matchid)){

      return res.status(401).json({
        message: "Id format is not matching"
      });

    }

    const match = await Match.findById(matchid);

    if(!match){

      return res.status(401).json({
        message:"Match not found"
      });

    }

    if(match.status !== "live"){

      return res.status(400).json({
        message: "Match is already ended"
      });

    }

    const curr_Inning = await Innings.findOne({
      matchId: matchid,
      status: "live"
    });

    if(!curr_Inning){

      return res.status(400).json({
        message:"Innings not found"
      });

    }

    let striker = curr_Inning.striker;
    let non_striker = curr_Inning.nonStriker;

    let strikerRuns = curr_Inning.strikerRuns;
    let strikerBalls = curr_Inning.strikerBalls;

    let nonStrikerRuns = curr_Inning.nonStrikerRuns;
    let nonStrikerBalls = curr_Inning.nonStrikerBalls;

    let bowler = curr_Inning.bowler;

    let total_run = curr_Inning.totalRuns;
    let currentOver = curr_Inning.currentOver;
    let ballInOver = curr_Inning.ballInOver;

    let { runs, extras, wicket, newBatsman } = req.body;

    let batruns = runs || 0;

    let extraRuns = 0;

    let isValidBall = true;



    // EXTRAS
    if (extras === "wide" || extras === "noball") {

      extraRuns = 1;

      isValidBall = false;

    }



    // TOTAL SCORE
    total_run += (batruns + extraRuns);



    // BATSMAN RUNS
    strikerRuns += batruns;



    // VALID BALL
    if (isValidBall) {

      ballInOver += 1;

      strikerBalls += 1;

    }



    // OLD BATSMAN BEFORE CHANGES
    let oldStriker = striker;

    let oldNonStriker = non_striker;



    let isWicket = false;

    let playerout = null;

    let wicketType = null;

    let totalWickets = curr_Inning.totalWickets;



    // WICKET
    if (wicket?.isWicket === true) {

      if (!newBatsman) {

        return res.status(400).json({
          message: "New batsman required after wicket"
        });

      }

      isWicket = true;

      playerout = oldStriker;

      wicketType = wicket.type || "others";

      totalWickets += 1;

      striker = newBatsman;

      strikerRuns = 0;

      strikerBalls = 0;

    }



    // STRIKE ROTATION
    if (!isWicket && batruns % 2 === 1) {

      // PLAYER NAMES
      let temp = striker;
      striker = non_striker;
      non_striker = temp;

      // RUNS
      let tempRuns = strikerRuns;
      strikerRuns = nonStrikerRuns;
      nonStrikerRuns = tempRuns;

      // BALLS
      let tempBalls = strikerBalls;
      strikerBalls = nonStrikerBalls;
      nonStrikerBalls = tempBalls;

    }



    // OVER COMPLETION
    if (ballInOver === 6) {

      // PLAYER NAMES
      let temp = striker;
      striker = non_striker;
      non_striker = temp;

      // RUNS
      let tempRuns = strikerRuns;
      strikerRuns = nonStrikerRuns;
      nonStrikerRuns = tempRuns;

      // BALLS
      let tempBalls = strikerBalls;
      strikerBalls = nonStrikerBalls;
      nonStrikerBalls = tempBalls;

      ballInOver = 0;

      currentOver += 1;

    }



    // CREATE BALL
    const newball = await Ball.create({

      matchId: matchid,

      innings: curr_Inning.innings,

      overNumber: currentOver,

      ballNumber: ballInOver,

      bowler: bowler,

      striker: oldStriker,

      nonStriker: oldNonStriker,

      runs: {
        bat: batruns,
        extras: extraRuns,
        total: batruns + extraRuns,
        extraType: extras
      },

      wicket: {
        isWicket: isWicket,
        playerOut: playerout,
        type: wicketType
      },

      isValidBall: isValidBall,

      timestamp: new Date()

    });



    // SAVE INNINGS
    curr_Inning.totalRuns = total_run;

    curr_Inning.currentOver = currentOver;

    curr_Inning.ballInOver = ballInOver;

    curr_Inning.striker = striker;

    curr_Inning.nonStriker = non_striker;

    curr_Inning.totalWickets = totalWickets;

    curr_Inning.strikerRuns = strikerRuns;
    curr_Inning.strikerBalls = strikerBalls;

    curr_Inning.nonStrikerRuns = nonStrikerRuns;
    curr_Inning.nonStrikerBalls = nonStrikerBalls;



   // FIRST INNINGS COMPLETE
let totalOvers = match.overs;

if (
  curr_Inning.innings === 1 &&
  (
    currentOver >= totalOvers ||
    totalWickets === 10
  )
) {

  curr_Inning.status = "completed";

  await curr_Inning.save();

  match.target = total_run + 1;

  await match.save();

  return res.status(200).json({

    message: "Innings completed. Start 2nd innings",

    target: match.target

  });

}

    // SAVE NORMAL
    await curr_Inning.save();



    // SOCKET EMIT
    const io = getIo();

    io.to(matchid).emit("scoreUpdate", {

      totalRuns: curr_Inning.totalRuns,

      wickets: curr_Inning.totalWickets,

      over: curr_Inning.currentOver,

      ball: curr_Inning.ballInOver

    });



    // MATCH COMPLETE
    // MATCH COMPLETE
if (
  curr_Inning.innings === 2 &&
  total_run >= match.target
) {

  curr_Inning.status = "completed";

  await curr_Inning.save();

  match.status = "completed";

  await match.save();

  const io = getIo();

  let winnerTeam = match.teamBName;

  io.to(matchid).emit("matchEnded", {

    winner: winnerTeam

  });

  io.to(matchid).emit("scoreUpdate", {

    totalRuns: curr_Inning.totalRuns,

    wickets: curr_Inning.totalWickets,

    over: curr_Inning.currentOver,

    ball: curr_Inning.ballInOver

  });

  return res.status(201).json({

    message:"Match completed",

    winner: winnerTeam,

    data:newball

  });

}



    return res.status(201).json({
      message: "Ball recorded successfully",
      data: newball
    });

  }

  catch(error){

    console.log("BALL ERROR:", error);

    return res.status(500).json({
      message:"Server error"
    });

  }

};

const getCurrentInnings = async (req, res) => {

  try {

    const { matchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(matchId)) {

      return res.status(400).json({
        message: "Invalid match ID"
      });

    }

    const innings = await Innings.findOne({
      matchId,
      status: "live"
    });

    if (!innings) {

      return res.status(404).json({
        message: "No live innings found"
      });

    }

    return res.status(200).json({
      innings
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = { createMatch, getMatchById, Start_Innings, singleball, getCurrentInnings};



// // get new players for 2nd innings
// let { newStriker, newNonStriker, newBowler } = req.body;

// if (!newStriker || !newNonStriker || !newBowler) {
//   return res.status(400).json({
//     message: "2nd innings players required"
//   });
// }

// // create second innings
// await Innings.create({
//   matchId: matchid,
//   innings: 2,
//   striker: newStriker,
//   nonStriker: newNonStriker,
//   bowler: newBowler,
//   totalRuns: 0,
//   totalWickets: 0,
//   currentOver: 0,
//   ballInOver: 0
// });
// }
