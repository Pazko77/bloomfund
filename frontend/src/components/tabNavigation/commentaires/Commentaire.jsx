
import './Commentaire.scss';
import LoginForm from '../../login/LoginForm';

export function Commentaire({ commentaires, isLoggedIn, handleCommentSubmit, commentText, setCommentText, notification, formData, handleChange, handleSubmit, errors, focusedField, setFocusedField, handleBlur, showPassword, setShowPassword, isSubmitting, showSuccess, handleForgotPassword, formRef, emailRef, passwordRef }) {
    return (
			<>
				<div className="space-y-6 w-full">
					<h2 className="text-2xl mb-6">Commentaires</h2>

					{/* Formulaire de connexion pour commenter */}
					<div className="bg-white border border-gray-200 p-8 rounded-lg">
						{notification && <div className={`notification notification-${notification.type}`}>{notification.message}</div>}
						{isLoggedIn ? (
							<>
								<h3 className="text-center text-lg mb-6">laisser un commentaire</h3>
								<form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
									<textarea
										name="comment"
										value={commentText}
										onChange={e => setCommentText(e.target.value)}
										placeholder="Votre commentaire..."
										className="border border-gray-300 rounded-lg p-2 w-full"
										required
									/>
									<button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
										Envoyer
									</button>
								</form>
							</>
						) : (
							<>
								<h3 className="text-center text-lg mb-2">Vous devez être connecté pour</h3>
								<h3 className="text-center text-lg mb-6">laisser un commentaire</h3>
								<p className="text-center text-sm text-gray-600 mb-6">Pour continuer, saisissez votre e-mail ou connectez-vous</p>
								<LoginForm
									formRef={formRef}
									handleSubmit={handleSubmit}
									showSuccess={showSuccess}
									errors={errors}
									focusedField={focusedField}
									formData={formData}
									handleChange={handleChange}
									setFocusedField={setFocusedField}
									handleBlur={handleBlur}
									emailRef={emailRef}
									passwordRef={passwordRef}
									showPassword={showPassword}
									setShowPassword={setShowPassword}
									handleForgotPassword={handleForgotPassword}
									isSubmitting={isSubmitting}
								/>
							</>
						)}
					</div>

					{/* Liste des commentaires */}
					<div className="space-y-6 mt-8">
						{[
							...commentaires,

						].map((comment, index) => (
							<div key={index} className="border-b border-gray-100 pb-6">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold shrink-0 text-sm">
										{comment.avatar}
									</div>
									<div className="flex-1">
										<div className="mb-2">
											<p className="font-semibold text-gray-900">{comment.name}</p>
										</div>
										<p className="text-gray-700 mb-2">{comment.comment}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</>
		);
}