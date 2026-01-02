const defaultImage = 'https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg';

export function parseImages(projet) {
	// Vérifier d'abord le champ images (nouveau format)
	if (projet.images) {
		if (Array.isArray(projet.images)) {
			return projet.images.length > 0 ? projet.images : [defaultImage];
		}
		if (typeof projet.images === 'string') {
			const trimmed = projet.images.trim();
			if (trimmed.startsWith('[')) {
				try {
					const parsed = JSON.parse(trimmed);
					if (Array.isArray(parsed) && parsed.length > 0) {
						return parsed;
					}
				} catch {
					// Continue vers le fallback
				}
			}
			if (trimmed) {
				return [trimmed];
			}
		}
	}

	// Fallback sur image_url
	if (projet.image_url) {
		if (Array.isArray(projet.image_url)) {
			return projet.image_url.length > 0 ? projet.image_url : [defaultImage];
		}
		if (typeof projet.image_url === 'string') {
			const trimmed = projet.image_url.trim();
			if (trimmed.startsWith('[')) {
				try {
					const parsed = JSON.parse(trimmed);
					if (Array.isArray(parsed) && parsed.length > 0) {
						return parsed;
					}
				} catch {
					// Continue vers le fallback
				}
			}
			if (trimmed) {
				return [trimmed];
			}
		}
	}

	return [defaultImage];
}


export	const getFirstImage = image => {
	if (!image) return defaultImage;

	// Si c'est déjà un tableau
	if (Array.isArray(image)) {
		return image[0] || defaultImage;
	}

	// Si c'est une string
	if (typeof image === 'string') {
		// Si c'est un JSON array (commence par [)
		if (image.startsWith('[')) {
			try {
				const parsed = JSON.parse(image);
				return parsed[0] || defaultImage;
			} catch {
				return defaultImage;
			}
		}

		// Si c'est une simple URL
		return image || defaultImage;
	}
	return defaultImage;
};