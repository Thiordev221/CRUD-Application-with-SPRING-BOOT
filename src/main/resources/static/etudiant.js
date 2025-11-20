// Configuration API
const API_URL = 'http://localhost:8080/api';

// Variables globales
let allStudents = [];
let allFormations = [];
let filteredStudents = [];
let currentPage = 1;
let pageSize = 20;


// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
    // loadFormations();
    loadStudents();
    setupEventListeners();
    // Toggle mobile menu
});
    function toggleMenu() {
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.toggle('active');
    }

// Event Listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        console.log('hi')
        chercherParPrenom(filteredStudents)
    });

    document.getElementById('studentForm').addEventListener('submit', handleSubmit);
    document.getElementById('pageSize').addEventListener('change', (e) => {
        pageSize = parseInt(e.target.value);
        currentPage = 1;
        displayStudents(filteredStudents);
    });
}

// Charger les formations
// async function loadFormations() {
//     try {
//         const response = await fetch(`${API_URL}/formations`);
//         allFormations = await response.json();
//         populateFormationSelects();
//     } catch (error) {
//         console.error('Erreur chargement formations:', error);
//     }
// }

// Remplir les selects de formation
// function populateFormationSelects() {
//     const filterSelect = document.getElementById('formationFilter');
//     const formSelect = document.getElementById('formationId');
//
//     allFormations.forEach(formation => {
//         const option1 = document.createElement('option');
//         option1.value = formation.id;
//         option1.textContent = formation.nom;
//         filterSelect.appendChild(option1);
//
//         const option2 = document.createElement('option');
//         option2.value = formation.id;
//         option2.textContent = formation.nom;
//         formSelect.appendChild(option2);
//     });
// }



// Charger les étudiants
async function loadStudents() {
    try {
        showLoading(true);
        const response = await fetch(`${API_URL}/etudiants`);
        allStudents = await response.json();
        filteredStudents = allStudents;
        currentPage = 1;
        displayStudents(filteredStudents);
    } catch (error) {
        console.error('Erreur chargement étudiants:', error);
        showToast('Erreur lors du chargement des étudiants', 'error');
    } finally {
        showLoading(false);
    }
}

//chercher par prenom
function chercherParPrenom(EtudiantsAFiltrer){
    const valeur = document.getElementById('searchInput').value;
    const filtre = EtudiantsAFiltrer.filter(etudiant => etudiant.prenom.toLowerCase().includes(valeur))
    displayStudents(filtre)
}

// Afficher les étudiants avec pagination
function displayStudents(students) {
    const tbody = document.getElementById('studentsTableBody');
    const table = document.getElementById('studentsTable');
    const emptyState = document.getElementById('emptyState');
    const paginationContainer = document.getElementById('paginationContainer');

    if (students.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
        paginationContainer.style.display = 'none';
        return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';
    tbody.innerHTML = '';

    // Calculer la pagination
    const totalPages = Math.ceil(students.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, students.length);
    const paginatedStudents = students.slice(startIndex, endIndex);

    // Afficher les étudiants de la page actuelle
    paginatedStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.nom}</td>
                    <td>${student.prenom}</td>
                    <td>${student.email}</td>
                    <td class="actions">
                        <button class="btn btn-warning" onclick="openEditModal(${student.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
        tbody.appendChild(row);
    });

    // Afficher la pagination
    if (students.length > pageSize) {
        paginationContainer.style.display = 'flex';
        updatePaginationInfo(startIndex + 1, endIndex, students.length);
        renderPaginationButtons(totalPages);
    } else {
        paginationContainer.style.display = 'none';
    }
}

// Mettre à jour les informations de pagination
function updatePaginationInfo(start, end, total) {
    const paginationInfo = document.getElementById('paginationInfo');
    paginationInfo.textContent = `Affichage de ${start} à ${end} sur ${total} étudiant${total > 1 ? 's' : ''}`;
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

    // Ajuster si on est au début ou à la fin
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
        pageButton.textContent = `${i}`;
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
    displayStudents(filteredStudents);
    // Scroll vers le haut du tableau
    document.getElementById('studentsTable').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// Ouvrir modal ajout
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter un étudiant';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('email').style.display = 'block';
    document.getElementById('label').style.display = 'block';
    document.getElementById('studentModal').classList.add('active');
}

// Ouvrir modal édition
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/etudiants/${id}`);
        const student = await response.json();

        document.getElementById('modalTitle').textContent = 'Modifier l\'étudiant';
        document.getElementById('studentId').value = student.id;
        document.getElementById('nom').value = student.nom;
        document.getElementById('prenom').value = student.prenom;
        document.getElementById('email').style.display = 'none';
        document.querySelector('label[for="email"]').style.display = 'none';
        document.getElementById('studentModal').classList.add('active');
    } catch (error) {
        console.error('Erreur chargement étudiant:', error);
        showToast('Erreur lors du chargement de l\'étudiant', 'error');
    }
}

// Fermer modal
function closeModal() {
    document.getElementById('studentModal').classList.remove('active');
}

// Soumettre formulaire
async function handleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('studentId').value;
    const student = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
    };

    try {
        let response;
        if (id) {
            // Mise à jour
            response = await fetch(`${API_URL}/etudiants/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            showToast('Étudiant modifié avec succès', 'success');
        } else {
            // Création
            response = await fetch(`${API_URL}/etudiants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            showToast('Étudiant ajouté avec succès', 'success');
        }

        if (response.ok) {
            closeModal();
            await loadStudents();
        }
    } catch (error) {
        console.error('Erreur sauvegarde étudiant:', error);
        showToast('Erreur lors de la sauvegarde', 'error');
    }
}

// Supprimer étudiant
async function deleteStudent(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/etudiants/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Étudiant supprimé avec succès', 'success');
            await loadStudents();
        }
    } catch (error) {
        console.error('Erreur suppression étudiant:', error);
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
    const modal = document.getElementById('studentModal');
    if (event.target === modal) {
        closeModal();
    }

}