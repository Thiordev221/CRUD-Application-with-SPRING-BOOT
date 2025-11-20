// Configuration API
const API_URL = 'http://localhost:8080/api';

// Variables globales
let allFormations = [];
let filteredFormations = [];
let currentPage = 1;
let pageSize = 20;

// Toggle menu mobile
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
    loadFormations();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterFormations();
    });
    document.getElementById('formationForm').addEventListener('submit', handleSubmit);
    document.getElementById('pageSize').addEventListener('change', (e) => {
        pageSize = parseInt(e.target.value);
        currentPage = 1;
        displayFormations(filteredFormations);
    });
}

// Charger les formations
async function loadFormations() {
    try {
        showLoading(true);
        const response = await fetch(`${API_URL}/formations`);
        allFormations = await response.json();
        filteredFormations = allFormations;
        currentPage = 1;
        displayFormations(filteredFormations);
    } catch (error) {
        console.error('Erreur chargement formations:', error);
        showToast('Erreur lors du chargement des formations', 'error');
    } finally {
        showLoading(false);
    }
}

// Afficher les formations avec pagination
function displayFormations(formations) {
    const tbody = document.getElementById('formationsTableBody');
    const table = document.getElementById('formationsTable');
    const emptyState = document.getElementById('emptyState');
    const paginationContainer = document.getElementById('paginationContainer');

    if (formations.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
        paginationContainer.style.display = 'none';
        return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';
    tbody.innerHTML = '';

    // Calculer la pagination
    const totalPages = Math.ceil(formations.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, formations.length);
    const paginatedFormations = formations.slice(startIndex, endIndex);

    // Afficher les formations de la page actuelle
    paginatedFormations.forEach(formation => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${formation.id}</td>
                    <td><strong>${formation.titre}</strong></td>
                    <td>${formation.description ? (formation.description.length > 100 ? formation.description.substring(0, 100) + '...' : formation.description) : '-'}</td>
                    <td>${formation.formateur ? `<span class="badge badge-info">${formation.formateur}</span>` : '-'}</td>
                    <td class="actions">
                        <button class="btn btn-warning" onclick="openEditModal(${formation.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="deleteFormation(${formation.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
        tbody.appendChild(row);
    });

    // Afficher la pagination
    if (formations.length > pageSize) {
        paginationContainer.style.display = 'flex';
        updatePaginationInfo(startIndex + 1, endIndex, formations.length);
        renderPaginationButtons(totalPages);
    } else {
        paginationContainer.style.display = 'none';
    }
}

// Mettre à jour les informations de pagination
function updatePaginationInfo(start, end, total) {
    const paginationInfo = document.getElementById('paginationInfo');
    paginationInfo.textContent = `Affichage de ${start} à ${end} sur ${total} formation${total > 1 ? 's' : ''}`;
}

// Générer les boutons de pagination
function renderPaginationButtons(totalPages) {
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';

    // Bouton Précédent
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => changePage(currentPage - 1);
    paginationButtons.appendChild(prevButton);

    // Logique d'affichage des numéros de page
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
    }

    // Première page
    if (startPage > 1) {
        const firstButton = document.createElement('button');
        firstButton.textContent = '1';
        firstButton.onclick = () => changePage(1);
        paginationButtons.appendChild(firstButton);

        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 0.5rem';
            paginationButtons.appendChild(dots);
        }
    }

    // Boutons de pages
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.onclick = () => changePage(i);
        paginationButtons.appendChild(pageButton);
    }

    // Dernière page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 0.5rem';
            paginationButtons.appendChild(dots);
        }

        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.onclick = () => changePage(totalPages);
        paginationButtons.appendChild(lastButton);
    }

    // Bouton Suivant
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => changePage(currentPage + 1);
    paginationButtons.appendChild(nextButton);
}

// Changer de page
function changePage(page) {
    currentPage = page;
    displayFormations(filteredFormations);
    document.getElementById('formationsTable').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Filtrer les formations
function filterFormations() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filtered = allFormations;

    if (searchTerm) {
        filtered = filtered.filter(formation =>
            formation.titre.toLowerCase().includes(searchTerm)
        );
    }

    filteredFormations = filtered;
    displayFormations(filteredFormations);
}

// Ouvrir modal ajout
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter une formation';
    document.getElementById('formationForm').reset();
    document.getElementById('formationId').value = '';
    document.getElementById('formationModal').classList.add('active');
}

// Ouvrir modal édition
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/formations/${id}`);
        const formation = await response.json();

        document.getElementById('modalTitle').textContent = 'Modifier la formation';
        document.getElementById('formationId').value = formation.id;
        document.getElementById('nom').value = formation.titre;
        document.getElementById('description').value = formation.description || '';
        document.getElementById('formateur').value = formation.formateur || '';

        document.getElementById('formationModal').classList.add('active');
    } catch (error) {
        console.error('Erreur chargement formation:', error);
        showToast('Erreur lors du chargement de la formation', 'error');
    }
}

// Fermer modal
function closeModal() {
    document.getElementById('formationModal').classList.remove('active');
}

// Soumettre formulaire
async function handleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('formationId').value;
    const formation = {
        titre: document.getElementById('nom').value,
        description: document.getElementById('description').value,
        formateur: document.getElementById('formateur').value
    };

    try {
        let response;
        if (id) {
            // Mise à jour
            response = await fetch(`${API_URL}/formations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formation)
            });
            showToast('Formation modifiée avec succès', 'success');
        } else {
            // Création
            response = await fetch(`${API_URL}/formations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formation)
            });
            showToast('Formation ajoutée avec succès', 'success');
        }

        if (response.ok) {
            closeModal();
            loadFormations();
        }
    } catch (error) {
        console.error('Erreur sauvegarde formation:', error);
        showToast('Erreur lors de la sauvegarde', 'error');
    }
}

// Supprimer formation
async function deleteFormation(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ? Les étudiants inscrits à cette formation seront affectés.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/formations/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Formation supprimée avec succès', 'success');
            loadFormations();
        }
    } catch (error) {
        console.error('Erreur suppression formation:', error);
        showToast('Erreur lors de la suppression', 'error');
    }
}

// Afficher loading
function showLoading(show) {
    document.getElementById('loadingState').style.display = show ? 'block' : 'none';
}

// Afficher toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toast.className = `toast ${type} active`;
    toastMessage.textContent = message;

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Fermer modal au clic extérieur
window.onclick = function(event) {
    const modal = document.getElementById('formationModal');
    if (event.target === modal) {
        closeModal();
    }
}