import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import ScoringPanel from "../Components/ScoringPanel";
import WinnerModal from "../Components/WinnerModal";

const API = "https://gullycrickers-2-0.onrender.com/api";

function LiveMatch({ token }) {

  const { id } = useParams();

  const [matchData, setMatchData] = useState(null);

  const [liveScore, setLiveScore] = useState(null);

  const [currentInnings, setCurrentInnings] = useState(null);
  const [winner, setWinner] = useState("");



  useEffect(() => {

    fetchMatch();

    fetchCurrentInnings();

  }, []);



  useEffect(() => {

    const socket = io("https://gullycrickers-2-0.onrender.com", {
  transports: ["websocket", "polling"]
});

    socket.emit("joinMatch", id);

  socket.on("scoreUpdate", async (data) => {

  console.log("LIVE:", data);

  setLiveScore(data);

  await fetchCurrentInnings();

  await fetchMatch();

});

socket.on("matchEnded", (data) => {

  setWinner(data.winner);

});

    return () => {

      socket.disconnect();

    };

  }, [id]);



  const fetchMatch = async () => {

    try {

      const res = await fetch(`${API}/match/${id}`);

      const data = await res.json();

      if (!res.ok) {

        return alert(data.message);

      }

      setMatchData(data);

    } catch (error) {

      alert("Error fetching match");

    }

  };



  const fetchCurrentInnings = async () => {

    try {

      const res = await fetch(
        `${API}/match/current-innings/${id}`
      );

      const data = await res.json();

      if (res.ok) {

        setCurrentInnings(data.innings);

        setLiveScore({
          totalRuns: data.innings.totalRuns,
          wickets: data.innings.totalWickets,
          over: data.innings.currentOver,
          ball: data.innings.ballInOver
        });

      }

    } catch (error) {

      console.log(error);

    }

  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        GullyCrickers Live Arena
      </h1>
      <button
  onClick={() => {

    navigator.clipboard.writeText(window.location.href);

    alert("Match link copied!");

  }}
  className="bg-blue-500 px-5 py-2 rounded-xl hover:bg-blue-600 transition mb-6"
>

   Share Match Link

</button>



      {matchData && (

        <div className="bg-white/10 p-6 rounded-2xl mb-6">

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold">
                {matchData.teamAName} vs {matchData.teamBName}
              </h2>

             <p className="text-gray-400">
  {matchData.overs} Overs Match
</p>

{matchData.target && (

  <p className="text-green-400 font-bold mt-2">
     Target: {matchData.target}
  </p>

)}

{matchData.target && liveScore && (

  <div className="mt-4 bg-red-500/20 border border-red-500 p-4 rounded-xl">

    <p className="text-xl font-bold text-red-400">

      Need {matchData.target - liveScore.totalRuns} Runs

    </p>

  </div>

)}

            </div>

            <div className="text-right">

              <p className="text-yellow-400 font-bold">
                Status: {matchData.status}
              </p>

            </div>

          </div>

        </div>

      )}


      
      {currentInnings && (

  <p className="text-center text-2xl font-bold text-yellow-400 mb-4">

    {currentInnings.innings === 1
      ? "1st Innings"
      : "2nd Innings"}

  </p>

)}


      {liveScore && (

        <div className="bg-black/40 border border-gray-700 p-6 rounded-2xl mb-6">

          <h2 className="text-xl mb-4">
            Live Score
          </h2>

          <div className="flex justify-around text-lg">

            <div>

              <p className="text-gray-400">
                Runs
              </p>

              <p className="text-3xl font-bold text-green-400">
                {liveScore.totalRuns}
              </p>

            </div>

            <div>

              <p className="text-gray-400">
                Wickets
              </p>

              <p className="text-3xl font-bold text-red-400">
                {liveScore.wickets}
              </p>

            </div>

            <div>

              <p className="text-gray-400">
                Overs
              </p>

              <p className="text-3xl font-bold">
                {liveScore.over}.{liveScore.ball}
              </p>

            </div>

          </div>

        </div>

      )}



      {currentInnings && (

        <div className="bg-white/10 p-6 rounded-2xl mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Batting
          </h2>

          <div className="flex justify-between items-center mb-3">

            <div>

              <p className="text-lg font-semibold text-green-400">
                {currentInnings.striker} - {currentInnings.strikerRuns} ({currentInnings.strikerBalls}) *
              </p>

            </div>

            <div>

              <p className="text-lg font-semibold">
                {currentInnings.nonStriker} - {currentInnings.nonStrikerRuns} ({currentInnings.nonStrikerBalls})
              </p>

            </div>

          </div>

          <div className="mt-6 border-t border-gray-700 pt-4">

            <p className="text-gray-400">
              Current Bowler
            </p>

            <p className="text-xl font-bold text-yellow-400">
              {currentInnings.bowler}
            </p>

          </div>

        </div>

      )}


       <WinnerModal
  winner={winner}
  onClose={() => setWinner("")}
/>


   <ScoringPanel
  matchId={id}
  token={token}
  setWinner={setWinner}
  winner={winner}
/>

    </div>

  );

}

export default LiveMatch;