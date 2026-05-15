document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('add-student-form');
    const nameInput = document.getElementById('student-name');
    const gradeInput = document.getElementById('student-grade');
    const studentsList = document.getElementById('students-list');
    const averageDisplay = document.getElementById('average-grade');
    const errorMessage = document.getElementById('error-message');
    const emptyState = document.getElementById('empty-state');
    const tableContainer = document.querySelector('.table-container');
    const studentCountBadge = document.getElementById('student-count');

    // Data Structure: Array of student objects
    let students = [];

    // Initialize application
    const init = () => {
        // Load data from localStorage
        const storedStudents = localStorage.getItem('studentsData');
        if (storedStudents) {
            try {
                students = JSON.parse(storedStudents);
            } catch (e) {
                console.error("Error parsing stored student data", e);
                students = [];
            }
        }
        
        updateUI();
    };

    // Calculate Average Grade
    const calculateAverage = () => {
        if (students.length === 0) return 0;
        const sum = students.reduce((acc, student) => acc + student.grade, 0);
        return (sum / students.length).toFixed(1);
    };

    // Save to localStorage
    const saveToLocalStorage = () => {
        localStorage.setItem('studentsData', JSON.stringify(students));
    };

    // Show Error Message
    const showError = (message) => {
        errorMessage.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            ${message}
        `;
        errorMessage.classList.remove('hidden');
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 3000);
    };

    // Render Student List
    const renderStudents = () => {
        studentsList.innerHTML = '';
        
        if (students.length === 0) {
            tableContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            studentCountBadge.textContent = '0 Students';
            return;
        }

        tableContainer.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        const avg = parseFloat(calculateAverage());
        studentCountBadge.textContent = `${students.length} Student${students.length !== 1 ? 's' : ''}`;

        students.forEach(student => {
            const isAboveAverage = student.grade > avg;
            const tr = document.createElement('tr');
            tr.className = `student-row ${isAboveAverage ? 'above-average' : ''}`;
            
            tr.innerHTML = `
                <td>
                    ${student.name}
                    ${isAboveAverage ? '<span style="font-size: 0.7rem; color: var(--accent-color); margin-left: 0.5rem; text-transform: uppercase; font-weight: 700;">Above Avg</span>' : ''}
                </td>
                <td><span class="grade-badge">${student.grade}</span></td>
                <td>
                    <button class="btn-delete" data-id="${student.id}" aria-label="Delete ${student.name}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
            `;
            
            studentsList.appendChild(tr);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                deleteStudent(id);
            });
        });
    };

    // Update entire UI
    const updateUI = () => {
        const avg = calculateAverage();
        
        // Animate the average update
        averageDisplay.style.transform = 'scale(1.1)';
        averageDisplay.textContent = avg;
        setTimeout(() => {
            averageDisplay.style.transform = 'scale(1)';
        }, 200);

        renderStudents();
        saveToLocalStorage();
    };

    // Add Student
    const addStudent = (name, grade) => {
        const newStudent = {
            id: Date.now(),
            name: name,
            grade: grade
        };
        
        students.push(newStudent);
        updateUI();
    };

    // Delete Student
    const deleteStudent = (id) => {
        students = students.filter(student => student.id !== id);
        updateUI();
    };

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const gradeValue = gradeInput.value;
        const grade = parseFloat(gradeValue);
        
        // Validation Rules
        if (!name) {
            showError("Student name cannot be empty.");
            nameInput.focus();
            return;
        }
        
        if (gradeValue === '' || isNaN(grade) || grade < 0 || grade > 100) {
            showError("Grade must be a number between 0 and 100.");
            gradeInput.focus();
            return;
        }
        
        // Add valid student
        addStudent(name, grade);
        
        // Reset form
        form.reset();
        nameInput.focus();
    });

    // Start the app
    init();
});
