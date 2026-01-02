import './Navbar.scss';
import logoNoText from '/BloomfundNoText.svg';
import searchIcon from '/search.svg';
import arrow from '/green_arrow-left.svg';
import { useLocation, Link } from 'react-router-dom';
import { isTokenExpired } from './../../helpers/token/tokenExpire';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Navbar() {
	const location = useLocation();
	const [userProfil, setUserProfil] = useState(null);

	const formRoutes = ['/form', '/formCagnotte', '/inscription', '/connexion', '/profil', '/legal'];
	const isFormPage = formRoutes.includes(location.pathname);
	const token = localStorage.getItem('token');

	const isTokenExpiredValue = isTokenExpired(token);

	useEffect(() => {
		const fetchUserProfil = async () => {
			if (!isTokenExpiredValue && token) {
				try {
					const response = await axios.get(`${import.meta.env.VITE_API_URL}/utilisateurs/profile`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					setUserProfil(response.data);
				} catch (error) {
					console.error(error);
				}
			}
		};
		fetchUserProfil();
	}, [isTokenExpiredValue, token]);

	const navLinks = isFormPage
		? [{ href: '/', icon: arrow, alt: 'Retour' }]
		: [
				{ href: '/rechercher', text: 'Rechercher', icon: searchIcon },
				{ href: '/about', text: 'À propos' },
				{ href: '/', icon: logoNoText, alt: 'LogoBloomFund' },
				{ href: '/formCagnotte', text: 'Démarrer une cagnotte' },
				isTokenExpiredValue ? { href: '/connexion', text: 'Se connecter' } : { href: '/profil', text: 'Mon profil' },
			];

	if (location.pathname.includes('/payment')) {
		return null;
	}
	
	return (
		<div className={`navbar ${isFormPage ? 'navbar--logo-only' : ''}`}>
			<nav>
				<ul>
					{navLinks.map((link, index) => (
						<li key={index}>
							{link.href === '/profil' && userProfil ? (
								<Link className="flex items-center justify-center px-4 w-45  " to={link.href}>
									<div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold shrink-0 text-sm hover:bg-[#4c9a4e] hover:text-white transition duration-300">
										{userProfil.Utilisateur.prenom?.charAt(0)}
										{userProfil.Utilisateur.nom?.charAt(0)}
									</div>
								</Link>
							) : (
								<Link className="navbar-item" to={link.href}>
									{link.icon && <img src={link.icon} alt={link.alt || ''} />}
									{link.text && ` ${link.text}`}
								</Link>
							)}
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}

export default Navbar;
