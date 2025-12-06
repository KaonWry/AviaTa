import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !passwordConfirm) {
      setError('Mohon isi semua data.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, passwordConfirm })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('username', data.username);
        navigate('/');
      } else {
        setError(data.error || 'Registrasi gagal.');
      }
    } catch (err) {
      setError('Server error.');
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gray-100">
      <div className="login-wrapper bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="login-title text-2xl font-bold mb-6 text-center">Daftar Akun AviaTa</div>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            className="login-input w-full mb-4 px-4 py-2 border rounded"
            placeholder="Nama Lengkap"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            className="login-input w-full mb-4 px-4 py-2 border rounded"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div className="password-container relative mb-4">
            <input
              type={showPass ? 'text' : 'password'}
              className="login-input w-full px-4 py-2 border rounded"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-500"
              onClick={() => setShowPass(v => !v)}
              tabIndex={-1}
            >
              <span className="fa fa-eye" />
            </button>
          </div>
          <div className="password-container relative mb-4">
            <input
              type={showPass2 ? 'text' : 'password'}
              className="login-input w-full px-4 py-2 border rounded"
              placeholder="Konfirmasi Password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-500"
              onClick={() => setShowPass2(v => !v)}
              tabIndex={-1}
            >
              <span className="fa fa-eye" />
            </button>
          </div>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          <button className="login-btn w-full bg-blue-600 text-white py-2 rounded font-semibold mb-4" type="submit">Daftar</button>
        </form>
        <div className="login-divider text-center my-4">atau daftar dengan</div>
        <div className="social-row flex justify-center gap-4 mb-4">
          <button className="soc-btn bg-gray-200 p-2 rounded"><span className="fa-brands fa-google" /></button>
          <button className="soc-btn bg-gray-200 p-2 rounded"><span className="fa-brands fa-facebook" /></button>
          <button className="soc-btn bg-gray-200 p-2 rounded"><span className="bi bi-apple" /></button>
        </div>
        <div className="login-footer text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Masuk di sini</a>.
        </div>
      </div>
    </div>
  );
}
