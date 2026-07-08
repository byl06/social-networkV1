// assets/js/app.js - Version complète avec API

// ========== VARIABLES GLOBALES ==========
let currentUser = null;

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});

// ========== GESTION DE L'AUTHENTIFICATION ==========

// Vérifier si l'utilisateur est déjà connecté
async function checkAuthStatus() {
    try {
        const response = await fetch('http://localhost/social-network/api/auth/check.php');
        const data = await response.json();
        
        if (data.logged_in) {
            currentUser = data.user;
            updateUIForLoggedInUser();
            showMainApp();
        } else {
            showAuthPage();
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAuthPage();
    }
}

// Connexion
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (!email || !password) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Veuillez remplir tous les champs';
        return;
    }
    
    errorDiv.style.display = 'none';
    
    try {
        const response = await fetch('http://localhost/social-network/api/auth/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, mot_de_passe: password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            // Stocker en sessionStorage pour le frontend
            sessionStorage.setItem('user', JSON.stringify(currentUser));
            updateUIForLoggedInUser();
            showMainApp();
            showAlert('Connexion réussie ! Bienvenue ' + currentUser.prenom);
        } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = data.error;
        }
    } catch (error) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Erreur de connexion au serveur';
    }
}

// Inscription
// Inscription
// Inscription
// Inscription
// Inscription
async function handleRegister() {
    const prenom = document.getElementById('signupPrenom').value;
    const nom = document.getElementById('signupNom').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const errorDiv = document.getElementById('signupError');
    
    errorDiv.style.display = 'none';
    errorDiv.style.color = '#ff5577';
    
    if (!prenom || !nom || !email || !password || !confirm) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Veuillez remplir tous les champs';
        return;
    }
    
    if (password !== confirm) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Les mots de passe ne correspondent pas';
        return;
    }
    
    if (password.length < 6) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Le mot de passe doit contenir au moins 6 caractères';
        return;
    }
    
    try {
        const response = await fetch('http://localhost/social-network/api/auth/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nom: nom,
                prenom: prenom,
                email: email,
                mot_de_passe: password,
                confirm_mot_de_passe: confirm
            })
        });
        
        const data = await response.json();
        console.log('📧 Réponse inscription:', data);
        
        if (data.success) {
            // Rediriger vers la page de confirmation
            const confirmUrl = `vues/clients/confirm.html?email=${encodeURIComponent(email)}&link=${encodeURIComponent(data.debug_link)}&token=${data.token}`;
            window.location.href = confirmUrl;
        } else {
            errorDiv.style.display = 'block';
            errorDiv.style.color = '#ff5577';
            errorDiv.textContent = data.error || 'Erreur lors de l\'inscription';
        }
    } catch (error) {
        console.error('Erreur:', error);
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#ff5577';
        errorDiv.textContent = 'Erreur de connexion au serveur';
    }
}

// Déconnexion
async function logout() {
    try {
        await fetch('http://localhost/social-network/api/auth/logout.php', {
            method: 'POST'
        });
        sessionStorage.removeItem('user');
        currentUser = null;
        showAuthPage();
        showAlert('Déconnecté avec succès');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Mot de passe oublié
function forgotPassword() {
    showAlert('Fonctionnalité à venir : Réinitialisation par email');
}

// Mettre à jour l'interface avec les infos utilisateur
function updateUIForLoggedInUser() {
    const user = currentUser;
    if (!user) return;
    
    // Mettre à jour la sidebar
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if (sidebarAvatar) {
        if (user.photo_profil && user.photo_profil !== 'default-avatar.png') {
            sidebarAvatar.innerHTML = '';
            sidebarAvatar.style.background = `url('http://localhost/social-network/${user.photo_profil}') center/cover`;
            sidebarAvatar.style.backgroundSize = 'cover';
        } else {
            const initial = (user.prenom ? user.prenom[0] : '') + (user.nom ? user.nom[0] : '');
            sidebarAvatar.innerHTML = initial.toUpperCase() || 'U';
            sidebarAvatar.style.background = 'linear-gradient(135deg,var(--accent),#10d98c)';
        }
    }
    
    document.getElementById('sidebarNom').textContent = `${user.prenom} ${user.nom}`;
    document.getElementById('sidebarEmail').textContent = `@${user.nom.toLowerCase()}`;
    
    // Mettre à jour le profil
    const profileAvatar = document.querySelector('.profile-avatar-wrap .avatar-fallback');
    if (profileAvatar) {
        if (user.photo_profil && user.photo_profil !== 'default-avatar.png') {
            profileAvatar.innerHTML = '';
            profileAvatar.style.background = `url('http://localhost/social-network/${user.photo_profil}') center/cover`;
            profileAvatar.style.backgroundSize = 'cover';
        } else {
            const initial = (user.prenom ? user.prenom[0] : '') + (user.nom ? user.nom[0] : '');
            profileAvatar.innerHTML = initial.toUpperCase();
            profileAvatar.style.background = 'linear-gradient(135deg,var(--accent),#10d98c)';
        }
    }
    
    const profileName = document.querySelector('#profilePage h2');
    if (profileName) {
        profileName.textContent = `${user.prenom} ${user.nom}`;
    }
    
    // 🔥 METTRE À JOUR LE RÉSUMÉ (panneau de droite)
    updateSummaryStats(user.id_user);
}

async function updateSummaryStats(userId) {
    try {
        const response = await fetch(`http://localhost/social-network/api/profile/get_stats.php?user_id=${userId}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            // Mettre à jour les stats du panneau droit
            const statNumbers = document.querySelectorAll('.right-panel .stat-card .stat-num');
            if (statNumbers.length >= 4) {
                // Posts
                statNumbers[0].textContent = data.stats.posts_count;
                // Amis
                statNumbers[1].textContent = data.stats.friends_count;
                // Likes reçus
                statNumbers[2].textContent = data.stats.followers_count;
                // Nouvelles notifications (à implémenter plus tard)
                statNumbers[3].textContent = '0';
            }
        }
    } catch (error) {
        console.error('Erreur updateSummaryStats:', error);
    }
}


// ========== RECHERCHE ==========

// ========== RECHERCHE ==========

async function handleSearch(event) {
    const query = event.target.value.trim();
    
    console.log('🔍 Recherche:', query);
    
    // Si la recherche est vide, recharger les posts
    if (query.length === 0) {
        await loadPosts();
        return;
    }
    
    // Démarrer la recherche après 2 caractères
    if (query.length >= 2) {
        await searchUsers(query);
    }
}

async function searchUsers(query) {
    try {
        console.log('🔍 Recherche de:', query);
        const response = await fetch(`http://localhost/social-network/api/friends/search_users.php?q=${encodeURIComponent(query)}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('📊 Résultats recherche:', data);
        
        if (data.success) {
            displaySearchResults(data.users);
        } else {
            console.error('Erreur recherche:', data.error);
        }
    } catch (error) {
        console.error('Erreur recherche:', error);
        showAlert('Erreur lors de la recherche');
    }
}

function displaySearchResults(users) {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    
    if (users.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px; color:var(--text2);">
                <div style="font-size:48px; margin-bottom:16px;">🔍</div>
                <div style="font-size:18px; font-weight:600;">Aucun utilisateur trouvé</div>
                <div style="font-size:14px; margin-top:8px;">Essayez avec un autre nom</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="margin-bottom:16px; padding:12px; background:rgba(255,255,255,0.04); border-radius:12px; border:1px solid var(--border);">
            <span style="font-weight:600;">${users.length} utilisateur(s) trouvé(s)</span>
        </div>
        ${users.map(user => `
            <div class="friend-card" style="cursor:pointer; animation:fadeUp 0.3s ease;" onclick="viewUserProfile(${user.id_user})">
                ${user.photo_profil && user.photo_profil !== 'default-avatar.png' ? 
                    `<img src="http://localhost/social-network/${user.photo_profil}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;flex-shrink:0;">` :
                    `<div class="avatar-fallback" style="width:50px;height:50px;background:linear-gradient(135deg,var(--accent),#10d98c);font-size:16px;color:white;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:50%;">${getInitials(user.prenom, user.nom)}</div>`
                }
                <div style="flex:1;">
                    <div style="font-weight:600;font-size:15px;">${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</div>
                    <div style="font-size:12.5px;color:var(--text2);margin-top:3px;">${user.bio ? escapeHtml(user.bio.substring(0, 60)) : 'Membre SocialWave'}</div>
                </div>
                <button class="glass-btn primary" style="padding:8px 16px;" onclick="event.stopPropagation(); viewUserProfile(${user.id_user})">
                    Voir profil
                </button>
            </div>
        `).join('')}
    `;
}

// ========== NOTIFICATIONS ==========

// Charger les notifications
async function loadNotifications() {
    try {
        const response = await fetch('http://localhost/social-network/api/notifications/get_notifications.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('📊 Notifications reçues:', data);
        
        if (data.success) {
            displayNotifications(data.notifications);
            updateNotificationBadge(data.unread_count);
        } else {
            console.error('Erreur notifications:', data.error);
        }
    } catch (error) {
        console.error('Erreur loadNotifications:', error);
        document.getElementById('notificationsContainer').innerHTML = `
            <div style="text-align:center; padding:40px; color:var(--danger);">
                Erreur de chargement des notifications
            </div>
        `;
    }
}

// Afficher les notifications
function displayNotifications(notifications) {
    const container = document.getElementById('notificationsContainer');
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:var(--text2);">
                <div style="font-size:48px; margin-bottom:16px;">🔔</div>
                <div style="font-size:18px; font-weight:600;">Aucune notification</div>
                <div style="font-size:14px; margin-top:8px;">Revenez plus tard pour voir vos notifications</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notifications.map(notif => {
        const icon = notif.type === 'friend_request' ? '🤝' : 
                     notif.type === 'like' ? '❤️' : 
                     notif.type === 'comment' ? '💬' : '🔔';
        
        const actionButton = notif.type === 'friend_request' ? `
            <div style="display:flex; gap:8px; margin-top:8px;">
                <button class="glass-btn primary" style="padding:6px 14px; font-size:12px;" onclick="acceptFriendRequest(${notif.id}, this); event.stopPropagation();">
                    Accepter
                </button>
                <button class="glass-btn" style="padding:6px 14px; font-size:12px;" onclick="refuseFriendRequest(${notif.id}, this); event.stopPropagation();">
                    Refuser
                </button>
            </div>
        ` : '';
        
        const clickAction = notif.type === 'like' || notif.type === 'comment' ? 
            `onclick="viewPost(${notif.post_id})"` : 
            `onclick="viewUserProfile(${notif.user_id})"`;
        
        return `
            <div class="notification-item" ${clickAction} style="display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border-bottom:1px solid var(--border); cursor:pointer; transition:background 0.2s; background:rgba(255,255,255,0.02);">
                <div style="font-size:28px;">${icon}</div>
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
                        ${notif.photo_profil && notif.photo_profil !== 'default-avatar.png' ? 
                            `<img src="http://localhost/social-network/${notif.photo_profil}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">` :
                            `<div class="avatar-fallback" style="width:32px;height:32px;font-size:12px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;display:flex;align-items:center;justify-content:center;border-radius:50%;flex-shrink:0;">${getInitials(notif.prenom, notif.nom)}</div>`
                        }
                        <span style="font-weight:500;">${escapeHtml(notif.prenom)} ${escapeHtml(notif.nom)}</span>
                    </div>
                    <div style="color:var(--text); font-size:14px;">${escapeHtml(notif.message)}</div>
                    <div style="color:var(--text2); font-size:12px; margin-top:4px;">${notif.time_ago}</div>
                    ${actionButton}
                </div>
                ${!notif.read ? `<div style="width:8px;height:8px;background:var(--accent);border-radius:50%;flex-shrink:0;margin-top:8px;"></div>` : ''}
            </div>
        `;
    }).join('');
}

// Marquer toutes les notifications comme lues
async function markAllNotificationsRead() {
    try {
        const response = await fetch('http://localhost/social-network/api/notifications/mark_read.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ all: true })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Mettre à jour le badge
            updateNotificationBadge(0);
            showAlert('Toutes les notifications marquées comme lues');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Mettre à jour le badge des notifications dans la sidebar
function updateNotificationBadge(count) {
    const badge = document.querySelector('.nav-item .notif-pill .notif-dot');
    const badgeContainer = document.querySelector('.nav-item .notif-pill');
    
    if (count > 0) {
        if (badge) badge.style.display = 'block';
        // Ajouter un compteur si nécessaire
        let counter = document.querySelector('.nav-item .notif-count');
        if (!counter) {
            const navItem = document.querySelector('.nav-item .notif-pill')?.closest('.nav-item');
            if (navItem) {
                counter = document.createElement('span');
                counter.className = 'nav-badge notif-count';
                counter.style.marginLeft = 'auto';
                navItem.appendChild(counter);
            }
        }
        if (counter) {
            counter.textContent = count;
            counter.style.display = 'inline-block';
        }
    } else {
        if (badge) badge.style.display = 'none';
        const counter = document.querySelector('.nav-item .notif-count');
        if (counter) counter.style.display = 'none';
    }
}

// Voir un post depuis une notification
function viewPost(postId) {
    showPage('feed');
    // Scroll vers le post
    setTimeout(() => {
        const post = document.querySelector(`.post[data-post-id="${postId}"]`);
        if (post) {
            post.scrollIntoView({ behavior: 'smooth', block: 'center' });
            post.style.borderColor = 'var(--accent)';
            setTimeout(() => {
                post.style.borderColor = 'var(--border)';
            }, 3000);
        }
    }, 500);
}


// Mettre à jour tout le panneau droit
async function updateRightPanel() {
    if (!currentUser) return;
    
    const userId = currentUser.id_user;
    
    // 1. Mettre à jour les stats
    try {
        const response = await fetch(`http://localhost/social-network/api/profile/get_stats.php?user_id=${userId}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('summaryPosts').textContent = data.stats.posts_count;
            document.getElementById('summaryFriends').textContent = data.stats.friends_count;
            document.getElementById('summaryLikes').textContent = data.stats.followers_count;
            document.getElementById('summaryNotifs').textContent = '0';
        }
    } catch (error) {
        console.error('Erreur stats right panel:', error);
    }
    
    // 2. Charger les amis en ligne (simulé pour l'instant)
    await loadOnlineFriends();
    
    // 3. Charger les suggestions
    await loadSuggestions();
}

// Charger les amis en ligne
async function loadOnlineFriends() {
    try {
        const response = await fetch('http://localhost/social-network/api/friends/get_friends.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        const container = document.getElementById('onlineFriendsList');
        if (!container) return;
        
        if (data.success && data.friends.length > 0) {
            // Prendre les 5 premiers amis et simuler des statuts en ligne
            const onlineFriends = data.friends.slice(0, 5);
            container.innerHTML = onlineFriends.map((friend, index) => `
                <div class="friend-item" onclick="viewUserProfile(${friend.id_user})" style="cursor:pointer;">
                    ${friend.photo_profil && friend.photo_profil !== 'default-avatar.png' ? 
                        `<img src="http://localhost/social-network/${friend.photo_profil}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">` :
                        `<div class="avatar-fallback" style="width:36px;height:36px;font-size:12px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:50%;">${getInitials(friend.prenom, friend.nom)}</div>`
                    }
                    <span class="online-dot" style="${index % 2 === 0 ? 'background:var(--success);' : 'background:var(--text2);'}"></span>
                    <div class="friend-info">
                        <div class="friend-name">${escapeHtml(friend.prenom)} ${escapeHtml(friend.nom)}</div>
                        <div class="friend-status" style="${index % 2 === 0 ? 'color:var(--success);' : 'color:var(--text2);'}">${index % 2 === 0 ? 'En ligne' : 'Il y a ' + (Math.floor(Math.random() * 30) + 5) + ' min'}</div>
                    </div>
                    <button class="icon-btn" style="width:28px;height:28px;" onclick="event.stopPropagation(); openChatWithFriend(${friend.id_user}, '${escapeHtml(friend.prenom)}', '${escapeHtml(friend.nom)}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </button>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div style="text-align:center; padding:10px; color:var(--text2); font-size:13px;">Aucun ami pour le moment</div>';
        }
    } catch (error) {
        console.error('Erreur loadOnlineFriends:', error);
    }
}

// Charger les suggestions d'amis
async function loadSuggestions() {
    try {
        const response = await fetch('http://localhost/social-network/api/friends/get_users.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        const container = document.getElementById('suggestionsList');
        if (!container) return;
        
        if (data.success && data.users.length > 0) {
            // Prendre les 3 premiers
            const suggestions = data.users.slice(0, 3);
            container.innerHTML = suggestions.map(user => `
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                    ${user.photo_profil && user.photo_profil !== 'default-avatar.png' ? 
                        `<img src="http://localhost/social-network/${user.photo_profil}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;">` :
                        `<div class="avatar-fallback" style="width:36px;height:36px;font-size:12px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:50%;">${getInitials(user.prenom, user.nom)}</div>`
                    }
                    <div style="flex:1;">
                        <div style="font-size:13.5px;font-weight:500;cursor:pointer;" onclick="viewUserProfile(${user.id_user})">${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</div>
                        <div style="font-size:11.5px;color:var(--text2);">${user.bio ? escapeHtml(user.bio.substring(0, 30)) : 'Nouveau membre'}</div>
                    </div>
                    <button class="glass-btn primary" style="padding:5px 12px;font-size:12px;" onclick="event.stopPropagation(); sendFriendRequest(${user.id_user}, this)">
                        + Ajouter
                    </button>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div style="text-align:center; padding:10px; color:var(--text2); font-size:13px;">Aucune suggestion</div>';
        }
    } catch (error) {
        console.error('Erreur loadSuggestions:', error);
    }
}

// ========== MOT DE PASSE OUBLIÉ ==========

// ========== MOT DE PASSE OUBLIÉ ==========

async function handleForgotPassword() {
    const email = document.getElementById('forgotEmail').value.trim();
    const errorDiv = document.getElementById('forgotError');
    const successDiv = document.getElementById('forgotSuccess');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    if (!email) {
        errorDiv.textContent = 'Veuillez entrer votre email';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        errorDiv.textContent = 'Email invalide';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch('http://localhost/social-network/api/auth/forgot_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Afficher le message de succès avec le lien
            successDiv.style.display = 'block';
            successDiv.innerHTML = `
                <strong>✅ ${data.message}</strong>
                <br><br>
                <span style="font-size:12px; color:#8888aa;">Lien de réinitialisation :</span>
                <br>
                <a href="${data.debug_link}" target="_blank" style="color:#7c6fff; word-break:break-all; font-size:12px;">${data.debug_link}</a>
                <br><br>
                <span style="font-size:12px; color:#8888aa;">Ce lien est également envoyé par email.</span>
            `;
            document.getElementById('forgotEmail').value = '';
        } else {
            errorDiv.textContent = data.error || 'Erreur';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur:', error);
        errorDiv.textContent = 'Erreur de connexion au serveur';
        errorDiv.style.display = 'block';
    }
}

function showForgotForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotForm').style.display = 'block';
    
    // Cacher les messages
    document.getElementById('forgotError').style.display = 'none';
    document.getElementById('forgotSuccess').style.display = 'none';
}

// Ouvrir le chat avec un ami depuis le panneau droit
async function openChatWithFriend(friendId, prenom, nom) {
    try {
        const response = await fetch('http://localhost/social-network/api/chat/create_conversation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ receiver_id: friendId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showPage('chat');
            setTimeout(() => {
                openConversation(data.conversation_id, `${prenom} ${nom}`, getInitials(prenom, nom));
            }, 300);
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Ouvrir le chat depuis la topbar
function openChatFromTopbar() {
    // Aller à la page chat
    showPage('chat');
    
    // Ouvrir la première conversation si elle existe
    setTimeout(() => {
        const firstConversation = document.querySelector('.conversation-item');
        if (firstConversation) {
            firstConversation.click();
        } else {
            showAlert('Aucune conversation. Commencez à discuter avec vos amis !');
        }
    }, 300);
}

// ========== AFFICHAGE DES PAGES ==========

function showAuthPage() {
    document.getElementById('authPage').style.display = 'flex';
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('mainArea').style.display = 'none';
}

function showMainApp() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('sidebar').style.display = 'flex';
    document.getElementById('mainArea').style.display = 'flex';
    
    loadPosts();
    loadReceivedRequests();
    loadMyFriends();
    loadDiscoverUsers();
    
    // 🔥 Mettre à jour le panneau droit
    updateRightPanel();
}

// Afficher un onglet d'authentification
function setAuthTab(tab) {
    const tabs = document.querySelectorAll('#authTabs .tab');
    tabs.forEach(t => t.classList.remove('active'));
    
    // Trouver le tab correspondant
    tabs.forEach(t => {
        const text = t.textContent.trim().toLowerCase();
        if ((tab === 'login' && text === 'connexion') || 
            (tab === 'signup' && text === 'inscription') ||
            (tab === 'forgot' && text === 'mot de passe')) {
            t.classList.add('active');
        }
    });
    
    document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
    document.getElementById('forgotForm').style.display = tab === 'forgot' ? 'block' : 'none';
}



function showForgotForm() {
    // Cacher login, afficher forgot
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotForm').style.display = 'block';
    
    // Mettre à jour les tabs
    const tabs = document.querySelectorAll('#authTabs .tab');
    tabs.forEach(t => t.classList.remove('active'));
    // Ajouter un onglet "Mot de passe" si besoin
}

function showPage(name) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(name + 'Page').classList.add('active');
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    const rightPanel = document.getElementById('rightPanel');
    if (rightPanel) {
        if (name !== 'feed') rightPanel.style.display = 'none';
        else rightPanel.style.display = '';
    }
    
    // Gestion du chat
    if (name === 'chat') {
        loadConversations();
    } else {
        if (chatRefreshInterval) {
            clearInterval(chatRefreshInterval);
            chatRefreshInterval = null;
        }
        currentConversationId = null;
    }
    
    // Charger le profil
    if (name === 'profile') {
        loadProfile();
    }
    
    // Charger l'admin
    if (name === 'admin') {
        checkAdminAccess();
    }
    
    // 🔥 Charger les notifications
    if (name === 'notifications') {
        loadNotifications();
    }
}

// ========== FONCTIONS DU FLUX D'ACTUALITÉ ==========

function publishPost() {
    const txt = document.getElementById('newPostText').value.trim();
    if (!txt) { 
        showAlert('✍️ Écrivez quelque chose d\'abord...'); 
        return; 
    }
    
    // TODO: Appeler l'API pour créer un post
    const container = document.getElementById('postsContainer');
    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = `
        <div class="post-header">
            <div class="avatar-fallback" style="width:42px;height:42px;background:linear-gradient(135deg,var(--accent),#10d98c);font-size:14px;color:white;">${currentUser?.prenom?.[0] || 'U'}${currentUser?.nom?.[0] || 'U'}</div>
            <div class="post-meta">
                <div class="post-name">${currentUser?.prenom || 'Utilisateur'} ${currentUser?.nom || ''}</div>
                <div class="post-time">À l'instant · 🌍 Public</div>
            </div>
        </div>
        <div class="post-body"><p class="post-text">${escapeHtml(txt)}</p></div>
        <div class="post-actions">
            <button class="action-btn" onclick="toggleLike(this)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                J'aime
            </button>
            <button class="action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Commenter
            </button>
        </div>
    `;
    container.insertBefore(post, container.firstChild);
    document.getElementById('newPostText').value = '';
    showAlert('🚀 Post publié avec succès !');
}

// ========== FONCTIONS UTILITAIRES ==========

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toggleLike(btn) {
    btn.classList.toggle('liked');
    const svg = btn.querySelector('svg');
    if (btn.classList.contains('liked')) {
        svg.setAttribute('fill', 'currentColor');
    } else {
        svg.setAttribute('fill', 'none');
    }
}

function toggleComments(id) {
    const sec = document.getElementById(id);
    sec.classList.toggle('open');
}

function toggleChat() {
    const chat = document.getElementById('chatOverlay');
    chat.classList.toggle('open');
}

function sendFloatMsg(e) {
    if (e.key !== 'Enter') return;
    const input = document.getElementById('floatChatInput');
    if (!input.value.trim()) return;
    const msgs = document.getElementById('floatChatMsgs');
    const msg = document.createElement('div');
    msg.className = 'msg me';
    msg.textContent = input.value;
    msgs.appendChild(msg);
    msgs.scrollTop = msgs.scrollHeight;
    input.value = '';
}

function setFriendTab(el, tabId) {
    document.querySelectorAll('#friendsPage .tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const requests = document.getElementById('requests');
    const discover = document.getElementById('discover');
    const myfriends = document.getElementById('myfriends');
    
    if (requests) requests.style.display = tabId === 'requests' ? 'block' : 'none';
    if (discover) discover.style.display = tabId === 'discover' ? 'block' : 'none';
    if (myfriends) myfriends.style.display = tabId === 'myfriends' ? 'block' : 'none';
    
    // Charger les données selon l'onglet
    if (tabId === 'discover') {
        loadDiscoverUsers();
    } else if (tabId === 'requests') {
        loadReceivedRequests();
    } else if (tabId === 'myfriends') {
        loadMyFriends();
    }
}

function openConv(el, name, initials, color) {
    document.getElementById('convName').textContent = name;
    const av = document.getElementById('convAvatar');
    av.textContent = initials;
    av.style.background = `linear-gradient(135deg, ${color}99, ${color})`;
}

function showAlert(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
}

// Rendre les fonctions globales
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.forgotPassword = forgotPassword;
window.setAuthTab = setAuthTab;
window.showPage = showPage;
window.publishPost = publishPost;
window.toggleLike = toggleLike;
window.toggleComments = toggleComments;
window.toggleChat = toggleChat;
window.sendFloatMsg = sendFloatMsg;
window.setFriendTab = setFriendTab;
window.openConv = openConv;
window.showAlert = showAlert;
// Ajouter ces lignes à la fin du fichier, avec les autres window.xxx
window.sendFriendRequest = sendFriendRequest;
window.acceptFriendRequest = acceptFriendRequest;
window.refuseFriendRequest = refuseFriendRequest;
window.refreshFriendsData = refreshFriendsData;
window.loadConversations = loadConversations;
window.openConversation = openConversation;
window.sendMessage = sendMessage;
window.startConversationWithFriend = startConversationWithFriend;
// À la fin du fichier, ajoute :
window.checkAdminAccess = checkAdminAccess;
window.updateUserRole = updateUserRole;
window.deleteUser = deleteUser;
window.deleteAdminPost = deleteAdminPost;
window.viewUserProfile = viewUserProfile;
window.showAddModeratorModal = showAddModeratorModal;
window.openImageUploader = openImageUploader;
window.uploadProfileAvatar = uploadProfileAvatar;
window.removeImagePreview = removeImagePreview;
// ========== GESTION DES PUBLICATIONS ==========

// Charger les publications depuis l'API
async function loadPosts() {
    try {
        const response = await fetch('http://localhost/social-network/api/posts/get_posts.php');
        const data = await response.json();
        
        if (data.success) {
            displayPosts(data.posts);
        } else {
            console.error('Erreur:', data.error);
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Erreur de chargement des publications');
    }
}

// Afficher les publications dans le DOM
// Afficher les publications dans le DOM
function displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    
    if (posts.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text2);">Aucune publication pour le moment. Soyez le premier à publier ! ✨</div>';
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="post" data-post-id="${post.id_post}">
            <div class="post-header">
                <div onclick="viewUserProfile(${post.id_user})" style="cursor:pointer;">
                    ${post.photo_profil && post.photo_profil !== 'default-avatar.png' ? 
                        `<img src="http://localhost/social-network/${post.photo_profil}" style="width:42px;height:42px;border-radius:50%;object-fit:cover;">` :
                        `<div class="avatar-fallback" style="width:42px;height:42px;background:linear-gradient(135deg,var(--accent),#10d98c);font-size:14px;color:white;display:flex;align-items:center;justify-content:center;border-radius:50%;">${getInitials(post.prenom, post.nom)}</div>`
                    }
                </div>
                <div class="post-meta">
                    <div class="post-name" onclick="viewUserProfile(${post.id_user})" style="cursor:pointer;">${escapeHtml(post.prenom)} ${escapeHtml(post.nom)}</div>
                    <div class="post-time">${post.date_publication} · 🌍 Public</div>
                </div>
            </div>
            <div class="post-body">
                <p class="post-text">${escapeHtml(post.contenu)}</p>
                ${post.image ? `
                    <div style="margin-top:12px; border-radius:12px; overflow:hidden; background:#0a0a0f; display:flex; justify-content:center; align-items:center; max-height:400px;">
                        <img src="http://localhost/social-network/${post.image}" style="width:100%; max-height:400px; object-fit:contain; display:block;">
                    </div>
                ` : ''}
            </div>
            <div style="padding:10px 18px;display:flex;gap:6px; border-top:1px solid var(--border); margin-top:8px;">
                <span style="background:rgba(255,85,119,0.12);border:1px solid rgba(255,85,119,0.25);color:#ff5577;font-size:12px;padding:3px 10px;border-radius:20px;">❤️ ${post.likes_count}</span>
                <span style="background:rgba(255,255,255,0.06);border:1px solid var(--border);color:var(--text2);font-size:12px;padding:3px 10px;border-radius:20px;">💬 ${post.comments_count} commentaires</span>
            </div>
            <div class="post-actions">
                <button class="action-btn ${post.user_liked ? 'liked' : ''}" onclick="toggleLikePost(${post.id_post}, this)">
                    <svg viewBox="0 0 24 24" fill="${post.user_liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    J'aime
                </button>
                <button class="action-btn" onclick="toggleCommentsSection('comments-${post.id_post}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Commenter
                </button>
            </div>
            <div class="comments-section" id="comments-${post.id_post}" style="display:none;">
                <div class="comments-list" id="comments-list-${post.id_post}">
                    <div style="text-align:center; padding:10px; color:var(--text2);">Chargement des commentaires...</div>
                </div>
                <div class="comment-input-row">
                    ${currentUser?.photo_profil && currentUser?.photo_profil !== 'default-avatar.png' ? 
                        `<img src="http://localhost/social-network/${currentUser.photo_profil}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">` :
                        `<div class="avatar-fallback" style="width:30px;height:30px;font-size:11px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:50%;">${getInitials(currentUser?.prenom, currentUser?.nom)}</div>`
                    }
                    <input class="comment-field" type="text" placeholder="Écrire un commentaire..." id="comment-input-${post.id_post}" onkeypress="handleCommentKeypress(event, ${post.id_post})">
                    <button class="icon-btn" style="width:32px;height:32px;border-radius:50%;" onclick="addComment(${post.id_post})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function viewUserProfile(userId) {
    if (!userId) return;
    
    // Si c'est mon propre profil
    if (currentUser && userId == currentUser.id_user) {
        showPage('profile');
        await loadProfile();
        return;
    }
    
    try {
        const response = await fetch(`http://localhost/social-network/api/profile/get_public_profile.php?user_id=${userId}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            showPublicProfileModal(data.user);
        } else {
            showAlert('Profil non accessible');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Erreur de chargement');
    }
}

function showPublicProfileModal(user) {
    // Supprimer l'ancien modal s'il existe
    const oldModal = document.getElementById('publicProfileModal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'publicProfileModal';
    modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.95); z-index:10000; display:flex; align-items:center; justify-content:center;';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    
    const avatarHtml = (user.photo_profil && user.photo_profil !== 'default-avatar.png') 
        ? `<img src="http://localhost/social-network/${user.photo_profil}" style="width:120px;height:120px;border-radius:50%;object-fit:cover; border:3px solid var(--accent); cursor:pointer;" onclick="event.stopPropagation(); viewFullImage('${user.photo_profil}')">`
        : `<div class="avatar-fallback" style="width:120px;height:120px;margin:0 auto;font-size:48px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;">${getInitials(user.prenom, user.nom)}</div>`;
    
    modal.innerHTML = `
        <div style="background:var(--bg2); border-radius:24px; max-width:500px; width:90%; padding:30px; border:1px solid var(--border); text-align:center; max-height:90vh; overflow-y:auto;">
            <div style="display:flex; justify-content:flex-end; margin-bottom:10px;">
                <button onclick="document.getElementById('publicProfileModal').remove()" style="background:none; border:none; color:white; font-size:28px; cursor:pointer;">&times;</button>
            </div>
            <div style="margin-bottom:20px;">
                ${avatarHtml}
            </div>
            <h2 style="font-family:Sora,sans-serif; margin-bottom:8px;">${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</h2>
            <p style="color:var(--text2); margin-bottom:16px;">Membre depuis ${new Date(user.date_inscription).toLocaleDateString()}</p>
            ${user.bio ? `<p style="margin-bottom:20px; padding:12px; background:rgba(255,255,255,0.05); border-radius:12px;">${escapeHtml(user.bio)}</p>` : '<p style="margin-bottom:20px; color:var(--text2);">Aucune bio</p>'}
            
            <div style="display:flex; gap:20px; justify-content:center; margin-bottom:20px;">
                <div style="text-align:center;">
                    <div style="font-size:20px; font-weight:700;">${user.posts_count || 0}</div>
                    <div style="font-size:12px; color:var(--text2);">Publications</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:20px; font-weight:700;">${user.friends_count || 0}</div>
                    <div style="font-size:12px; color:var(--text2);">Amis</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:20px; font-weight:700;">${user.likes_count || 0}</div>
                    <div style="font-size:12px; color:var(--text2);">Likes reçus</div>
                </div>
            </div>
            
            <div style="display:flex; gap:10px; justify-content:center;">
                <button class="glass-btn primary" onclick="startConversationWithFriend(${user.id_user}, '${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}', '${getInitials(user.prenom, user.nom)}'); document.getElementById('publicProfileModal').remove();">
                    💬 Envoyer un message
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function viewFullImage(imageUrl) {
    if (!imageUrl || imageUrl === 'default-avatar.png') return;
    
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.98); z-index:10001; display:flex; align-items:center; justify-content:center; cursor:pointer;';
    modal.onclick = () => modal.remove();
    modal.innerHTML = `<img src="http://localhost/social-network/${imageUrl}" style="max-width:90%; max-height:90%; object-fit:contain; border-radius:12px;">`;
    document.body.appendChild(modal);
}

function viewFullImage(imageUrl) {
    if (!imageUrl || imageUrl === 'default-avatar.png') return;
    
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.98); z-index:10001; display:flex; align-items:center; justify-content:center; cursor:pointer;';
    modal.onclick = () => modal.remove();
    modal.innerHTML = `<img src="http://localhost/social-network/${imageUrl}" style="max-width:90%; max-height:90%; object-fit:contain; border-radius:12px;">`;
    document.body.appendChild(modal);
}

function showPublicProfile(user) {
    const modal = document.createElement('div');
    modal.id = 'publicProfileModal';
    modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.95); z-index:10000; display:flex; align-items:center; justify-content:center;';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    
    modal.innerHTML = `
        <div style="background:var(--bg2); border-radius:24px; max-width:500px; width:90%; padding:30px; border:1px solid var(--border); text-align:center;">
            <div style="display:flex; justify-content:flex-end; margin-bottom:10px;">
                <button onclick="document.getElementById('publicProfileModal').remove()" style="background:none; border:none; color:white; font-size:28px; cursor:pointer;">&times;</button>
            </div>
            <div style="margin-bottom:20px;">
                ${user.photo_profil ? 
                    `<img src="http://localhost/social-network/${user.photo_profil}" style="width:120px;height:120px;border-radius:50%;object-fit:cover; border:3px solid var(--accent);">` :
                    `<div class="avatar-fallback" style="width:120px;height:120px;margin:0 auto;font-size:48px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;">${getInitials(user.prenom, user.nom)}</div>`
                }
            </div>
            <h2 style="font-family:Sora,sans-serif; margin-bottom:8px;">${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</h2>
            <p style="color:var(--text2); margin-bottom:16px;">Membre depuis ${new Date(user.date_inscription).toLocaleDateString()}</p>
            ${user.bio ? `<p style="margin-bottom:20px; padding:12px; background:rgba(255,255,255,0.05); border-radius:12px;">${escapeHtml(user.bio)}</p>` : '<p style="margin-bottom:20px; color:var(--text2);">Aucune bio</p>'}
            <div style="display:flex; gap:10px; justify-content:center;">
                <button class="glass-btn primary" onclick="startConversationWithFriend(${user.id_user}, '${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}', '${getInitials(user.prenom, user.nom)}'); document.getElementById('publicProfileModal').remove();">
                    💬 Envoyer un message
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showPublicProfile(user) {
    // Créer un modal ou une nouvelle vue pour afficher le profil public
    const modal = document.createElement('div');
    modal.id = 'publicProfileModal';
    modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.9); z-index:1000; display:flex; align-items:center; justify-content:center;';
    modal.innerHTML = `
        <div style="background:var(--bg2); border-radius:24px; max-width:500px; width:90%; padding:24px; border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                <h3 style="font-family:Sora,sans-serif;">Profil</h3>
                <button onclick="this.closest('#publicProfileModal').remove()" style="background:none; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
            </div>
            <div style="text-align:center;">
                ${user.photo_profil ? 
                    `<img src="http://localhost/social-network/${user.photo_profil}" style="width:100px;height:100px;border-radius:50%;object-fit:cover; margin-bottom:16px;">` :
                    `<div class="avatar-fallback" style="width:100px;height:100px;margin:0 auto 16px;font-size:32px;">${getInitials(user.prenom, user.nom)}</div>`
                }
                <h2 style="margin-bottom:8px;">${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</h2>
                <p style="color:var(--text2); margin-bottom:16px;">Membre depuis ${new Date(user.date_inscription).toLocaleDateString()}</p>
                ${user.bio ? `<p style="margin-bottom:20px; padding:12px; background:rgba(255,255,255,0.05); border-radius:12px;">${escapeHtml(user.bio)}</p>` : ''}
                <button class="glass-btn primary" onclick="startConversationWithFriend(${user.id_user}, '${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}', '${getInitials(user.prenom, user.nom)}')">
                    💬 Envoyer un message
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Obtenir les initiales
function getInitials(prenom, nom) {
    return (prenom ? prenom[0] : '') + (nom ? nom[0] : '');
}

// Basculer l'affichage des commentaires
// Basculer l'affichage des commentaires
async function toggleCommentsSection(commentsId) {
    const section = document.getElementById(commentsId);
    if (!section) return;
    
    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block';
        const postId = commentsId.split('-').pop();
        console.log('Chargement commentaires pour post:', postId); // Debug
        await loadComments(postId);
    } else {
        section.style.display = 'none';
    }
}

// Charger les commentaires d'un post
// Charger les commentaires d'un post
async function loadComments(postId) {
    const commentsList = document.getElementById(`comments-list-${postId}`);
    if (!commentsList) {
        console.error('comments-list non trouvé pour:', postId);
        return;
    }
    
    commentsList.innerHTML = '<div style="text-align:center; padding:10px; color:var(--text2);">Chargement...</div>';
    
    try {
        const response = await fetch(`http://localhost/social-network/api/comments/get_comments.php?post_id=${postId}`);
        const data = await response.json();
        
        console.log('Commentaires reçus:', data); // Debug
        
        if (data.success && data.comments.length > 0) {
            commentsList.innerHTML = data.comments.map(comment => `
                <div class="comment">
                    <div class="avatar-fallback" style="width:30px;height:30px;font-size:11px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;flex-shrink:0;">${getInitials(comment.prenom, comment.nom)}</div>
                    <div class="comment-bubble">
                        <div class="comment-author">${escapeHtml(comment.prenom)} ${escapeHtml(comment.nom)}</div>
                        <div class="comment-text">${escapeHtml(comment.contenu)}</div>
                        <div style="font-size:10px; color:var(--text2); margin-top:4px;">${comment.date_commentaire}</div>
                    </div>
                </div>
            `).join('');
        } else {
            commentsList.innerHTML = '<div style="text-align:center; padding:10px; color:var(--text2);">Aucun commentaire. Soyez le premier à commenter ! 💬</div>';
        }
    } catch (error) {
        console.error('Erreur chargement commentaires:', error);
        commentsList.innerHTML = '<div style="text-align:center; padding:10px; color:var(--danger);">Erreur de chargement</div>';
    }
}

// Ajouter un commentaire
// Ajouter un commentaire
// Ajouter un commentaire
async function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const contenu = input.value.trim();
    
    if (!contenu) {
        showAlert('Écrivez un commentaire d\'abord');
        return;
    }
    
    // Désactiver l'input pendant l'envoi
    input.disabled = true;
    
    try {
        const response = await fetch('http://localhost/social-network/api/comments/add_comment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
                post_id: parseInt(postId), 
                contenu: contenu 
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Vider l'input
            input.value = '';
            
            // RÉCUPÉRER LE BON CONTENEUR DES COMMENTAIRES
            const commentsList = document.getElementById(`comments-list-${postId}`);
            console.log('commentsList trouvé:', commentsList); // Debug
            
            if (commentsList) {
                const currentUserInitials = getInitials(currentUser?.prenom, currentUser?.nom);
                const userName = `${currentUser?.prenom || ''} ${currentUser?.nom || ''}`;
                
                // Créer le nouveau commentaire HTML
                const newCommentHtml = `
                    <div class="comment">
                        <div class="avatar-fallback" style="width:30px;height:30px;font-size:11px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;flex-shrink:0;">${currentUserInitials}</div>
                        <div class="comment-bubble">
                            <div class="comment-author">${escapeHtml(userName)}</div>
                            <div class="comment-text">${escapeHtml(contenu)}</div>
                            <div style="font-size:10px; color:var(--text2); margin-top:4px;">À l'instant</div>
                        </div>
                    </div>
                `;
                
                // Si le message "Aucun commentaire" existe, on le remplace
                if (commentsList.innerHTML.includes('Aucun commentaire') || commentsList.innerHTML.includes('Chargement des commentaires')) {
                    commentsList.innerHTML = newCommentHtml;
                } else {
                    // Ajouter à la fin
                    commentsList.insertAdjacentHTML('beforeend', newCommentHtml);
                }
                
                // Faire défiler vers le nouveau commentaire
                const newComment = commentsList.lastElementChild;
                if (newComment) {
                    newComment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else {
                console.error('commentsList non trouvé pour postId:', postId);
                // Recharger les commentaires si le conteneur n'existe pas
                await loadComments(postId);
            }
            
            // Mettre à jour le compteur de commentaires
            updatePostCommentCount(postId, 1);
            
            showAlert('💬 Commentaire publié !');
        } else {
            showAlert(data.error || 'Erreur lors de l\'ajout du commentaire');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Erreur de connexion au serveur');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

// Fonction pour mettre à jour le compteur de commentaires d'un post
function updatePostCommentCount(postId, increment) {
    const postCard = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (postCard) {
        // Chercher le span qui contient le nombre de commentaires
        const commentSpan = postCard.querySelector('span[style*="background:rgba(255,255,255,0.06)"]');
        if (commentSpan) {
            const currentText = commentSpan.innerHTML;
            const currentMatch = currentText.match(/\d+/);
            if (currentMatch) {
                const currentCount = parseInt(currentMatch[0]);
                const newCount = currentCount + increment;
                commentSpan.innerHTML = currentText.replace(/\d+/, newCount);
            }
        }
    }
}

// Gérer l'envoi du commentaire avec Entrée
function handleCommentKeypress(event, postId) {
    if (event.key === 'Enter') {
        addComment(postId);
    }
}

// Liker/Disliker un post
async function toggleLikePost(postId, button) {
    const isLiked = button.classList.contains('liked');
    const action = isLiked ? 'unlike' : 'like';
    
    try {
        const response = await fetch('http://localhost/social-network/api/posts/like_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId, action: action })
        });
        
        const data = await response.json();
        
        if (data.success) {
            if (data.liked) {
                button.classList.add('liked');
                button.querySelector('svg').setAttribute('fill', 'currentColor');
            } else {
                button.classList.remove('liked');
                button.querySelector('svg').setAttribute('fill', 'none');
            }
            
            // Mettre à jour le compteur de likes
            const postCard = button.closest('.post');
            const likeSpan = postCard.querySelector('span[style*="background:rgba(255,85,119"]');
            if (likeSpan) {
                likeSpan.innerHTML = `❤️ ${data.likes_count}`;
            }
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Publier un nouveau post
async function publishPost() {
    const textarea = document.getElementById('newPostText');
    const contenu = textarea.value.trim();
    
    if (!contenu) {
        showAlert('✍️ Écrivez quelque chose d\'abord...');
        return;
    }
    
    try {
        const response = await fetch('http://localhost/social-network/api/posts/create_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contenu: contenu })
        });
        
        const data = await response.json();
        
        if (data.success) {
            textarea.value = '';
            showAlert('🚀 Post publié avec succès !');
            // Recharger les posts
            await loadPosts();
        } else {
            showAlert(data.error || 'Erreur lors de la publication');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
}

// ========== GESTION DES AMIS ==========

// Charger les utilisateurs (pour la section Découvrir)
async function loadDiscoverUsers() {
    try {
        const response = await fetch('http://localhost/social-network/api/friends/get_users.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            displayDiscoverUsers(data.users);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher les utilisateurs à découvrir
function displayDiscoverUsers(users) {
    const discoverContainer = document.getElementById('discover');
    if (!discoverContainer) return;
    
    if (users.length === 0) {
        discoverContainer.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2);">Aucun utilisateur à découvrir pour le moment.</div>';
        return;
    }
    
    discoverContainer.innerHTML = users.map(user => `
        <div class="friend-card" data-user-id="${user.id_user}">
            <div class="avatar-fallback" style="width:50px;height:50px;background:linear-gradient(135deg,var(--accent),#10d98c);font-size:16px;color:white;flex-shrink:0;">${getInitials(user.prenom, user.nom)}</div>
            <div style="flex:1;">
                <div style="font-weight:600;font-size:15px;">${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</div>
                <div style="font-size:12.5px;color:var(--text2);margin-top:3px;">${user.bio ? escapeHtml(user.bio.substring(0, 50)) : 'Nouveau membre'}</div>
            </div>
            <button class="glass-btn primary" style="padding:8px 16px;" onclick="sendFriendRequest(${user.id_user}, this)">
                + Ajouter
            </button>
        </div>
    `).join('');
}

// Envoyer une invitation d'amitié
async function sendFriendRequest(receiverId, button) {
    try {
        const response = await fetch('http://localhost/social-network/api/friends/send_request.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ receiver_id: receiverId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            button.textContent = '✓ Envoyé';
            button.disabled = true;
            button.style.opacity = '0.6';
            showAlert('Invitation envoyée !');
            
            // Recharger les invitations reçues
            loadReceivedRequests();
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Charger les invitations reçues
async function loadReceivedRequests() {
    try {
        const response = await fetch('http://localhost/social-network/api/friends/get_requests.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            displayRequests(data.requests);
            updateFriendRequestBadge(data.requests.length);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher les invitations reçues
function displayRequests(requests) {
    const requestsContainer = document.getElementById('requests');
    if (!requestsContainer) return;
    
    if (requests.length === 0) {
        requestsContainer.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2);">Aucune invitation en attente</div>';
        return;
    }
    
    requestsContainer.innerHTML = requests.map(request => `
        <div class="friend-card" data-request-id="${request.id_request}">
            <div class="avatar-fallback" style="width:50px;height:50px;background:linear-gradient(135deg,var(--accent),#10d98c);font-size:16px;color:white;flex-shrink:0;">${getInitials(request.prenom, request.nom)}</div>
            <div style="flex:1;">
                <div style="font-weight:600;font-size:15px;">${escapeHtml(request.prenom)} ${escapeHtml(request.nom)}</div>
                <div style="font-size:12.5px;color:var(--text2);margin-top:3px;">Demande d'amitié</div>
            </div>
            <div style="display:flex;gap:8px;">
                <button class="glass-btn primary" style="padding:8px 16px;" onclick="acceptFriendRequest(${request.id_request}, this)">
                    Accepter
                </button>
                <button class="glass-btn" style="padding:8px 16px;" onclick="refuseFriendRequest(${request.id_request}, this)">
                    Refuser
                </button>
            </div>
        </div>
    `).join('');
}

// Accepter une invitation
async function acceptFriendRequest(requestId, button) {
    try {
        const response = await fetch('http://localhost/social-network/api/friends/accept_request.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ request_id: requestId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Supprimer la carte de la demande
            const card = button.closest('.friend-card');
            card.remove();
            showAlert('Invitation acceptée !');
            
            // Recharger la liste des amis et les utilisateurs à découvrir
            loadMyFriends();
            loadDiscoverUsers();
            updateFriendRequestBadge(-1);
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Refuser une invitation
async function refuseFriendRequest(requestId, button) {
    try {
        const response = await fetch('http://localhost/social-network/api/friends/refuse_request.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ request_id: requestId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const card = button.closest('.friend-card');
            card.remove();
            showAlert('Invitation refusée');
            updateFriendRequestBadge(-1);
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Charger mes amis
async function loadMyFriends() {
    try {
        const response = await fetch('http://localhost/social-network/api/friends/get_friends.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            displayMyFriends(data.friends);
            updateFriendsCount(data.friends.length);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher mes amis
// Afficher mes amis
function displayMyFriends(friends) {
    const friendsContainer = document.getElementById('myfriends');
    if (!friendsContainer) return;
    
    if (friends.length === 0) {
        friendsContainer.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2);">Vous n\'avez pas encore d\'amis. Ajoutez-en !</div>';
        return;
    }
    
    friendsContainer.innerHTML = friends.map(friend => `
        <div class="friend-card" data-user-id="${friend.id_user}">
            <div class="avatar-fallback" style="width:50px;height:50px;background:linear-gradient(135deg,var(--accent),#10d98c);font-size:16px;color:white;flex-shrink:0;">${getInitials(friend.prenom, friend.nom)}</div>
            <div style="flex:1;">
                <div style="font-weight:600;font-size:15px;">${escapeHtml(friend.prenom)} ${escapeHtml(friend.nom)}</div>
                <div style="font-size:12.5px;color:var(--text2);margin-top:3px;">Ami depuis le ${new Date(friend.date_friendship).toLocaleDateString()}</div>
            </div>
            <button class="glass-btn primary" style="padding:8px 16px;" onclick="messageFriend(${friend.id_user}, '${escapeHtml(friend.nom)}', '${escapeHtml(friend.prenom)}', '${getInitials(friend.prenom, friend.nom)}')">
                💬 Message
            </button>
        </div>
    `).join('');
}

// Mettre à jour le badge des invitations
function updateFriendRequestBadge(count) {
    const badge = document.querySelector('.nav-item[onclick="showPage(\'friends\')"] .nav-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Mettre à jour le compteur d'amis dans le panel latéral
function updateFriendsCount(count) {
    const statCard = document.querySelector('.right-panel .stat-card:nth-child(2) .stat-num');
    if (statCard) {
        statCard.textContent = count;
    }
}

// Rafraîchir toutes les données des amis
function refreshFriendsData() {
    loadDiscoverUsers();
    loadReceivedRequests();
    loadMyFriends();
}

// ========== GESTION DU PROFIL ==========

// Charger les informations du profil
// Charger les informations du profil
async function loadProfile() {
    try {
        const response = await fetch('http://localhost/social-network/api/profile/get_profile.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            const user = data.user;
            
            // Remplir les champs du formulaire
            const prenomInput = document.querySelector('#profilePage input[placeholder="Prénom"]');
            const nomInput = document.querySelector('#profilePage input[placeholder="Nom"]');
            const bioInput = document.querySelector('#profilePage input[placeholder="Bio..."]');
            const emailInput = document.querySelector('#profilePage input[type="email"]');
            
            if (prenomInput) prenomInput.value = user.prenom;
            if (nomInput) nomInput.value = user.nom;
            if (bioInput) bioInput.value = user.bio || '';
            if (emailInput) emailInput.value = user.email;
            
            // Mettre à jour le nom
            const profileName = document.querySelector('#profilePage h2');
            if (profileName) profileName.textContent = `${user.prenom} ${user.nom}`;
            
            // Mettre à jour la photo
            const profileAvatar = document.getElementById('profilePageAvatar');
            if (profileAvatar) {
                if (user.photo_profil && user.photo_profil !== 'default-avatar.png') {
                    profileAvatar.style.backgroundImage = `url('http://localhost/social-network/${user.photo_profil}')`;
                    profileAvatar.style.backgroundSize = 'cover';
                    profileAvatar.style.backgroundPosition = 'center';
                    profileAvatar.innerHTML = '';
                } else {
                    const initial = (user.prenom ? user.prenom[0] : '') + (user.nom ? user.nom[0] : '');
                    profileAvatar.innerHTML = initial.toUpperCase();
                    profileAvatar.style.backgroundImage = 'linear-gradient(135deg,var(--accent),#10d98c)';
                }
            }
            
            // Charger les stats réelles
            await loadProfileStats(user.id_user);
        }
    } catch (error) {
        console.error('Erreur loadProfile:', error);
    }
}

async function loadProfileStats(userId) {
    try {
        const response = await fetch(`http://localhost/social-network/api/profile/get_stats.php?user_id=${userId}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            // Trouver les éléments des stats dans la page profil
            const statValues = document.querySelectorAll('#profilePage .profile-info-card > div > div > div:first-child');
            if (statValues.length >= 3) {
                statValues[0].textContent = data.stats.posts_count;
                statValues[1].textContent = data.stats.friends_count;
                statValues[2].textContent = data.stats.followers_count;
            }
        }
    } catch (error) {
        console.error('Erreur stats:', error);
    }
}

// Afficher le profil dans le formulaire
function displayProfile(user) {
    // Remplir les champs du formulaire
    const prenomInput = document.querySelector('#profilePage input[placeholder="Prénom"]');
    const nomInput = document.querySelector('#profilePage input[placeholder="Nom"]');
    const bioInput = document.querySelector('#profilePage input[placeholder="Bio..."]');
    const emailInput = document.querySelector('#profilePage input[type="email"]');
    const localisationInput = document.querySelector('#profilePage input[placeholder="Localisation"]');
    
    if (prenomInput) prenomInput.value = user.prenom;
    if (nomInput) nomInput.value = user.nom;
    if (bioInput) bioInput.value = user.bio || '';
    if (emailInput) emailInput.value = user.email;
    if (localisationInput) localisationInput.value = user.localisation || 'Cotonou, Bénin';
    
    // Mettre à jour le nom
    const profileName = document.querySelector('#profilePage h2');
    if (profileName) profileName.textContent = `${user.prenom} ${user.nom}`;
    
    // Mettre à jour l'avatar
    const profileAvatar = document.getElementById('profilePageAvatar');
    if (profileAvatar) {
        if (user.photo_profil && user.photo_profil !== 'default-avatar.png') {
            profileAvatar.style.backgroundImage = `url('http://localhost/social-network/${user.photo_profil}')`;
            profileAvatar.style.backgroundSize = 'cover';
            profileAvatar.style.backgroundPosition = 'center';
            profileAvatar.innerHTML = '';
        } else {
            const initial = (user.prenom ? user.prenom[0] : '') + (user.nom ? user.nom[0] : '');
            profileAvatar.innerHTML = initial.toUpperCase();
            profileAvatar.style.backgroundImage = 'linear-gradient(135deg,var(--accent),#10d98c)';
        }
    }
    
    // 🔥 CHARGER LES VRAIES STATISTIQUES
    loadProfileStats(user.id_user);
}

async function loadProfileStats(userId) {
    try {
        const response = await fetch(`http://localhost/social-network/api/profile/get_stats.php?user_id=${userId}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('📊 Stats profil reçues:', data);
        
        if (data.success) {
            // Chercher les 3 cartes de statistiques dans la page profil
            const statCards = document.querySelectorAll('#profilePage .profile-info-card > div > div');
            
            if (statCards.length >= 3) {
                // Carte 1: Publications
                const postDiv = statCards[0].querySelector('div:first-child');
                if (postDiv) postDiv.textContent = data.stats.posts_count;
                
                // Carte 2: Amis
                const friendsDiv = statCards[1].querySelector('div:first-child');
                if (friendsDiv) friendsDiv.textContent = data.stats.friends_count;
                
                // Carte 3: Abonnés (likes reçus)
                const likesDiv = statCards[2].querySelector('div:first-child');
                if (likesDiv) likesDiv.textContent = data.stats.followers_count;
            }
        }
    } catch (error) {
        console.error('Erreur loadProfileStats:', error);
    }
}

// Afficher le profil dans le formulaire


// Mettre à jour le profil
async function updateProfile() {
    const prenom = document.querySelector('#profilePage .form-input[value="Koffi"]')?.value;
    const nom = document.querySelector('#profilePage .form-input[value="Agban"]')?.value;
    const bio = document.querySelector('#profilePage .form-input[placeholder="Bio..."]')?.value;
    const email = document.querySelector('#profilePage .form-input[type="email"]')?.value;
    
    try {
        const response = await fetch('http://localhost/social-network/api/profile/update_profile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ prenom, nom, bio, email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Profil mis à jour !');
            // Mettre à jour l'interface
            if (currentUser) {
                currentUser.prenom = prenom;
                currentUser.nom = nom;
                currentUser.email = email;
                currentUser.bio = bio;
                updateUIForLoggedInUser();
            }
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Changer le mot de passe
async function updatePassword() {
    const current = document.querySelector('#profilePage input[placeholder="••••••••"]')?.value;
    const inputs = document.querySelectorAll('#profilePage input[placeholder="••••••••"]');
    const nouveau = inputs[1]?.value;
    const confirm = inputs[2]?.value;
    
    if (!current || !nouveau || !confirm) {
        showAlert('Veuillez remplir tous les champs');
        return;
    }
    
    if (nouveau !== confirm) {
        showAlert('Les nouveaux mots de passe ne correspondent pas');
        return;
    }
    
    if (nouveau.length < 6) {
        showAlert('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    try {
        const response = await fetch('http://localhost/social-network/api/profile/update_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
                current_password: current, 
                new_password: nouveau, 
                confirm_password: confirm 
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Mot de passe mis à jour !');
            // Vider les champs
            inputs.forEach(input => input.value = '');
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// ========== GESTION DU CHAT ==========

let currentConversationId = null;
let chatRefreshInterval = null;

// Charger les conversations
async function loadConversations() {
    try {
        const response = await fetch('http://localhost/social-network/api/chat/get_conversations.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            displayConversations(data.conversations);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher les conversations dans la sidebar
// Afficher les conversations dans la sidebar du chat
function displayConversations(conversations) {
    const container = document.getElementById('sidebarConversations');
    if (!container) {
        console.log('Container sidebarConversations non trouvé');
        return;
    }
    
    if (!conversations || conversations.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2);">Aucune conversation. Cliquez sur "Message" depuis la liste de vos amis !</div>';
        return;
    }
    
    container.innerHTML = conversations.map(conv => `
        <div class="conversation-item" onclick="openConversation(${conv.id_conversation}, '${escapeHtml(conv.other_prenom)} ${escapeHtml(conv.other_nom)}', '${getInitials(conv.other_prenom, conv.other_nom)}')" style="display:flex; gap:10px; padding:12px 14px; cursor:pointer; border-left:3px solid ${currentConversationId === conv.id_conversation ? 'var(--accent)' : 'transparent'}; background:${currentConversationId === conv.id_conversation ? 'rgba(124,111,255,0.08)' : 'transparent'}; transition:background 0.18s;">
            <div class="avatar-fallback" style="width:40px;height:40px;background:linear-gradient(135deg,var(--accent),#10d98c);font-size:13px;color:white;flex-shrink:0;">${getInitials(conv.other_prenom, conv.other_nom)}</div>
            <div style="flex:1; overflow:hidden;">
                <div style="display:flex; justify-content:space-between;">
                    <span style="font-weight:600; font-size:14px;">${escapeHtml(conv.other_prenom)} ${escapeHtml(conv.other_nom)}</span>
                    <span style="font-size:11px; color:var(--text2);">${conv.last_message_time ? formatDate(conv.last_message_time) : ''}</span>
                </div>
                <div style="font-size:12.5px; color:var(--text2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${conv.last_message ? escapeHtml(conv.last_message.substring(0, 50)) : 'Nouvelle conversation'}</div>
            </div>
            ${conv.unread_count > 0 ? `<span style="background:var(--accent);color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;align-self:center;flex-shrink:0;">${conv.unread_count}</span>` : ''}
        </div>
    `).join('');
}

// Ouvrir une conversation
async function openConversation(conversationId, userName, userInitials) {
    currentConversationId = conversationId;
    
    // Mettre à jour l'en-tête
    document.getElementById('convName').textContent = userName;
    const avatar = document.getElementById('convAvatar');
    avatar.textContent = userInitials;
    
    // Recharger la liste des conversations pour mettre à jour le style
    loadConversations();
    
    // Charger les messages
    await loadMessages(conversationId);
    
    // Démarrer le rafraîchissement automatique (toutes les 3 secondes)
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
    }
    chatRefreshInterval = setInterval(() => {
        if (currentConversationId) {
            loadMessages(currentConversationId, true);
        }
    }, 3000);
}

// Charger les messages d'une conversation
async function loadMessages(conversationId, isAutoRefresh = false) {
    try {
        const response = await fetch(`http://localhost/social-network/api/chat/get_messages.php?conversation_id=${conversationId}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            displayMessages(data.messages, isAutoRefresh);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher les messages
function displayMessages(messages, isAutoRefresh = false) {
    const container = document.getElementById('convMessages');
    if (!container) return;
    
    const wasAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    
    if (!isAutoRefresh) {
        container.innerHTML = '';
    }
    
    if (messages.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2);">Aucun message</div>';
        return;
    }
    
    const currentUserId = currentUser?.id_user;
    
    const messagesHtml = messages.map(msg => `
        <div class="msg ${msg.id_sender === currentUserId ? 'me' : 'them'}" 
             style="align-self:${msg.id_sender === currentUserId ? 'flex-end' : 'flex-start'}; 
                    max-width:75%; 
                    ${msg.id_sender === currentUserId ? 
                        'background:rgba(124,111,255,0.3); border:1px solid rgba(124,111,255,0.4); border-radius:16px 4px 16px 16px; color:#d4cfff;' : 
                        'background:rgba(255,255,255,0.08); border-radius:4px 16px 16px 16px;'
                    } 
                    padding:10px 14px; margin-bottom:8px; font-size:13.5px;">
            ${msg.id_sender !== currentUserId ? 
                `<div style="font-size:11px; color:var(--accent2); margin-bottom:4px;">${escapeHtml(msg.prenom)} ${escapeHtml(msg.nom)}</div>` : ''
            }
            ${msg.contenu ? `<div>${escapeHtml(msg.contenu)}</div>` : ''}
            ${msg.image ? `
                <div style="margin-top:8px; border-radius:8px; overflow:hidden; max-width:200px;">
                    <img src="http://localhost/social-network/${msg.image}" 
                         style="width:100%; max-height:200px; object-fit:cover; border-radius:8px; cursor:pointer;" 
                         onclick="viewFullImage('${msg.image}')">
                </div>
            ` : ''}
            <div style="font-size:10px; color:var(--text2); margin-top:4px; text-align:right;">
                ${formatTime(msg.date_envoi)}
            </div>
        </div>
    `).join('');
    
    if (isAutoRefresh) {
        container.innerHTML = messagesHtml;
    } else {
        container.innerHTML = messagesHtml;
    }
    
    if (wasAtBottom || !isAutoRefresh) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

// Envoyer un message
async function sendMessage() {
    const input = document.getElementById('chatInlineInput');
    const contenu = input.value.trim();
    
    if (!contenu && !currentConversationId) {
        return;
    }
    
    // Si pas de conversation, créer une nouvelle (pour un ami sélectionné)
    if (!currentConversationId) {
        // Ici tu peux implémenter la sélection d'un ami
        showAlert('Sélectionnez une conversation ou un ami');
        return;
    }
    
    input.disabled = true;
    
    try {
        const response = await fetch('http://localhost/social-network/api/chat/send_message.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                conversation_id: currentConversationId,
                contenu: contenu
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            input.value = '';
            // Recharger les messages
            await loadMessages(currentConversationId);
            // Recharger les conversations pour mettre à jour le dernier message
            loadConversations();
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

// Démarrer une conversation avec un ami
async function startConversationWithFriend(friendId, friendName, friendInitials) {
    try {
        const response = await fetch('http://localhost/social-network/api/chat/create_conversation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ receiver_id: friendId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await openConversation(data.conversation_id, friendName, friendInitials);
            loadConversations();
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Formater la date pour les messages
function formatTime(datetime) {
    const date = new Date(datetime);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return `${date.getDate()}/${date.getMonth() + 1}`;
}

function formatDate(datetime) {
    if (!datetime) return '';
    const date = new Date(datetime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (msgDate.getTime() === today.getTime()) {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
        return `${date.getDate()}/${date.getMonth() + 1}`;
    }
}

// Nettoyer l'intervalle du chat lors du changement de page
function stopChatRefresh() {
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
        chatRefreshInterval = null;
    }
}

// Démarrer une conversation avec un ami depuis la page Amis
async function messageFriend(friendId, friendName, friendPrenom, friendInitials) {
    try {
        const response = await fetch('http://localhost/social-network/api/chat/create_conversation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ receiver_id: friendId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Changer vers la page chat
            showPage('chat');
            
            // Ouvrir la conversation
            setTimeout(() => {
                openConversation(data.conversation_id, `${friendPrenom} ${friendName}`, getInitials(friendPrenom, friendName));
            }, 100);
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Erreur de connexion');
    }
}

// Rechercher des amis pour démarrer une conversation
async function searchFriendsForChat() {
    const searchTerm = document.getElementById('searchFriendInput')?.value;
    
    try {
        const response = await fetch(`http://localhost/social-network/api/friends/get_friends.php`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            let friends = data.friends;
            if (searchTerm) {
                friends = friends.filter(f => 
                    f.prenom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    f.nom.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            displayFriendsForChat(friends);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher les amis pour le chat
function displayFriendsForChat(friends) {
    const container = document.getElementById('friendsForChat');
    if (!container) return;
    
    if (friends.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2);">Aucun ami trouvé</div>';
        return;
    }
    
    container.innerHTML = friends.map(friend => `
        <div class="friend-item" style="padding:10px; cursor:pointer;" onclick="startConversationWithFriend(${friend.id_user}, '${escapeHtml(friend.prenom)} ${escapeHtml(friend.nom)}', '${getInitials(friend.prenom, friend.nom)}')">
            <div class="avatar-fallback" style="width:40px;height:40px;background:linear-gradient(135deg,var(--accent),#10d98c);font-size:14px;color:white;flex-shrink:0;">${getInitials(friend.prenom, friend.nom)}</div>
            <div style="flex:1;">
                <div style="font-weight:600;">${escapeHtml(friend.prenom)} ${escapeHtml(friend.nom)}</div>
                <div style="font-size:12px; color:var(--text2);">Cliquez pour discuter</div>
            </div>
        </div>
    `).join('');
}

// Démarrer une conversation avec un ami
async function startConversationWithFriend(friendId, friendName, friendInitials) {
    try {
        const response = await fetch('http://localhost/social-network/api/chat/create_conversation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ receiver_id: friendId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await openConversation(data.conversation_id, friendName, friendInitials);
            loadConversations();
            // Fermer le modal si ouvert
            const modal = document.getElementById('newChatModal');
            if (modal) modal.style.display = 'none';
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Erreur de connexion');
    }
}
// ========== BACK OFFICE (ADMIN) ==========

let currentAdminRole = null;

// Vérifier les droits admin et charger le dashboard
// Vérifier les droits admin et charger le dashboard
async function checkAdminAccess() {
    try {
        console.log('🔍 Vérification des droits admin...');
        const response = await fetch('http://localhost/social-network/api/admin/check_admin.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('📊 Réponse checkAdminAccess:', data);
        
        if (data.success) {
            currentAdminRole = data.role;
            const badge = document.getElementById('adminRoleBadge');
            if (badge) badge.textContent = data.role;
            
            // Afficher/masquer les fonctionnalités admin
            const isAdmin = data.is_admin;
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = isAdmin ? 'inline-flex' : 'none';
            });
            
            // Charger les données
            await loadAdminStats();
            await loadAdminUsers();
            await loadAdminPosts();
        } else {
            console.error('❌ Accès admin refusé:', data.error);
            showAlert('Accès non autorisé à l\'administration');
            showPage('feed');
        }
    } catch (error) {
        console.error('❌ Erreur checkAdminAccess:', error);
        showAlert('Erreur de chargement de l\'administration');
    }
}



// Charger les statistiques
// Charger les statistiques admin
async function loadAdminStats() {
    try {
        console.log('🔍 Chargement des stats admin...');
        const response = await fetch('http://localhost/social-network/api/admin/get_stats.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('📊 Stats admin reçues:', data);
        
        if (data.success) {
            const statUsers = document.getElementById('statUsers');
            const statPosts = document.getElementById('statPosts');
            const statComments = document.getElementById('statComments');
            const statLikes = document.getElementById('statLikes');
            
            if (statUsers) statUsers.textContent = data.stats.total_users || 0;
            if (statPosts) statPosts.textContent = data.stats.total_posts || 0;
            if (statComments) statComments.textContent = data.stats.total_comments || 0;
            if (statLikes) statLikes.textContent = data.stats.total_likes || 0;
        } else {
            console.error('❌ Erreur stats admin:', data.error);
        }
    } catch (error) {
        console.error('❌ Erreur loadAdminStats:', error);
    }
}

// Afficher les statistiques
// Afficher les statistiques
function displayAdminStats(stats) {
    // Mettre à jour les cartes du dashboard
    const statCards = document.querySelectorAll('#adminPage .dash-card');
    
    if (statCards.length >= 4) {
        // Carte 1: Utilisateurs
        const userNum = statCards[0].querySelector('.dash-num');
        if (userNum) userNum.textContent = stats.total_users.toLocaleString();
        
        // Carte 2: Publications
        const postNum = statCards[1].querySelector('.dash-num');
        if (postNum) postNum.textContent = stats.total_posts.toLocaleString();
        
        // Carte 3: Commentaires (à la place des signalements)
        const commentNum = statCards[2].querySelector('.dash-num');
        if (commentNum) commentNum.textContent = stats.total_comments.toLocaleString();
        
        // Carte 4: Likes
        const likeNum = statCards[3].querySelector('.dash-num');
        if (likeNum) likeNum.textContent = stats.total_likes.toLocaleString();
    }
    
    // Mettre à jour les labels si besoin
    const statLabels = document.querySelectorAll('#adminPage .dash-label');
    if (statLabels.length >= 4) {
        statLabels[0].textContent = 'Utilisateurs inscrits';
        statLabels[1].textContent = 'Publications';
        statLabels[2].textContent = 'Commentaires';
        statLabels[3].textContent = 'Likes';
    }
}

// Charger les utilisateurs pour l'admin
async function loadAdminUsers() {
    try {
        console.log('🔍 Chargement des utilisateurs admin...');
        const response = await fetch('http://localhost/social-network/api/admin/get_users.php', {
            credentials: 'include'
        });
        
        console.log('📊 Statut HTTP:', response.status);
        const text = await response.text();
        console.log('📊 Réponse brute:', text.substring(0, 200));
        
        let data;
        try {
            data = JSON.parse(text);
        } catch(e) {
            console.error('❌ Erreur parsing JSON:', e);
            showAlert('❌ Erreur de chargement des utilisateurs');
            return;
        }
        
        if (data.success) {
            displayAdminUsers(data.users, data.is_admin);
        } else {
            console.error('❌ Erreur chargement utilisateurs:', data.error);
            showAlert('❌ ' + (data.error || 'Erreur inconnue'));
        }
    } catch (error) {
        console.error('❌ Erreur loadAdminUsers:', error);
        showAlert('❌ Erreur de chargement des utilisateurs');
    }
}

// Afficher les utilisateurs dans le tableau admin
function displayAdminUsers(users, isAdmin) {
    const tbody = document.getElementById('adminUsersTable');
    if (!tbody) return;
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Aucun utilisateur</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr style="border-top:1px solid var(--border);">
            <td style="padding:13px 20px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div class="avatar-fallback" style="width:32px;height:32px;font-size:11px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;">${getInitials(user.prenom, user.nom)}</div>
                    <div>
                        <div style="font-size:14px; font-weight:500;">${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</div>
                        <div style="font-size:12px; color:var(--text2);">${escapeHtml(user.email)}</div>
                    </div>
                </div>
            </td>
            <td style="padding:13px 20px;">
    ${isAdmin ? `
        <select class="form-input" style="padding:5px 10px; font-size:12px; width:130px;" onchange="updateUserRole(${user.id_user}, this.value)">
            <option value="Utilisateur" ${user.role === 'Utilisateur' ? 'selected' : ''}>👤 Utilisateur</option>
            <option value="Modérateur" ${user.role === 'Modérateur' ? 'selected' : ''}>🛡️ Modérateur</option>
            <option value="Administrateur" ${user.role === 'Administrateur' ? 'selected' : ''}>👑 Administrateur</option>
        </select>
    ` : `<span class="badge">${user.role}</span>`}
</td>
            <td style="padding:13px 20px;">
                <span class="badge badge-green">${user.statut}</span>
            </td>
            <td style="padding:13px 20px; font-size:13px; color:var(--text2);">${new Date(user.date_inscription).toLocaleDateString()}</td>
            <td style="padding:13px 20px;">
                <div style="display:flex; gap:6px;">
                    <button class="glass-btn" style="padding:5px 12px; font-size:12px;" onclick="viewUserProfile(${user.id_user})">Voir</button>
                    <button class="glass-btn" style="padding:5px 12px; font-size:12px; border-color:rgba(255,85,119,0.3); color:#ff5577;" onclick="deleteUser(${user.id_user})">Supprimer</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Mettre à jour le rôle d'un utilisateur
// Mettre à jour le rôle d'un utilisateur
// Mettre à jour le rôle d'un utilisateur
async function updateUserRole(userId, newRole) {
    try {
        console.log('📤 Mise à jour du rôle:', userId, '->', newRole);
        
        const response = await fetch('http://localhost/social-network/api/admin/update_user_role.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_id: userId, role: newRole })
        });
        
        const data = await response.json();
        console.log('📊 Réponse reçue:', data);
        
        if (data.success) {
            showAlert('✅ ' + data.message);
            // Recharger la liste des utilisateurs
            await loadAdminUsers();
            return true;
        } else {
            showAlert('❌ ' + (data.error || 'Erreur inconnue'));
            return false;
        }
    } catch (error) {
        console.error('❌ Erreur updateUserRole:', error);
        showAlert('❌ Erreur de connexion au serveur');
        return false;
    }
}

// Supprimer un utilisateur
async function deleteUser(userId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
        const response = await fetch('http://localhost/social-network/api/admin/delete_user.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_id: userId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Utilisateur supprimé');
            // Recharger toutes les données
            await loadAdminStats();
            await loadAdminUsers();
            await loadPosts(); // Recharger le flux aussi
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Charger les publications pour l'admin
// Charger les publications pour l'admin
async function loadAdminPosts() {
    try {
        console.log('🔍 Chargement des publications admin...');
        const response = await fetch('http://localhost/social-network/api/admin/get_posts.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('📊 Publications admin reçues:', data);
        
        if (data.success) {
            displayAdminPosts(data.posts);
        } else {
            console.error('❌ Erreur chargement publications:', data.error);
        }
    } catch (error) {
        console.error('❌ Erreur loadAdminPosts:', error);
    }
}
// Afficher les publications dans le tableau admin
function displayAdminPosts(posts) {
    const tbody = document.getElementById('adminPostsTable');
    if (!tbody) return;
    
    if (posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">Aucune publication</td></tr>';
        return;
    }
    
    tbody.innerHTML = posts.map(post => `
        <tr style="border-top:1px solid var(--border);">
            <td style="padding:13px 20px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div class="avatar-fallback" style="width:32px;height:32px;font-size:11px;background:linear-gradient(135deg,var(--accent),#10d98c);color:white;">${getInitials(post.prenom, post.nom)}</div>
                    <div>
                        <div style="font-size:14px; font-weight:500;">${escapeHtml(post.prenom)} ${escapeHtml(post.nom)}</div>
                        <div style="font-size:11px; color:var(--text2);">${new Date(post.date_publication).toLocaleString()}</div>
                    </div>
                </div>
            </td>
            <td style="padding:13px 20px; max-width:300px;">
                <div style="font-size:13px;">${post.contenu ? escapeHtml(post.contenu.substring(0, 100)) : '(Pas de texte)'}</div>
                ${post.image ? '<div style="font-size:11px; color:var(--accent2); margin-top:4px;">📷 Image jointe</div>' : ''}
            </td>
            <td style="padding:13px 20px; text-align:center;">
                <div>❤️ ${post.reactions_count || 0}</div>
                <div style="font-size:11px; color:var(--text2);">💬 ${post.comments_count || 0}</div>
            </td>
            <td style="padding:13px 20px;">
                <button class="glass-btn" style="padding:5px 12px; font-size:12px; border-color:rgba(255,85,119,0.3); color:#ff5577;" onclick="deleteAdminPost(${post.id_post})">
                    Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

// Supprimer une publication (admin)
async function deleteAdminPost(postId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
        return;
    }
    
    try {
        const response = await fetch('http://localhost/social-network/api/admin/delete_post.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ post_id: postId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Publication supprimée');
            loadAdminPosts();
            loadAdminStats();
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Voir le profil d'un utilisateur (admin)
// Fonction principale pour voir le profil d'un utilisateur (depuis le fil d'actualité ou l'admin)
async function viewUserProfile(userId) {
    console.log('viewUserProfile appelé avec userId:', userId);
    
    if (!userId) {
        showAlert('Utilisateur invalide');
        return;
    }
    
    // Vérifier si c'est mon propre profil
    if (currentUser && parseInt(userId) === parseInt(currentUser.id_user)) {
        showPage('profile');
        await loadProfile();
        return;
    }
    
    try {
        const response = await fetch(`http://localhost/social-network/api/profile/get_public_profile.php?user_id=${userId}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('Réponse profil public:', data);
        
        if (data.success) {
            showPublicProfileModal(data.user);
        } else {
            showAlert('Profil non accessible');
        }
    } catch (error) {
        console.error('Erreur viewUserProfile:', error);
        showAlert('Erreur de chargement du profil');
    }
}

// Ajouter un modérateur (admin seulement)
// Ajouter un modérateur (admin seulement)
// Ajouter un modérateur (admin seulement)
// Ajouter un modérateur (admin seulement)
// Ajouter un modérateur (admin seulement)
function showAddModeratorModal() {
    const email = prompt('✏️ Entrez l\'email de l\'utilisateur à promouvoir modérateur :\n(Exemple: fatime@socialwave.com)');
    
    if (!email) {
        showAlert('❌ Opération annulée');
        return;
    }
    
    if (!email.includes('@')) {
        showAlert('❌ Email invalide');
        return;
    }
    
    findUserByEmail(email);
}

async function findUserByEmail(email) {
    try {
        showAlert('🔍 Recherche de l\'utilisateur...');
        
        // Utiliser l'API get_users.php qui est déjà disponible
        const response = await fetch('http://localhost/social-network/api/admin/get_users.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('📊 Utilisateurs:', data);
        
        if (!data.success) {
            showAlert('❌ Erreur de chargement');
            return;
        }
        
        // Chercher l'utilisateur par email
        const user = data.users.find(u => u.email === email);
        
        if (!user) {
            showAlert('❌ Aucun utilisateur trouvé avec l\'email: ' + email);
            return;
        }
        
        // Vérifier le rôle actuel
        if (user.role === 'Modérateur') {
            showAlert('ℹ️ Cet utilisateur est déjà modérateur');
            return;
        }
        
        if (user.role === 'Administrateur') {
            showAlert('ℹ️ Cet utilisateur est déjà administrateur');
            return;
        }
        
        // Demander confirmation
        if (confirm(`✅ Promouvoir ${user.prenom} ${user.nom} (${user.email}) en tant que MODÉRATEUR ?`)) {
            const result = await updateUserRole(user.id_user, 'Modérateur');
            if (result) {
                showAlert(`✅ ${user.prenom} ${user.nom} est maintenant modérateur !`);
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur findUserByEmail:', error);
        showAlert('❌ Erreur de connexion');
    }
}

async function findUserByEmail(email) {
    try {
        showAlert('🔍 Recherche de l\'utilisateur...');
        
        const response = await fetch('http://localhost/social-network/api/admin/get_users.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('📊 Utilisateurs reçus:', data);
        
        if (!data.success) {
            showAlert('❌ ' + (data.error || 'Erreur de chargement'));
            return;
        }
        
        const user = data.users.find(u => u.email === email);
        
        if (!user) {
            showAlert('❌ Utilisateur non trouvé avec l\'email: ' + email);
            return;
        }
        
        if (user.role === 'Modérateur') {
            showAlert('ℹ️ Cet utilisateur est déjà modérateur');
            return;
        }
        
        if (user.role === 'Administrateur') {
            showAlert('ℹ️ Cet utilisateur est déjà administrateur');
            return;
        }
        
        if (confirm(`✅ Promouvoir ${user.prenom} ${user.nom} (${user.email}) en tant que MODÉRATEUR ?`)) {
            // Appeler updateUserRole
            const result = await updateUserRole(user.id_user, 'Modérateur');
            if (result) {
                showAlert(`✅ ${user.prenom} ${user.nom} est maintenant modérateur !`);
                // Recharger la page admin pour voir le changement
                await loadAdminUsers();
            }
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('❌ Erreur de connexion');
    }
}

async function findUserByEmail(email) {
    try {
        showAlert('🔍 Recherche de l\'utilisateur...');
        
        const response = await fetch('http://localhost/social-network/api/admin/get_users.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        console.log('📊 Utilisateurs reçus:', data);
        
        if (!data.success) {
            showAlert('❌ ' + (data.error || 'Erreur de chargement'));
            return;
        }
        
        const user = data.users.find(u => u.email === email);
        
        if (!user) {
            showAlert('❌ Utilisateur non trouvé avec l\'email: ' + email);
            return;
        }
        
        if (user.role === 'Modérateur') {
            showAlert('ℹ️ Cet utilisateur est déjà modérateur');
            return;
        }
        
        if (user.role === 'Administrateur') {
            showAlert('ℹ️ Cet utilisateur est déjà administrateur');
            return;
        }
        
        if (confirm(`✅ Promouvoir ${user.prenom} ${user.nom} (${user.email}) en tant que MODÉRATEUR ?`)) {
            await updateUserRole(user.id_user, 'Modérateur');
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('❌ Erreur de connexion');
    }
}

async function findUserByEmail(email) {
    try {
        showAlert('🔍 Recherche de l\'utilisateur...');
        
        // D'abord, récupérer tous les utilisateurs
        const response = await fetch('http://localhost/social-network/api/admin/get_users.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.success) {
            showAlert('❌ ' + (data.error || 'Erreur de chargement'));
            return;
        }
        
        // Trouver l'utilisateur par email
        const user = data.users.find(u => u.email === email);
        
        if (!user) {
            showAlert('❌ Utilisateur non trouvé avec l\'email: ' + email);
            return;
        }
        
        // Vérifier si l'utilisateur n'est pas déjà modérateur ou admin
        if (user.role === 'Modérateur') {
            showAlert('ℹ️ Cet utilisateur est déjà modérateur');
            return;
        }
        
        if (user.role === 'Administrateur') {
            showAlert('ℹ️ Cet utilisateur est déjà administrateur');
            return;
        }
        
        // Confirmer avant de promouvoir
        if (confirm(`✅ Êtes-vous sûr de vouloir promouvoir ${user.prenom} ${user.nom} (${user.email}) en tant que MODÉRATEUR ?`)) {
            await updateUserRole(user.id_user, 'Modérateur');
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('❌ Erreur de connexion');
    }
}

// ========== UPLOAD D'IMAGES ==========

let currentImageToPost = null;

// Ouvrir le sélecteur d'image pour publication
// Upload d'image pour publication
async function openImageUploader() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/gif,image/webp';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Aperçu immédiat
        const reader = new FileReader();
        reader.onload = function(evt) {
            showImagePreview(evt.target.result);
        };
        reader.readAsDataURL(file);
        
        // Upload vers le serveur
        const formData = new FormData();
        formData.append('image', file);
        
        showAlert('📤 Upload en cours...');
        
        try {
            const response = await fetch('http://localhost/social-network/api/posts/upload_image.php', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                currentImageToPost = data.image_url;
                showAlert('✅ Image prête !');
            } else {
                showAlert(data.error || 'Erreur upload');
                removeImagePreview();
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur de connexion');
            removeImagePreview();
        }
    };
    
    input.click();
}

// Modifier publishPost
async function publishPost() {
    const textarea = document.getElementById('newPostText');
    const contenu = textarea.value.trim();
    
    if (!contenu && !currentImageToPost) {
        showAlert('✍️ Écrivez quelque chose ou ajoutez une image...');
        return;
    }
    
    const postData = {
        contenu: contenu,
        image: currentImageToPost
    };
    
    try {
        const response = await fetch('http://localhost/social-network/api/posts/create_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(postData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            textarea.value = '';
            removeImagePreview();
            currentImageToPost = null;
            showAlert('🚀 Post publié !');
            await loadPosts();
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    }
}

// Upload photo de profil
// Upload photo de profil
async function uploadProfileAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/gif,image/webp';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('avatar', file);
        
        showAlert('📤 Mise à jour...');
        
        try {
            const response = await fetch('http://localhost/social-network/api/profile/upload_avatar.php', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            const data = await response.json();
            console.log('Upload response:', data);
            
            if (data.success) {
                showAlert('✅ Photo mise à jour !');
                // Recharger currentUser
                await checkAuthStatus();
                // Recharger le profil
                await loadProfile();
                // Recharger les posts
                await loadPosts();
            } else {
                showAlert(data.error || 'Erreur');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur de connexion');
        }
    };
    
    input.click();
}

// Afficher l'aperçu de l'image
function showImagePreview(imageUrl) {
    let previewDiv = document.getElementById('imagePreview');
    if (!previewDiv) {
        const composer = document.querySelector('.composer-actions');
        previewDiv = document.createElement('div');
        previewDiv.id = 'imagePreview';
        previewDiv.style.cssText = 'margin-top:10px; position:relative; display:inline-block;';
        composer.parentNode.insertBefore(previewDiv, composer.nextSibling);
    }
    
    previewDiv.innerHTML = `
        <div style="position:relative; display:inline-block;">
            <img src="${imageUrl}" style="max-width:200px; max-height:150px; border-radius:8px; border:1px solid var(--border);">
            <button onclick="removeImagePreview()" style="position:absolute; top:-8px; right:-8px; width:24px; height:24px; border-radius:50%; background:var(--danger); color:white; border:none; cursor:pointer;">×</button>
        </div>
    `;
}

// Supprimer l'aperçu de l'image
function removeImagePreview() {
    currentImageToPost = null;
    const preview = document.getElementById('imagePreview');
    if (preview) preview.innerHTML = '';
}

// Modifier publishPost pour inclure l'image
async function publishPost() {
    const textarea = document.getElementById('newPostText');
    const contenu = textarea.value.trim();
    
    if (!contenu && !currentImageToPost) {
        showAlert('✍️ Écrivez quelque chose ou ajoutez une image...');
        return;
    }
    
    try {
        const response = await fetch('http://localhost/social-network/api/posts/create_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
                contenu: contenu,
                image: currentImageToPost
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            textarea.value = '';
            removeImagePreview();
            currentImageToPost = null;
            showAlert('🚀 Post publié avec succès !');
            await loadPosts();
        } else {
            showAlert(data.error || 'Erreur lors de la publication');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur');
    }
}

// ========== CHAT - ENVOI D'IMAGES ==========

let currentChatImage = null;

// Ouvrir le sélecteur d'image pour le chat
function openChatImageUploader() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/gif,image/webp';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Vérifier la taille
        if (file.size > 5 * 1024 * 1024) {
            showAlert('❌ L\'image est trop volumineuse (max 5MB)');
            return;
        }
        
        // Upload vers le serveur
        const formData = new FormData();
        formData.append('image', file);
        
        showAlert('📤 Upload en cours...');
        
        try {
            const response = await fetch('http://localhost/social-network/api/chat/upload_image.php', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                currentChatImage = data.image_url;
                showAlert('✅ Image prête à être envoyée !');
                
                // Afficher l'aperçu dans le chat
                showChatImagePreview(data.image_url);
            } else {
                showAlert(data.error || 'Erreur upload');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur de connexion');
        }
    };
    
    input.click();
}

// Afficher l'aperçu de l'image dans le chat
function showChatImagePreview(imageUrl) {
    let previewDiv = document.getElementById('chatImagePreview');
    if (!previewDiv) {
        const inputRow = document.querySelector('#convWindow .chat-input-row');
        previewDiv = document.createElement('div');
        previewDiv.id = 'chatImagePreview';
        previewDiv.style.cssText = 'padding:8px 12px; background:rgba(255,255,255,0.04); border-radius:8px; margin-bottom:8px; display:flex; align-items:center; gap:12px;';
        inputRow.parentNode.insertBefore(previewDiv, inputRow);
    }
    
    previewDiv.innerHTML = `
        <img src="http://localhost/social-network/${imageUrl}" style="max-height:60px; max-width:60px; border-radius:8px; object-fit:cover;">
        <span style="font-size:13px; color:#8888aa;">Image prête à être envoyée</span>
        <button onclick="removeChatImagePreview()" style="background:none; border:none; color:#ff5577; cursor:pointer; font-size:18px; margin-left:auto;">✕</button>
    `;
    previewDiv.style.display = 'flex';
}

// Supprimer l'aperçu de l'image
function removeChatImagePreview() {
    currentChatImage = null;
    const preview = document.getElementById('chatImagePreview');
    if (preview) {
        preview.style.display = 'none';
        preview.innerHTML = '';
    }
}

// Modifier sendMessage pour envoyer aussi l'image
async function sendMessage() {
    const input = document.getElementById('chatInlineInput');
    const contenu = input.value.trim();
    
    // Vérifier qu'il y a du texte OU une image
    if (!contenu && !currentChatImage) {
        showAlert('✏️ Écrivez un message ou ajoutez une image');
        return;
    }
    
    if (!currentConversationId) {
        showAlert('Sélectionnez une conversation');
        return;
    }
    
    input.disabled = true;
    
    try {
        const payload = {
            conversation_id: currentConversationId,
            contenu: contenu || null,
            image: currentChatImage || null
        };
        
        const response = await fetch('http://localhost/social-network/api/chat/send_message.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.success) {
            input.value = '';
            // Supprimer l'aperçu
            removeChatImagePreview();
            currentChatImage = null;
            // Recharger les messages
            await loadMessages(currentConversationId);
            // Recharger les conversations
            loadConversations();
        } else {
            showAlert(data.error || 'Erreur');
        }
    } catch (error) {
        showAlert('Erreur de connexion');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

// Upload photo de profil
async function uploadProfileAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/gif,image/webp';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('avatar', file);
        
        showAlert('📤 Mise à jour de la photo...');
        
        try {
            const response = await fetch('http://localhost/social-network/api/profile/upload_avatar.php', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                showAlert('✅ Photo de profil mise à jour !');
                // Recharger les infos
                await checkAuthStatus();
            } else {
                showAlert(data.error || 'Erreur');
            }
        } catch (error) {
            showAlert('Erreur de connexion');
        }
    };
    input.click();
}
async function loadProfile() {
    try {
        const response = await fetch('http://localhost/social-network/api/profile/get_profile.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            displayProfile(data.user);
        }
    } catch (error) {
        console.error('Erreur loadProfile:', error);
    }
}

async function loadProfileStats(userId) {
    if (!userId) {
        console.warn('⚠️ userId undefined, utilisateur par défaut');
        userId = currentUser?.id_user || 1;
    }
    
    try {
        const response = await fetch(`http://localhost/social-network/api/profile/get_stats.php?user_id=${userId}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            // Mettre à jour les stats du profil
            const statValues = document.querySelectorAll('#profilePage .profile-info-card > div > div > div:first-child');
            if (statValues.length >= 3) {
                statValues[0].textContent = data.stats.posts_count;
                statValues[1].textContent = data.stats.friends_count;
                statValues[2].textContent = data.stats.followers_count;
            }
        }
    } catch (error) {
        console.error('Erreur stats:', error);
    }
}