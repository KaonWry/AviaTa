import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!id.trim() || !password.trim()) {
      setError("Silakan isi email/nomor HP dan password.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Store username in localStorage for dev session
        localStorage.setItem('username', data.username);
        navigate("/");
        window.location.reload();
      } else {
        setError(data.error || "Login gagal.");
      }
    } catch (err) {
      setError("Terjadi kesalahan server.");
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-[#FBFBFB]">
      <div className="login-wrapper bg-white rounded-xl shadow-md p-8 w-full max-w-sm flex flex-col gap-4">
        <div className="login-title text-xl font-semibold mb-2 text-center">Masuk ke AviaTa</div>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="text"
            id="login-id"
            className="login-input border border-[#E0E0E0] rounded-full px-4 py-2 focus:outline-none"
            placeholder="Email atau Nomor Telepon"
            value={id}
            onChange={e => setId(e.target.value)}
            autoComplete="username"
          />
          <div className="password-container relative">
            <input
              type={showPassword ? "text" : "password"}
              id="login-pass"
              className="login-input border border-[#E0E0E0] rounded-full px-4 py-2 w-full focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
              aria-label="Tampilkan password"
            >
              {showPassword ? (
                <i className="fa fa-eye" />
              ) : (
                <i className="fa fa-eye-slash" />
              )}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            className="login-btn bg-[#4A70A9] text-white rounded-full py-2 font-semibold mt-2"
            id="btn-login"
            type="submit"
          >
            Masuk
          </button>
        </form>
        <div className="login-divider text-center text-xs text-gray-400 my-2">atau lanjut dengan</div>
        <div className="social-row flex justify-center gap-3">
          <button className="soc-btn border border-[#E0E0E0] rounded-full w-10 h-10 flex items-center justify-center text-lg bg-white"><i className="fa-brands fa-google"></i></button>
          <button className="soc-btn border border-[#E0E0E0] rounded-full w-10 h-10 flex items-center justify-center text-lg bg-white"><i className="fa-brands fa-facebook"></i></button>
          <button className="soc-btn border border-[#E0E0E0] rounded-full w-10 h-10 flex items-center justify-center text-lg bg-white"><i className="bi bi-apple"></i></button>
        </div>
        <div className="login-footer text-xs text-center mt-2">
          <p>
            Belum punya akun?{' '}
            <a href="/register" className="text-[#4A70A9] hover:underline">Daftar sekarang</a>
          </p>
          <p className="mt-1">
            Dengan login, Anda menyetujui{' '}
            <a href="#" className="hover:underline">Syarat & Ketentuan</a> dan{' '}
            <a href="#" className="hover:underline">Kebijakan Privasi</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
