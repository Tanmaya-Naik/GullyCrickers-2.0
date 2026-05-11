import { useState } from "react";
import { motion } from "framer-motion";

const API = "https://gullycrickers-2-0.onrender.com/api/match";

function ScoringPanel({ matchId, token, setWinner, winner }) {

  const [striker, setStriker] = useState("");

  const [nonStriker, setNonStriker] = useState("");

  const [bowler, setBowler] = useState("");

  const [newBatsman, setNewBatsman] = useState("");

  const [loading, setLoading] = useState(false);

  const [inningsStarted, setInningsStarted] = useState(false);

  const [inningsCompleted, setInningsCompleted] = useState(false);



  // START INNINGS
  const startInnings = async () => {

    try {

      setLoading(true);

      const res = await fetch(`${API}/start-innings`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          matchId,
          striker,
          nonStriker,
          bowler,
        }),

      });

      const data = await res.json();

      if (!res.ok) {

        throw new Error(data.message);

      }

      setInningsStarted(true);

      setInningsCompleted(false);

    }

    catch (err) {

      alert(err.message);

    }

    finally {

      setLoading(false);

    }

  };



  // BALL EVENT
  const sendBall = async (
    runs,
    wicket = null,
    extra = null,
    newBatsman = null
  ) => {

    try {

      const res = await fetch(`${API}/ball`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          matchid: matchId,
          runs,
          extras: extra,
          wicket,
          newBatsman
        }),

      });

      const data = await res.json();

      if (!res.ok) {

        return alert(data.message);

      }



      // FIRST INNINGS COMPLETE
      if (
        data.message === "Innings completed. Start 2nd innings"
      ) {

        alert(`1st Innings Over  Target: ${data.target}`);

        setInningsCompleted(true);

        setInningsStarted(false);

      }



      // MATCH COMPLETE
      if (
        data.message === "Match completed"
      ) {

        setWinner(data.winner);

      }

    }

    catch (err) {

      console.log(err);

    }

  };



  return (

    <div className="mt-8">

      {/* START INNINGS UI */}
      {!inningsStarted && (

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl"
        >

          <h2 className="text-xl mb-4">
            Start Innings
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              className="p-3 rounded-lg bg-gray-800"
              placeholder="Striker"
              value={striker}
              onChange={(e) => setStriker(e.target.value)}
            />

            <input
              className="p-3 rounded-lg bg-gray-800"
              placeholder="Non-Striker"
              value={nonStriker}
              onChange={(e) => setNonStriker(e.target.value)}
            />

            <input
              className="p-3 rounded-lg bg-gray-800"
              placeholder="Bowler"
              value={bowler}
              onChange={(e) => setBowler(e.target.value)}
            />

          </div>

          <button
            onClick={startInnings}
            disabled={loading}
            className="mt-5 w-full bg-green-500 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >

            {loading ? "Starting..." : "Start Innings"}

          </button>

        </motion.div>

      )}



      {/* SCORING CONTROLS */}
      {inningsStarted && !inningsCompleted && !winner && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-black/40 p-6 rounded-2xl border border-gray-700"
        >

          <h2 className="text-xl mb-4">
            Scoring Controls
          </h2>



          {/* RUN BUTTONS */}
          <div className="grid grid-cols-4 gap-3 mb-4">

            {[0, 1, 2, 3, 4, 6].map((run) => (

              <button
                key={run}
                onClick={() => sendBall(run)}
                className="bg-blue-500 py-3 rounded-lg hover:bg-blue-600 transition font-bold"
              >

                {run}

              </button>

            ))}

          </div>



          {/* WICKET */}
          <div className="mb-4">

            <input
              type="text"
              placeholder="Enter New Batsman"
              value={newBatsman}
              onChange={(e) => setNewBatsman(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 mb-3"
            />

            <button
              onClick={() => {

                if (!newBatsman) {

                  return alert("Enter new batsman name");

                }

                sendBall(
                  0,
                  { isWicket: true, type: "bowled" },
                  null,
                  newBatsman
                );

                setNewBatsman("");

              }}
              className="w-full bg-red-500 py-3 rounded-lg hover:bg-red-600"
            >

              Wicket

            </button>

          </div>



          {/* EXTRAS */}
          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={() => sendBall(0, null, "wide")}
              className="bg-yellow-500 py-3 rounded-lg hover:bg-yellow-600"
            >

              Wide

            </button>

            <button
              onClick={() => sendBall(0, null, "noball")}
              className="bg-purple-500 py-3 rounded-lg hover:bg-purple-600"
            >

              No Ball

            </button>

          </div>

        </motion.div>

      )}

    </div>

  );

}

export default ScoringPanel;