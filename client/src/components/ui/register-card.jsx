import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, Eye, EyeOff } from 'lucide-react';
import AppInput from './app-input';
import { useAuth } from '../../context/auth-context';

const RegisterCard = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

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
    setIsLoading(true);
    try {
      const result = await register(name, email, password, passwordConfirm);
      if (result?.success) {
        navigate('/');
        return;
      }
      setError(result?.error || 'Registrasi gagal.');
    } catch {
      setError('Server error.');
    } finally {
      setIsLoading(false);
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
      <div className='card w-[90%] lg:w-[70%] md:w-[80%] flex justify-between h-[650px] rounded-xl overflow-hidden shadow-2xl'>
        <div className='hidden lg:block w-1/2 left h-full overflow-hidden'>
          <img
            src='https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=1200&fit=crop'
            alt="Travel destination"
            className="w-full h-full object-cover transition-transform duration-300 opacity-50 hover:opacity-70 hover:scale-105"
          />
        </div>
        <div
          className='w-full lg:w-1/2 px-4 lg:px-12 right h-full relative overflow-hidden bg-[var(--color-surface)]'
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
          <div className="form-container sign-up-container h-full z-10">
            <form className='text-center py-8 md:py-12 grid gap-2 h-full relative z-10' onSubmit={handleRegister}>
              <div className='grid gap-3 md:gap-4 mb-2'>
                <h1 className='text-3xl md:text-4xl font-extrabold text-[var(--color-heading)]'>Daftar</h1>
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
                <span className='text-sm text-[var(--color-text-secondary)]'>atau daftar dengan email</span>
              </div>
              <div className='grid gap-3 items-center'>
                <AppInput 
                  placeholder="Nama Lengkap" 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <AppInput 
                  placeholder="Email" 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <AppInput 
                  placeholder="Password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
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
                <AppInput 
                  placeholder="Konfirmasi Password" 
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(v => !v)}
                      className="cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
                      tabIndex={-1}
                    >
                      {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>
              {error && <div className="text-red-400 text-sm text-center">{error}</div>}
              <div className='flex gap-4 justify-center items-center mt-2'>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-[var(--color-border)] px-4 py-1.5 text-xs font-normal text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-text-primary)]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm px-4 py-1 text-[var(--color-text-primary)]">
                    {isLoading ? "Memuat..." : "Daftar"}
                  </span>
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                    <div className="relative h-full w-8 bg-white/20" />
                  </div>
                </button>
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-2">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-[var(--color-text-primary)] hover:underline">
                  Masuk di sini
                </Link>
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                Dengan mendaftar, Anda menyetujui{' '}
                <a href="#" className="hover:underline">Syarat & Ketentuan</a> dan{' '}
                <a href="#" className="hover:underline">Kebijakan Privasi</a>.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCard;
