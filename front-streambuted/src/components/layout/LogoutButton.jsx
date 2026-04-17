export default function LogoutButton({ onLogout }) {
  return (
    <button
      type="button"
      className="logout-btn"
      onClick={onLogout}
      aria-label="Cerrar sesión y volver al inicio de sesión"
      title="Cerrar sesión"
    >
      Cerrar sesión
    </button>
  );
}