import React, { useState, useEffect } from 'react';
import './DashboardAdmin.scss';
import logoNoText from '/BloomfundNoText.svg';
import { SidebarItem } from '../../components/Dashboard/SidebarItem.jsx';
import { Icons } from '../../components/Dashboard/Icons/Icons.jsx';
import { Loader } from '../../components/shared/Loader.jsx';
import { Overview } from '../../components/Dashboard/views/overview.jsx';
import { UsersViews } from '../../components/Dashboard/views/users.jsx';
import { ProjectsViews } from '../../components/Dashboard/views/projects.jsx';
import api from '../../helpers/request/api';
import { useAuth } from '../../hook/useAuth';
import { encodeId } from '../../helpers/encoder/hashId.js';

export default function DashboardAdmin() {
	const userProfil = useAuth();
	const [currentView, setCurrentView] = useState('overview');
	const [isLoading, setIsLoading] = useState(false);

	const [stats, setStats] = useState({
		totalUsers: 0,
		totalProjects: 0,
		totalFunds: 0,
		activeCampaigns: 0,
	});
	const [users, setUsers] = useState([]);
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const usersRes = (await api.get('/utilisateurs')).data;
				const projectsRes = (await api.get('/projets')).data;
				const contributionsRes = (await api.get('/contributions/all')).data;

				setTimeout(() => {
					setStats({
						totalUsers: usersRes.length,
						totalProjects: projectsRes.length,
						totalFunds: contributionsRes.total.split('.')[0],
						activeCampaigns: projectsRes.filter(p => p.statut === 'publie').length,
					});

					setUsers([
						...usersRes.map(u => ({
							id: u.id,
							nom: u.nom,
							prenom: u.prenom,
							email: u.email,
							role: u.role,
							status: 'actif',
						})),
					]);

					setProjects([
						...projectsRes.map(p => ({
							id: encodeId(p.projet_id),
							role: 'porteur de projet',
							titre: p.titre,
							porteur: p.porteur_prenom + ' ' + p.porteur_nom,
							objectif: p.objectif_financier,
							recolte: p.montant_collecte,
							statut: p.statut,
							date_creation: p.date_creation,
						})),
					]);
					setIsLoading(false);
				}, 800);
			} catch (error) {
				console.error('Erreur dashboard:', error);
				setIsLoading(false);
			}
		};

		fetchData();
	}, [userProfil]);

	return (
		<div className="dashboard-admin min-h-screen bg-gray-50 flex">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block">
				<div className="p-6 border-b border-gray-100">
					<a href="/">
						<h1 className="text-2xl font-bold text-green-700 text-center flex items-center justify-center flex-col gap-1">
							<img src={logoNoText} alt="BloomFund Logo" />
							<span className="text-xs text-gray-400 ml-1">ADMIN</span>
						</h1>
					</a>
				</div>
				<nav className="mt-6">
					<SidebarItem id="overview" label="Vue d'ensemble" icon={Icons.Home} currentView={currentView} setCurrentView={setCurrentView} />
					<SidebarItem id="users" label="Utilisateurs" icon={Icons.Users} currentView={currentView} setCurrentView={setCurrentView} />
					<SidebarItem id="projects" label="Projets" icon={Icons.Projects} currentView={currentView} setCurrentView={setCurrentView} />
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 md:ml-64 p-8">
				<header className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-bold text-gray-800">
						{currentView === 'overview' && 'Tableau de bord'}
						{currentView === 'users' && 'Gestion des Utilisateurs'}
						{currentView === 'projects' && 'Gestion des Projets'}
					</h2>
					<div className="flex items-center space-x-4">
						<div className="text-right hidden sm:block">
							<p className="text-sm font-semibold text-gray-700">Administrateur</p>
							<p className="text-xs text-gray-500">{userProfil.nom ? userProfil.userCtx.nom : '' + userProfil.prenom ? userProfil.prenom : ''}</p>
						</div>
						<a href="/profil">
							<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
								{userProfil ? userProfil.userCtx.prenom.charAt(0) + userProfil.userCtx.nom.charAt(0) : '' + userProfil.email}
							</div>
						</a>
					</div>	
				</header>

				{isLoading ? (
					<Loader />
				) : (
					<>
						{/* VUE D'ENSEMBLE */}
						{currentView === 'overview' && (
							<Overview currentView={currentView} setCurrentView={setCurrentView} stats={stats} projects={projects} Icons={Icons} />
						)}

						{/* VUE UTILISATEURS */}
						{currentView === 'users' && <UsersViews users={users} />}

						{/* VUE PROJETS */}
						{currentView === 'projects' && <ProjectsViews projects={projects} />}
					</>
				)}
			</main>
		</div>
	);
}
