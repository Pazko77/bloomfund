import React from 'react';

export default function LoginForm({
	formRef,
	handleSubmit,
	showSuccess,
	errors,
	focusedField,
	formData,
	handleChange,
	setFocusedField,
	handleBlur,
	emailRef,
	passwordRef,
	showPassword,
	setShowPassword,
	handleForgotPassword,
	isSubmitting,
}) {
	return (
		<form ref={formRef} className={`login-form ${showSuccess ? 'form-hidden' : ''}`} id="loginForm" onSubmit={handleSubmit} noValidate>
			<div className={`form-group ${errors.email ? 'has-error' : ''}`}>
				<div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''}`}>
					<input
						ref={emailRef}
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
						ref={passwordRef}
						type={showPassword ? 'text' : 'password'}
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						onFocus={() => setFocusedField('password')}
						onBlur={() => handleBlur('password')}
						className={formData.password ? 'has-value' : ''}
						required
						autoComplete="current-password"
					/>
					<label htmlFor="password">Mot de Passe</label>
					<button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
						<span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
					</button>
				</div>
				{errors.password && <span className="error-message show">{errors.password}</span>}
			</div>

			<div className="form-options">
				<label className="remember-wrapper">
					<input type="checkbox" id="remember" name="remember" checked={formData.remember} onChange={handleChange} />
					<span className="checkbox-label">
						<span className="checkmark"></span>
						Souviens-toi de moi
					</span>
				</label>
				<a href="#" className="forgot-password" onClick={handleForgotPassword}>
					Mot de passe oublié ?
				</a>
			</div>

			<button type="submit" className={`login-btn btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
				<span className="btn-text">Se connecter</span>
				<span className="btn-loader"></span>
			</button>
		</form>
	);
}