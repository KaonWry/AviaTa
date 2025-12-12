
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/theme-context';

export default function Account() {
	let name = '';
	try {
		const session = JSON.parse(localStorage.getItem('aviata-auth'));
		if (session && typeof session === 'object' && 'name' in session) {
			name = session.name;
		}
	} catch (e) {
		name = '';
	}
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();
	const handleLogout = () => {
		localStorage.removeItem('aviata-auth');
		navigate('/');
		window.location.reload();
	};
	return (
		<div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 bg-primary/80 dark:bg-primary/60`}>
			<div className={`p-8 rounded shadow text-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
				<h1 className="text-2xl font-bold mb-4">Akun (Dummy Page)</h1>
				{name && (
					<p className="mb-2 text-lg">Halo, <span className="font-semibold">{name}</span></p>
				)}
				<p className="mb-6">Halaman akun belum tersedia.</p>
				<button
					className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</div>
	);
}

