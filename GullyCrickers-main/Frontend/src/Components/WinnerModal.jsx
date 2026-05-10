import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function WinnerModal({ winner, onClose }) {

  const navigate = useNavigate();

  if (!winner) return null;

  return (

    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">

      <motion.div

        initial={{
          y: 400,
          opacity: 0,
          scale: 0.5
        }}

        animate={{
          y: 0,
          opacity: 1,
          scale: 1
        }}

        transition={{
          type: "spring",
          stiffness: 120,
          damping: 10
        }}

        className="bg-gradient-to-br from-yellow-400 to-orange-500 text-black p-10 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4"
      >

        <motion.div

          animate={{
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.2, 1]
          }}

          transition={{
            repeat: Infinity,
            duration: 2
          }}

          className="text-7xl mb-6"
        >

          🏆

        </motion.div>

        <h1 className="text-4xl font-extrabold mb-4">

          CONGRATULATIONS

        </h1>

        <p className="text-2xl font-bold mb-6">

          🎉 {winner} WON THE MATCH 🎉

        </p>

        <button
          onClick={onClose}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >

          Close

        </button>

        <button
  onClick={() => navigate("/")}
  className="bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition mt-4 w-full"
>

  ← Back to Dashboard

</button>

      </motion.div>

    </div>

  );

}

export default WinnerModal;