const API = 'http://localhost:3000'

//request est la seule fonction qui parle au backend: elle ajoute automatiquement le jeton JWT dans l'en-tete Authorization
export async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(Array.isArray(data.message) ? data.message[0] : data.message || 'Une erreur est survenue')
  }
  return data
}
// saveSession enregistre le jeton et les informations de l'utilisateur dans le localStorage du navigateur pour rester connecte apres un rechargement
export function saveSession({ token, user }) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}
// clearSession les effaces a la deconnexion de l'utilisateur
export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}