import './Navbar.scss';
import logoNoText from '/BloomfundNoText.svg';
import searchIcon from '/search.svg';
import logoText from '/BloomfundLogo.svg';
import { useLocation } from 'react-router-dom';

function Navbar() {
	const location = useLocation();

	const formRoutes = ['/form', '/formCagnotte', '/inscription', '/connexion'];
	const isFormPage = formRoutes.includes(location.pathname);

	const navLinks = isFormPage
		? [{ href: '/', icon: logoText, alt: 'LogoBloomFund' }]
		: [
				{ href: '/rechercher', text: 'Rechercher', icon: searchIcon },
				{ href: '/about', text: 'À propos' },
				{ href: '/', icon: logoNoText, alt: 'LogoBloomFund' },
				{ href: '/form', text: 'Démarrer une cagnotte' },
				{ href: '/connexion', text: 'Connexion' },
			];

	return (
		<div className={`navbar ${isFormPage ? 'navbar--logo-only' : ''}`}>
			<nav>
				<ul>
					{navLinks.map((link, index) => (
						<li key={index}>
							<a className="navbar-item" href={link.href}>
								{link.icon && <img src={link.icon} alt={link.alt || ''} />}
								{link.text && ` ${link.text}`}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}

export default Navbar;
