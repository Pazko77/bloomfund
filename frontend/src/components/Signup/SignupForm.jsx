import React from 'react';

export default function SignupForm({
	formRef,
	showSuccess,
	handleSubmit,
	isSubmitting,
	errors,
	focusedField,
	formData,
	handleChange,
	setFocusedField,
	handleBlur,
	firstNameRef,
	showPassword,
	setShowPassword,
	showConfirmPassword,
	setShowConfirmPassword,
	passwordStrength,
}) {
	// Password strength color and label helper
	const getStrengthInfo = () => {
		const strengths = [
			{ label: 'Très faible', color: '#ef4444' },
			{ label: 'Faible', color: '#f59e0b' },
			{ label: 'Moyen', color: '#eab308' },
			{ label: 'Fort', color: '#22c55e' },
			{ label: 'Très fort', color: '#15A019' },
		];
		return strengths[passwordStrength] || strengths[0];
	};

	return (
		<form ref={formRef} className={`signup-form ${showSuccess ? 'form-hidden' : ''}`} onSubmit={handleSubmit} noValidate>
			<div className="name-row">
				<div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
					<div className={`input-wrapper ${focusedField === 'firstName' ? 'focused' : ''}`}>
						<input
							ref={firstNameRef}
							type="text"
							id="firstName"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							onFocus={() => setFocusedField('firstName')}
							onBlur={() => handleBlur('firstName')}
							className={formData.firstName ? 'has-value' : ''}
							required
							autoComplete="given-name"
						/>
						<label htmlFor="firstName">Prénom</label>
					</div>
					{errors.firstName && <span className="error-message show">{errors.firstName}</span>}
				</div>
				<div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
					<div className={`input-wrapper ${focusedField === 'lastName' ? 'focused' : ''}`}>
						<input
							type="text"
							id="lastName"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							onFocus={() => setFocusedField('lastName')}
							onBlur={() => handleBlur('lastName')}
							className={formData.lastName ? 'has-value' : ''}
							required
							autoComplete="family-name"
						/>
						<label htmlFor="lastName">Nom</label>
					</div>
					{errors.lastName && <span className="error-message show">{errors.lastName}</span>}
				</div>
			</div>
			<div className={`form-group ${errors.email ? 'has-error' : ''}`}>
				<div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''}`}>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						onFocus={() => setFocusedField('email')}
						onBlur={() => handleBlur('email')}
						className={formData.email ? 'has-value' : ''}
						required
						autoComplete="email"
					/>
					<label htmlFor="email">Adresse Mail</label>
				</div>
				{errors.email && <span className="error-message show">{errors.email}</span>}
			</div>
			<div className={`form-group ${errors.password ? 'has-error' : ''}`}>
				<div className={`input-wrapper password-wrapper ${focusedField === 'password' ? 'focused' : ''}`}>
					<input
						type={showPassword ? 'text' : 'password'}
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						onFocus={() => setFocusedField('password')}
						onBlur={() => handleBlur('password')}
						className={formData.password ? 'has-value' : ''}
						required
						autoComplete="new-password"
					/>
					<label htmlFor="password">Mot de Passe</label>
					<button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
						<span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
					</button>
				</div>
				{formData.password && (
					<div className="password-strength">
						<div className="strength-bar">
							<div
								className="strength-fill"
								style={{
									width: `${(passwordStrength / 4) * 100}%`,
									backgroundColor: getStrengthInfo().color,
								}}></div>
						</div>
						<span className="strength-label" style={{ color: getStrengthInfo().color }}>
							{getStrengthInfo().label}
						</span>
					</div>
				)}
				{errors.password && <span className="error-message show">{errors.password}</span>}
			</div>
			<div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
				<div className={`input-wrapper password-wrapper ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
					<input
						type={showConfirmPassword ? 'text' : 'password'}
						id="confirmPassword"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						onFocus={() => setFocusedField('confirmPassword')}
						onBlur={() => handleBlur('confirmPassword')}
						className={formData.confirmPassword ? 'has-value' : ''}
						required
						autoComplete="new-password"
					/>
					<label htmlFor="confirmPassword">Confirmer le Mot de Passe</label>
					<button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle confirm password visibility">
						<span className={`eye-icon ${showConfirmPassword ? 'show-password' : ''}`}></span>
					</button>
				</div>
				{errors.confirmPassword && <span className="error-message show">{errors.confirmPassword}</span>}
			</div>
			<div className={`form-group checkbox-group ${errors.terms ? 'has-error' : ''}`}>
				<label className="terms-wrapper">
					<input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} onBlur={() => handleBlur('terms')} />
					<span className="checkbox-label">
						<span className="checkmark"></span>
						J'accepte les<a href="/terms" onClick={e => e.preventDefault()}>conditions d'utilisation</a>et la
						<a href="/privacy" onClick={e => e.preventDefault()}>politique de confidentialité</a>
					</span>
				</label>
				{errors.terms && <span className="error-message show">{errors.terms}</span>}
			</div>
			<button type="submit" className={`signup-btn btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
				<span className="btn-text">S'inscrire</span>
				<span className="btn-loader"></span>
			</button>
		</form>
	);
}