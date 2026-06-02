import { db, storage } from './firebase-config.js';
import { doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get('id');

const form = document.getElementById('customer-form');
const feedbackEl = document.getElementById('feedback');
const currentPhotoImg = document.getElementById('current-photo');
const photoInput = document.getElementById('photo-input');
const deleteBtn = document.getElementById('delete-btn');

function showFeedback(message) {
    feedbackEl.textContent = message;
    feedbackEl.classList.remove('hidden');
    setTimeout(() => {
        feedbackEl.classList.add('hidden');
    }, 3000);
}

if (!customerId) {
    alert("No customer ID provided!");
    window.location.href = 'index.html';
}

// Load Customer Data
async function loadCustomer() {
    try {
        const docRef = doc(db, 'customers', customerId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            form.name.value = data.name || '';
            form.status.value = data.status || 'Planning';
            form.balance.value = data.balance || 0;
            form.notes.value = data.notes || '';
            if (data.photoURL) {
                currentPhotoImg.src = data.photoURL;
            }
        } else {
            alert("Customer not found!");
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error("Error loading customer:", error);
        showFeedback("Error loading customer data.");
    }
}

loadCustomer();

// Handle Form Submission
form.onsubmit = async (e) => {
    e.preventDefault();
    
    let photoURL = currentPhotoImg.src;

    // Handle photo upload if a new file is selected
    if (photoInput.files[0]) {
        const file = photoInput.files[0];
        const storageRef = ref(storage, `customer_photos/${customerId}_${file.name}`);
        
        try {
            showFeedback("Uploading photo...");
            const snapshot = await uploadBytes(storageRef, file);
            photoURL = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("Error uploading photo:", error);
            showFeedback("Error uploading photo.");
            return;
        }
    }

    // Update Firestore
    try {
        const customerRef = doc(db, 'customers', customerId);
        await updateDoc(customerRef, {
            name: form.name.value,
            status: form.status.value,
            balance: parseFloat(form.balance.value),
            notes: form.notes.value,
            photoURL: photoURL
        });
        showFeedback("Customer saved successfully!");
        currentPhotoImg.src = photoURL;
    } catch (error) {
        console.error("Error updating customer:", error);
        showFeedback("Error saving customer.");
    }
};

// Handle Deletion
deleteBtn.onclick = async () => {
    if (confirm("Are you sure you want to delete this customer?")) {
        try {
            await deleteDoc(doc(db, 'customers', customerId));
            alert("Customer deleted.");
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Error deleting customer:", error);
            showFeedback("Error deleting customer.");
        }
    }
};
