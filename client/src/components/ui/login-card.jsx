import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, Eye, EyeOff } from 'lucide-react';
import AppInput from './app-input';

const LoginCard = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const leftSection = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - leftSection.left,
      y: e.clientY - leftSection.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

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
        localStorage.setItem('username', data.username);
        navigate("/");
        window.location.reload();
      } else {
        setError(data.error || "Login gagal.");
      }
    } catch {
      setError("Terjadi kesalahan server.");
    }
  };

  const socialIcons = [
    {
      icon: <Instagram size={20} />,
      href: '#',
      gradient: 'bg-[var(--color-bg)]',
    },
    {
      icon: <Linkedin size={20} />,
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    },
    {
      icon: <Facebook size={20} />,
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    }
  ];

  return (
    <div className="h-screen w-full bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className='card w-[90%] lg:w-[70%] md:w-[80%] flex justify-between h-[600px] rounded-xl overflow-hidden shadow-2xl'>
        <div
          className='w-full lg:w-1/2 px-4 lg:px-16 left h-full relative overflow-hidden bg-[var(--color-surface)]'
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`absolute pointer-events-none w-[500px] h-[500px] bg-gradient-to-r from-purple-300/30 via-blue-300/30 to-pink-300/30 rounded-full blur-3xl transition-opacity duration-200 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div className="form-container sign-in-container h-full z-10">
            <form className='text-center py-10 md:py-20 grid gap-2 h-full relative z-10' onSubmit={handleLogin}>
              <div className='grid gap-4 md:gap-6 mb-2'>
                <h1 className='text-3xl md:text-4xl font-extrabold text-[var(--color-heading)]'>Masuk</h1>
                <div className="social-container">
                  <div className="flex items-center justify-center">
                    <ul className="flex gap-3 md:gap-4">
                      {socialIcons.map((social, index) => {
                        return (
                          <li key={index} className="list-none">
                            <a
                              href={social.href}
                              className={`w-[2.5rem] md:w-[3rem] h-[2.5rem] md:h-[3rem] bg-[var(--color-bg-2)] rounded-full flex justify-center items-center relative z-[1] border-2 border-[var(--color-text-primary)] overflow-hidden group`}
                            >
                              <div
                                className={`absolute inset-0 w-full h-full ${
                                  social.gradient || social.bg
                                } scale-y-0 origin-bottom transition-transform duration-500 ease-in-out group-hover:scale-y-100`}
                              />
                              <span className="text-[1.5rem] text-[#101214] transition-all duration-500 ease-in-out z-[2] group-hover:text-[var(--color-text-primary)] group-hover:rotate-y-360">
                                {social.icon}
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <span className='text-sm text-[var(--color-text-secondary)]'>atau gunakan akun Anda</span>
              </div>
              <div className='grid gap-4 items-center'>
                <AppInput 
                  placeholder="Email atau Nomor Telepon" 
                  type="text" 
                  value={id}
                  onChange={e => setId(e.target.value)}
                  autoComplete="username"
                />
                <div className="relative">
                  <AppInput 
                    placeholder="Password" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    icon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                </div>
              </div>
              {error && <div className="text-red-400 text-sm text-center">{error}</div>}
              <a href="#" className='font-light text-sm md:text-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors'>
                Lupa password?
              </a>
              <div className='flex gap-4 justify-center items-center'>
                <button 
                  type="submit"
                  className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-[var(--color-border)] px-4 py-1.5 text-xs font-normal text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-text-primary)]/20 cursor-pointer"
                >
                  <span className="text-sm px-4 py-1 text-[var(--color-text-primary)]">Masuk</span>
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                    <div className="relative h-full w-8 bg-white/20" />
                  </div>
                </button>
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-2">
                Belum punya akun?{' '}
                <Link to="/register" className="text-[var(--color-text-primary)] hover:underline">
                  Daftar sekarang
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className='hidden lg:block w-1/2 right h-full overflow-hidden'>
          <img
            src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=1200&fit=crop'
            alt="Airplane wing view"
            className="w-full h-full object-cover transition-transform duration-300 opacity-50 hover:opacity-70 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
