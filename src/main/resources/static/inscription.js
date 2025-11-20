
// Configuration API
const API_URL = 'http://localhost:8080/api';

// Variables globales
let allInscriptions = [];
let allFormations = [];
let filteredInscriptions = [];
let currentPage = 1;
let pageSize = 20;

// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
    loadFormations();
    loadInscriptions();
    loadEtudiantsInscription();
    loadFormationsInscription();
    setupEventListeners();


});
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterInscriptions();
    });
    document.getElementById('statutFilter').addEventListener('change', () => {
        currentPage = 1;
        filterInscriptions();
    });
    document.getElementById('formationFilter').addEventListener('change', () => {
        currentPage = 1;
        filterInscriptions();
    });
    document.getElementById('inscriptionForm').addEventListener('submit', handleSubmit);
    document.getElementById('pageSize').addEventListener('change', (e) => {
        pageSize = parseInt(e.target.value);
        currentPage = 1;
        displayInscriptions(filteredInscriptions);
    });
}

// Charger les formations pour le filtre
async function loadFormations() {
    try {
        const response = await fetch(`${API_URL}/formations`);
        allFormations = await response.json();
        populateFormationFilter();
    } catch (error) {
        console.error('Erreur chargement formations:', error);
    }
}

// Remplir le select des formations
function populateFormationFilter() {
    const filterSelect = document.getElementById('formationFilter');
    allFormations.forEach(formation => {
        const option = document.createElement('option');
        option.value = formation.id;
        option.textContent = formation.titre;
        filterSelect.appendChild(option);
    });
}

// Charger les inscriptions
async function loadInscriptions() {
    try {
        showLoading(true);
        const response = await fetch(`${API_URL}/inscriptions`);
        allInscriptions = await response.json();
        filteredInscriptions = allInscriptions;
        currentPage = 1;
        displayInscriptions(filteredInscriptions);
        console.log(filteredInscriptions)
    } catch (error) {
        console.error('Erreur chargement inscriptions:', error);
        showToast('Erreur lors du chargement des inscriptions', 'error');
    } finally {
        showLoading(false);
    }
}

// Afficher les inscriptions avec pagination
function displayInscriptions(inscriptions) {
    const tbody = document.getElementById('inscriptionsTableBody');
    const table = document.getElementById('inscriptionsTable');
    const emptyState = document.getElementById('emptyState');
    const paginationContainer = document.getElementById('paginationContainer');

    if (inscriptions.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
        paginationContainer.style.display = 'none';
        return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';
    tbody.innerHTML = '';

    // Calculer la pagination
    const totalPages = Math.ceil(inscriptions.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, inscriptions.length);
    const paginatedInscriptions = inscriptions.slice(startIndex, endIndex);

    // Afficher les inscriptions de la page actuelle
    paginatedInscriptions.forEach(inscription => {
        const statutClass = inscription.statut.toLowerCase().replace('_', '-');
        const statutLabel = inscription.statut === 'EN_COURS' ? 'En cours' :
            inscription.statut === 'TERMINE' ? 'Terminé' : 'Annulé';

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${inscription.id}</td>
                    <td><strong>${inscription.etudiant.prenom} ${inscription.etudiant.nom}</strong></td>
                    <td>${inscription.formation.titre}</td>
                    <td>${inscription.date_inscription}</td>
                    <td>${inscription.prix ? inscription.prix.toLocaleString() : '-'}</td>
                    <td><span class="badge badge-${statutClass}">${statutLabel}</span></td>
                    <td class="actions">
                        <button class="btn btn-warning" onclick="openEditModal(${inscription.id})" title="Modifier le statut">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="deleteInscription(${inscription.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
        tbody.appendChild(row);
    });

    // Afficher la pagination
    if (inscriptions.length > pageSize) {
        paginationContainer.style.display = 'flex';
        updatePaginationInfo(startIndex + 1, endIndex, inscriptions.length);
        renderPaginationButtons(totalPages);
    } else {
        paginationContainer.style.display = 'none';
    }
}

// Formater la date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Mettre à jour les informations de pagination
function updatePaginationInfo(start, end, total) {
    const paginationInfo = document.getElementById('paginationInfo');
    paginationInfo.textContent = `Affichage de ${start} à ${end} sur ${total} inscription${total > 1 ? 's' : ''}`;
}

// Générer les boutons de pagination
function renderPaginationButtons(totalPages) {
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => changePage(currentPage - 1);
    paginationButtons.appendChild(prevButton);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
    }

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

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.onclick = () => changePage(i);
        paginationButtons.appendChild(pageButton);
    }

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

    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => changePage(currentPage + 1);
    paginationButtons.appendChild(nextButton);
}

// Changer de page
function changePage(page) {
    currentPage = page;
    displayInscriptions(filteredInscriptions);
    document.getElementById('inscriptionsTable').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Filtrer les inscriptions
function filterInscriptions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statutFilter = document.getElementById('statutFilter').value;
    const formationFilter = document.getElementById('formationFilter').value;

    let filtered = allInscriptions;

    // Filtre par nom d'étudiant
    if (searchTerm) {
        filtered = filtered.filter(inscription =>
            inscription.etudiant.nom.toLowerCase().includes(searchTerm) ||
            inscription.etudiant.prenom.toLowerCase().includes(searchTerm)
        );
    }

    // Filtre par statut
    if (statutFilter) {
        filtered = filtered.filter(inscription =>
            inscription.statut === statutFilter
        );
    }

    // Filtre par formation
    if (formationFilter) {
        filtered = filtered.filter(inscription =>
            inscription.formation.id == formationFilter
        );
    }

    filteredInscriptions = filtered;
    displayInscriptions(filteredInscriptions);
}


// Ouvrir modal édition


function openAddModal() {

    document.getElementById('modalTitle').textContent = 'Ajouter une inscription';
    document.getElementById('etudiant_id').removeAttribute('disabled');
    document.getElementById('etudiant_id').setAttribute('required', true);
    document.getElementById('formation_id').removeAttribute('disabled');
    document.getElementById('formation_id').setAttribute('required', true);
    document.getElementById('prix').removeAttribute('disabled');
    document.getElementById('prix').setAttribute('required', true);
    document.getElementById('inscriptionModal').classList.add('active');
}



async function loadEtudiantsInscription(){
    try{
        const response = await fetch(`${API_URL}/etudiants`)
        const data = await response.json();
        await displayEtudiantInscription(data);
    }catch(e){
        console.log("Error" + e)
    }


}

async function displayEtudiantInscription(students){
    try{
        const etudiantSelect = document.getElementById('etudiant_id');
        students.forEach(student=>{
            const option = document.createElement('option');
            option.textContent = `${student.id} : ${student.prenom} ${student.nom}`;
            option.setAttribute('value', student.id)
            etudiantSelect.appendChild(option)
        });
    }catch(error){
        console.log("quelque chose s'est mal passé ! : ", error);
    }
}
async function loadFormationsInscription(){
    try{
        const response = await fetch(`${API_URL}/formations`)
        const data = await response.json();
        await displayFormationInscription(data);
    }catch(e){
        console.log("Error" + e)
    }


}

async function displayFormationInscription(formations){
    try{
        const formationSelect = document.getElementById('formation_id');
        formations.forEach(formation=>{
            const option = document.createElement('option');
            option.textContent = `${formation.id} : ${formation.titre}`;
            option.setAttribute('value', formation.id)
            formationSelect.appendChild(option)
        });
    }catch(error){
        console.log("quelque chose s'est mal passé ! : ", error);
    }
}


async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/inscriptions/${id}`);
        const inscription = await response.json();

        document.getElementById('etudiant_id').removeAttribute('required');
        document.getElementById('etudiant_id').setAttribute('disabled', true);
        document.getElementById('formation_id').setAttribute('disabled', true);
        document.getElementById('formation_id').removeAttribute('required');
        document.getElementById('prix').setAttribute('disabled', true);
        document.getElementById('prix').removeAttribute('required');
        document.getElementById('inscriptionId').value = inscription.id;
        document.getElementById('etudiant_id').value = `${inscription.etudiant.id} : ${inscription.etudiant.nom}`;
        document.getElementById('formation_id').value = `${inscription.formation.id} : ${inscription.formation.titre}` ;
        document.getElementById('statut').value = inscription.statut;

        document.getElementById('inscriptionModal').classList.add('active');


    } catch (error) {
        console.error('Erreur chargement inscription:', error);
        showToast('Erreur lors du chargement de l\'inscription', 'error');
    }
}

// Fermer modal
function closeModal() {
    document.getElementById('inscriptionModal').classList.remove('active');
}

// Soumettre formulaire
async function handleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('inscriptionId').value;
    const nouveauStatut = document.getElementById('statut').value;

    const datas = {
        prix: document.getElementById('prix').value,
        etudiant: { id: document.getElementById('etudiant_id').value },
        formation: { id: document.getElementById('formation_id').value },
        statut: nouveauStatut
    };

    try {
        let response;

        if (id) {
            response = await fetch(`${API_URL}/inscriptions/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ statut: nouveauStatut })
            });
        } else {
            response = await fetch(`${API_URL}/inscriptions`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datas)
            });
        }

        if (response.ok) {
            showToast(id ? 'Statut modifié avec succès' : 'Inscription enregistrée avec succès', 'success');
            await loadInscriptions();
            closeModal();
        } else {
            const errorMsg = await response.text();
            showToast('Erreur du serveur : ' + errorMsg, 'error');
        }

    } catch (error) {
        console.error('Erreur mise à jour inscription:', error);
        showToast('Erreur lors de la mise à jour : ' + error.message, 'error');
    }
}


// Supprimer inscription
    async function deleteInscription(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/inscriptions/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showToast('Inscription supprimée avec succès', 'success');
                loadInscriptions();
            }
        } catch (error) {
            console.error('Erreur suppression inscription:', error);
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
    window.onclick = function (event) {
        const modal = document.getElementById('inscriptionModal');
        if (event.target === modal) {
            closeModal();
        }
    }
