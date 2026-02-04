export const SidebarItem = ({ id, label, icon , currentView, setCurrentView }) => (
		<button
			onClick={() => setCurrentView(id)}
			className={`w-full flex items-center space-x-3 px-6 py-4 transition-colors ${
				currentView === id ? 'bg-green-50 text-green-700 border-r-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'
			}`}>
			{icon}
			<span className="font-medium">{label}</span>
		</button>
	);