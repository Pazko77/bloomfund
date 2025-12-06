import './Navbar.css';
import logoNoText from '../../assets/BloomfundNoText.svg';
import searchIcon from '../../assets/search.svg';

function Navbar() {
    return (
        <div className="navbar">
            <nav>
                <ul>
                    <li><a className="navbar-item" href="/rechercher"><img src={searchIcon} alt="" /> Rechercher</a></li>
                    <li><a className="navbar-item" href="/about">À propos</a></li>
                    <li><a className="navbar-item" href="/"><img src={logoNoText} alt="LogoBloomFund" /></a></li>
                    <li><a className="navbar-item" href="/form">Démarrer une cagnotte</a></li>
                    <li><a className="navbar-item" href="/connexion">Connexion</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
