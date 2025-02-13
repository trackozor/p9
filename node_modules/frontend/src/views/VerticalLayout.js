import WindowIcon from "../assets/svg/window.js"
import MailIcon from "../assets/svg/mail.js"
import DisconnectIcon from "../assets/svg/disconnect.js"
import { ROUTES_PATH } from "../constants/routes.js"

export default (height) => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (typeof user === 'string') {
        user = JSON.parse(user);
    }

    // Récupère le chemin actuel
    const currentPath = window.location.pathname;

    // Vérifie si l'utilisateur est un employé
    if (user && user.type === 'Employee') {
        return `
        <div class='vertical-navbar' style='height: ${height}vh;'>
            <div class='layout-title'> Billed </div>
            <div id='layout-icon1' data-testid="icon-window" class="nav-icon ${currentPath.includes('/bills') ? 'active-icon' : ''}">
                ${WindowIcon}
            </div>
            <div id='layout-icon2' data-testid="icon-mail" class="nav-icon ${currentPath.includes('/messages') ? 'active-icon' : ''}">
                ${MailIcon}
            </div>
            <div id='layout-disconnect' class="nav-icon">
                ${DisconnectIcon}
            </div>
        </div>
        `;
    } else {
        return `
        <div class='vertical-navbar' style='height: ${height}vh;'>
            <div class='layout-title'> Billed </div>
            <div id='layout-disconnect' data-testid='layout-disconnect' class="nav-icon">
                ${DisconnectIcon}
            </div>
        </div>
        `;
    }
};

// Fonction pour attacher les événements après le rendu de la navbar
export const attachNavbarEvents = (onNavigate) => {
  document.getElementById('layout-icon1')?.addEventListener('click', () => {
      onNavigate(ROUTES_PATH.Bills);
  });

  document.getElementById('layout-icon2')?.addEventListener('click', () => {
      onNavigate(ROUTES_PATH.Messages);
  });

  document.getElementById('layout-disconnect')?.addEventListener('click', () => {
      localStorage.clear();
      onNavigate(ROUTES_PATH.Login);
  });
};


