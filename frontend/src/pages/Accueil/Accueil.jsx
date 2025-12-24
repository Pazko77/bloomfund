import logo from '/BloomfundLogo.svg';
import './Accueil.scss';

function Accueil() {
	return (
		<div className="accueil">
			<div className="accueil-content">
				<img className="accueil-logo" src={logo} alt="LogoBloomFund" />
				<div className="accueil-decorationBar">
					<svg xmlns="http://www.w3.org/2000/svg" width="471" height="12" viewBox="0 0 471 12" fill="none">
						<path
							d="M-4.76837e-07 5.77356L5.7735 11.5471L11.547 5.77356L5.7735 5.67436e-05L-4.76837e-07 5.77356ZM470.211 5.77356L464.438 5.67436e-05L458.664 5.77356L464.438 11.5471L470.211 5.77356ZM5.7735 5.77356V6.77356H464.438V5.77356V4.77356H5.7735V5.77356Z"
							fill="#162816"
						/>
					</svg>
				</div>
				<p className="accueil-slogan">Fais grandir les projets qui changent la planète</p>
				<a className="accueil-button" href="/rechercher">
					Découvrir les projets
				</a>
				<div className="accueil-ellipse" id="ellipse1"></div>
				<div className="accueil-ellipse" id="ellipse2"></div>
				<div className="accueil-ellipse" id="ellipse3"></div>
				<div className="accueil-ellipse" id="ellipse4"></div>
				<div className="accueil-ellipse" id="ellipse5"></div>
				<div className="accueil-ellipse" id="ellipse6"></div>
			</div>
		</div>
	);
}

export default Accueil;
