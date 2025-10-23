const callForm = document.getElementById('callForm');
const phoneInput = document.getElementById('phoneNumber');
const callButton = document.getElementById('callButton');
const buttonText = document.getElementById('buttonText');
const messageDiv = document.getElementById('message');

// Format phone number as user types
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    
    // Ensure it starts with + if user enters a digit
    if (value.length > 0 && value[0] !== '+') {
        value = '+' + value;
    }
    
    e.target.value = value;
});

// Handle form submission
callForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phoneNumber = phoneInput.value.trim();
    
    // Basic validation
    if (!phoneNumber || phoneNumber.length < 10) {
        showMessage('Veuillez entrer un numéro de téléphone valide', 'error');
        return;
    }
    
    // Disable button and show loading state
    setLoadingState(true);
    hideMessage();
    
    try {
        const response = await fetch('/api/call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showMessage('Appel lancé avec succès ! Vous allez recevoir un appel sous peu.', 'success');
            phoneInput.value = '';
        } else {
            showMessage(data.error || 'Échec de l\'initiation de l\'appel. Veuillez réessayer.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Erreur réseau. Veuillez vérifier votre connexion et réessayer.', 'error');
    } finally {
        setLoadingState(false);
    }
});

// Show message to user
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message show ${type}`;
}

// Hide message
function hideMessage() {
    messageDiv.classList.remove('show');
}

// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        callButton.disabled = true;
        buttonText.innerHTML = '<span class="loading"></span> Appel en cours...';
    } else {
        callButton.disabled = false;
        buttonText.textContent = 'Lancer l\'Appel';
    }
}

