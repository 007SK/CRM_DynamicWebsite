import { db } from './firebase-config.js';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const columns = {
    'Planning': document.getElementById('Planning'),
    'In-progress': document.getElementById('In-progress'),
    'Review': document.getElementById('Review')
};

const feedbackEl = document.getElementById('feedback');

function showFeedback(message) {
    feedbackEl.textContent = message;
    feedbackEl.classList.remove('hidden');
    setTimeout(() => {
        feedbackEl.classList.add('hidden');
    }, 3000);
}

// Fetch and render customers
const customersRef = collection(db, 'customers');
const q = query(customersRef, where('status', 'in', ['Planning', 'In-progress', 'Review']));

onSnapshot(q, (snapshot) => {
    // Clear columns
    Object.values(columns).forEach(col => col.innerHTML = '');

    snapshot.forEach((doc) => {
        const customer = doc.data();
        const customerId = doc.id;
        const card = createCustomerCard(customerId, customer);
        const column = columns[customer.status];
        if (column) {
            column.appendChild(card);
        }
    });
});

function createCustomerCard(id, data) {
    const card = document.createElement('div');
    card.id = id;
    card.draggable = true;
    card.className = 'customer-card bg-white p-4 rounded shadow hover:shadow-md transition bg-white border-l-4 border-blue-500';
    card.ondragstart = (ev) => {
        ev.dataTransfer.setData("customerId", id);
    };

    const photoURL = data.photoURL || 'https://via.placeholder.com/150';
    
    card.innerHTML = `
        <div class="flex items-center gap-4">
            <img src="${photoURL}" alt="${data.name}" class="w-12 h-12 rounded-full object-cover">
            <div>
                <a href="view-customer.html?id=${id}" class="text-blue-600 font-bold hover:underline block">${data.name || 'Unnamed Customer'}</a>
                <p class="text-sm text-gray-600">Balance: $${data.balance?.toFixed(2) || '0.00'}</p>
            </div>
        </div>
    `;
    return card;
}

// Handle Status Update from Drop
window.addEventListener('customerStatusUpdate', async (e) => {
    const { customerId, newStatus } = e.detail;
    try {
        const customerRef = doc(db, 'customers', customerId);
        await updateDoc(customerRef, { status: newStatus });
        showFeedback(`Customer moved to ${newStatus}`);
    } catch (error) {
        console.error("Error updating status:", error);
        showFeedback("Failed to update status.");
    }
});

// Add Customer Button
document.getElementById('add-customer-btn').onclick = async () => {
    try {
        const newCustomer = {
            name: "New Customer",
            status: "Planning",
            balance: 0.0,
            notes: "",
            photoURL: ""
        };
        const docRef = await addDoc(collection(db, 'customers'), newCustomer);
        window.location.href = `view-customer.html?id=${docRef.id}`;
    } catch (error) {
        console.error("Error adding customer:", error);
        showFeedback("Error adding customer.");
    }
};
