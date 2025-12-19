import './Navbar.scss';
import logoNoText from '/BloomfundNoText.svg';
import searchIcon from '/search.svg';
import { useLocation } from 'react-router-dom';
function Navbar() {
	const navLinks = [
		{ href: '/rechercher', text: 'Rechercher', icon: searchIcon },
		{ href: '/about', text: 'À propos' },
		{ href: '/', icon: logoNoText, alt: 'LogoBloomFund' },
		{ href: '/form', text: 'Démarrer une cagnotte' },
		{ href: '/connexion', text: 'Connexion' },
	];

    	const location = useLocation(); 

        const hiddenRoutes = ['/connexion', '/inscription'];

        if (hiddenRoutes.includes(location.pathname)) {
            return null;
        }

	return (
		<div className="navbar">
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
