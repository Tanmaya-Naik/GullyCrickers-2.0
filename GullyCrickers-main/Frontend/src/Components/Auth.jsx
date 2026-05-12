// import { useState } from "react";

// const API = "http://localhost:5000/api";

// function Auth({ onLogin }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!email || !password || (!isLogin && !name)) {
//       alert("All fields are mandatory");
//       return;
//     }

//     try {
//       setLoading(true);

//       const endpoint = isLogin ? "login" : "register";
//       const bodyData = isLogin
//         ? { email, password }
//         : { name, email, password };

//       const res = await fetch(`${API}/auth/${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bodyData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Something went wrong");
//         return;
//       }

//       onLogin(data.token);
//     } catch (err) {
//       alert("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>{isLogin ? "Login" : "Register"}</h2>

//       {!isLogin && (
//         <input
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//       )}

//       <input
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button
//         className="primary-btn"
//         onClick={handleSubmit}
//         disabled={loading}
//       >
//         {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
//       </button>

//       <button
//         className="secondary-btn"
//         onClick={() => setIsLogin(!isLogin)}
//       >
//         {isLogin
//           ? "Need an account? Register"
//           : "Already have an account? Login"}
//       </button>
//     </div>
//   );
// }

// export default Auth;

import { useState } from "react";
import { motion } from "framer-motion";

const API = "https://gullycrickers-2-0.onrender.com/api";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      alert("All fields are mandatory");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isLogin ? "login" : "register";
      const bodyData = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await fetch(`${API}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      onLogin(data.token);
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Welcome Back 👋" : "Create Account"}
        </h2>

        <div className="flex flex-col gap-4">

          {!isLogin && (
            <input
              className="p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 bg-green-500 py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-300 hover:text-white transition"
          >
            {isLogin
              ? "Don’t have an account? Register"
              : "Already have an account? Login"}
          </button>

        </div>
      </motion.div>
    </div>
  );
}

export default Auth;