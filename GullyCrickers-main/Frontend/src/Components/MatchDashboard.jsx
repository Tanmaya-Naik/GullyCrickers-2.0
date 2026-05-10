import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function MatchDashboard({ token, onLogout }) {

  const navigate = useNavigate();

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [overs, setOvers] = useState("");
  const [matchId, setMatchId] = useState("");

  const createMatch = async () => {

    try {

      const res = await fetch(`${API}/match/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          teamAName: teamA,
          teamBName: teamB,
          overs,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      setMatchId(data.matchId);

      navigate(`/match/${data.matchId}`);

    } catch (error) {

      alert("Server error");

    }

  };

  const fetchMatch = async () => {

    if (!matchId) {
      return alert("Enter Match ID");
    }

    try {

      const res = await fetch(`${API}/match/${matchId}`);

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      navigate(`/match/${matchId}`);

    } catch (error) {

      alert("Error fetching match");

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold tracking-wide">
           GullyCrickers
        </h1>

        <button
          onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-6"
      >

        <h2 className="text-xl font-semibold mb-4">
          Create Match
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            className="p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Team A"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
          />

          <input
            className="p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Team B"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
          />

          <input
            type="number"
            className="p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Overs"
            value={overs}
            onChange={(e) => setOvers(e.target.value)}
          />

        </div>

        <button
          onClick={createMatch}
          className="mt-5 w-full bg-green-500 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Create Match
        </button>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl"
      >

        <h2 className="text-xl font-semibold mb-4">
          Load Match
        </h2>

        <div className="flex gap-3">

          <input
            className="p-3 rounded-lg bg-gray-800 flex-1"
            placeholder="Enter Match ID"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
          />

          <button
            onClick={fetchMatch}
            className="bg-blue-500 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            Open Match
          </button>

        </div>

      </motion.div>

    </div>

  );
}

export default MatchDashboard;





// // import { useState, useEffect } from "react";
// // import { io } from "socket.io-client";
// // import ScoringPanel from "./ScoringPanel";


// // const API = "http://localhost:5000/api";

// // function MatchDashboard({ token, onLogout }) {
// // const [teamA, setTeamA] = useState("");
// // const [teamB, setTeamB] = useState("");
// // const [overs, setOvers] = useState("");
// // const [matchId, setMatchId] = useState("");
// // const [matchData, setMatchData] = useState(null);

// // //  NEW live score state
// // const [liveScore, setLiveScore] = useState(null);

// // //  NEW socket connection
// // useEffect(() => {
// // if (!matchId) return; // don't getconnect if no match


// // const socket = io("http://localhost:5000");

// // console.log("Connecting to socket...");

// // socket.emit("joinMatch", matchId);

// // socket.on("scoreUpdate", (data) => {
// //   console.log("LIVE SCORE:", data);
// //   setLiveScore(data);
// // });

// // return () => {
// //   socket.disconnect();
// // };


// // }, [matchId]);

// // // CREATE MATCH
// // const createMatch = async () => {
// // try {
// // const res = await fetch(`${API}/match/create`, {
// // method: "POST",
// // headers: {
// // "Content-Type": "application/json",
// // Authorization: `Bearer ${token}`,
// // },
// // body: JSON.stringify({
// // teamAName: teamA,
// // teamBName: teamB,
// // overs,
// // }),
// // });


// //   const data = await res.json();

// //   if (!res.ok) {
// //     alert(data.message);
// //     return;
// //   }

// //   setMatchId(data.matchId);
// //   alert("Match Created");
// // } catch (err) {
// //   alert("Server error");
// // }


// // };

// // // FETCH MATCH
// // const fetchMatch = async () => {
// // try {
// // const res = await fetch(`${API}/match/${matchId}`);
// // const data = await res.json();


// //   if (!res.ok) {
// //     alert(data.message);
// //     return;
// //   }

// //   setMatchData(data);
// // } catch (err) {
// //   alert("Error fetching match");
// // }


// // };



// // return ( <div> <h1>Create Match</h1>

// // <input
// //   placeholder="Enter Match ID"
// //   value={matchId}
// //   onChange={(e) => setMatchId(e.target.value)}
// // />


// //   <input
// //     placeholder="Team A"
// //     value={teamA}
// //     onChange={(e) => setTeamA(e.target.value)}
// //   />

// //   <input
// //     placeholder="Team B"
// //     value={teamB}
// //     onChange={(e) => setTeamB(e.target.value)}
// //   />

// //   <input
// //     type="number"
// //     placeholder="Overs"
// //     value={overs}
// //     onChange={(e) => setOvers(e.target.value)}
// //   />

// //   <button onClick={createMatch}>
// //     Create Match
// //   </button>

// //   {matchId && (
// //     <>
// //       <h3>Match ID: {matchId}</h3>

// //       <button onClick={fetchMatch}>
// //         Fetch Match
// //       </button>
// //     </>
// //   )}

// //   {matchData && (
// //     <div>
// //       <pre>{JSON.stringify(matchData, null, 2)}</pre>
// //     </div>
// //   )}

// //   {/*  NEW: LIVE SCORE UI */}
// //   {liveScore && (
// //     <div style={{ marginTop: "20px", border: "1px solid white", padding: "10px" }}>
// //       <h3>Live Score</h3>
// //       <p>Runs: {liveScore.totalRuns}</p>
// //       <p>Wickets: {liveScore.wickets}</p>
// //       <p>
// //         Over: {liveScore.over}.{liveScore.ball}
// //       </p>
// //     </div>
// //   )}

// //   {matchId && (
// //   <ScoringPanel matchId={matchId} />
// // )}

// //   <button onClick={onLogout}>
// //     Logout
// //   </button>
// // </div>


// // );
// // }

// // export default MatchDashboard;


// import { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { motion } from "framer-motion";
// import ScoringPanel from "./ScoringPanel";

// const API = "http://localhost:5000/api";

// function MatchDashboard({ token, onLogout }) {
//   const [teamA, setTeamA] = useState("");
//   const [teamB, setTeamB] = useState("");
//   const [overs, setOvers] = useState("");
//   const [matchId, setMatchId] = useState("");
//   const [matchData, setMatchData] = useState(null);
//   const [liveScore, setLiveScore] = useState(null);

//   useEffect(() => {
//     if (!matchId) return;

//     const socket = io("http://localhost:5000");

//     socket.emit("joinMatch", matchId);

//     socket.on("scoreUpdate", (data) => {
//       setLiveScore(data);
//     });

//     return () => socket.disconnect();
//   }, [matchId]);

//   const createMatch = async () => {
//     try {
//       const res = await fetch(`${API}/match/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           teamAName: teamA,
//           teamBName: teamB,
//           overs,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) return alert(data.message);

//       setMatchId(data.matchId);
//     } catch {
//       alert("Server error");
//     }
//   };

//   const fetchMatch = async () => {
//     try {
//       const res = await fetch(`${API}/match/${matchId}`);
//       const data = await res.json();
//       if (!res.ok) return alert(data.message);

//       setMatchData(data);
//     } catch {
//       alert("Error fetching match");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold tracking-wide">
//           🏏 GullyCrickers
//         </h1>

//         <button
//           onClick={onLogout}
//           className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//       </div>

//       {/* CREATE MATCH */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-6"
//       >
//         <h2 className="text-xl font-semibold mb-4">Create Match</h2>

//         <div className="grid md:grid-cols-3 gap-4">
//           <input
//             className="p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
//             placeholder="Team A"
//             value={teamA}
//             onChange={(e) => setTeamA(e.target.value)}
//           />

//           <input
//             className="p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
//             placeholder="Team B"
//             value={teamB}
//             onChange={(e) => setTeamB(e.target.value)}
//           />

//           <input
//             type="number"
//             className="p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
//             placeholder="Overs"
//             value={overs}
//             onChange={(e) => setOvers(e.target.value)}
//           />
//         </div>

//         <button
//           onClick={createMatch}
//           className="mt-5 w-full bg-green-500 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
//         >
//           Create Match
//         </button>
//       </motion.div>

//       {/* LOAD MATCH */}
//       <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-6">
//         <h2 className="text-xl mb-3">Load Match</h2>

//         <div className="flex gap-3">
//           <input
//             className="p-3 rounded-lg bg-gray-800 flex-1"
//             placeholder="Enter Match ID"
//             value={matchId}
//             onChange={(e) => setMatchId(e.target.value)}
//           />

//           <button
//             onClick={fetchMatch}
//             className="bg-blue-500 px-6 rounded-lg hover:bg-blue-600 transition"
//           >
//             Fetch
//           </button>
//         </div>
//       </div>

//       {/* LIVE SCORE */}
//       {liveScore && (
//         <motion.div
//           key={liveScore.totalRuns}
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className="bg-black/40 border border-gray-700 p-6 rounded-2xl mb-6"
//         >
//           <h2 className="text-xl mb-4">Live Score</h2>

//           <div className="flex justify-around text-lg">
//             <div>
//               <p className="text-gray-400">Runs</p>
//               <p className="text-3xl font-bold text-green-400">
//                 {liveScore.totalRuns}
//               </p>
//             </div>

//             <div>
//               <p className="text-gray-400">Wickets</p>
//               <p className="text-3xl font-bold text-red-400">
//                 {liveScore.wickets}
//               </p>
//             </div>

//             <div>
//               <p className="text-gray-400">Overs</p>
//               <p className="text-3xl font-bold">
//                 {liveScore.over}.{liveScore.ball}
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* DEBUG */}
//       {matchData && (
//         <div className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto mb-6">
//           <pre>{JSON.stringify(matchData, null, 2)}</pre>
//         </div>
//       )}

//       {/* SCORING PANEL */}
//       {matchId && <ScoringPanel matchId={matchId} token={token} matchData={matchData} />}
//     </div>
//   );
// }

// export default MatchDashboard;



