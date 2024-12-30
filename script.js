const holdersName = document.querySelector('.js-holders-name');

const submitCta = document.querySelector('.confirm-cta');

submitCta.addEventListener('click', (event) => {
    event.preventDefault();
    validInputs();
});

window.addEventListener('keydown', () => {
    buttonDown(event);
});

function buttonDown(event) {
    if (event.key === 'Enter') {
        validInputs();
    }
}

function validInputs() {
    // Run all validations
    const isNameValid = validateName();
    const isNumberValid = validateNumber();
    const isDateValid = validateExpiryDate();
    const isCvvValid = validateCvv();

    const container = document.querySelector('.form-container');
    let complete = document.querySelector('.complete-container'); // Updated selector

    // Create thank-you card
    const thankYouCard = document.createElement('div');
    thankYouCard.classList.add('thank-you-card');
    thankYouCard.innerHTML = `
        <img class="complete-icon" src="images/icon-complete.svg" alt="complete-icon">
        <h1>THANK YOU</h1>
        <p class="desc">We've added your card details</p>
        <button class="continue-btn">Continue</button>
    `;

    // Check if all validations pass
    if (isNameValid && isNumberValid && isDateValid && isCvvValid) {
         // Hide the form container
         container.style.display = 'none';

         // Add thank-you card to the complete container
         complete.innerHTML = ''; // Clear previous content
         complete.appendChild(thankYouCard);


        const continueButton = thankYouCard.querySelector('.continue-btn');
        continueButton.addEventListener('click', () => {
            console.log('Continue button clicked.');
            clearDetails();
            //name.value = '';
            //holderNameElement.innerText = 'Jane Appleseed';
            // What happens when "Continue" is clicked
            container.style.display = 'block';
            thankYouCard.remove();
        });
        return true;
    } else {
        console.log('Form validation failed');
        return false;
    }
}

function clearDetails() {
    const name = document.querySelector('.js-name-input');
    const holderNameElement = document.querySelector('.js-holders-name');

    const numberInput = document.querySelector('.js-number-input');
    const cardNumberDisplay = document.querySelector('.card-number');

    const monthInput = document.querySelector('.month');
    const yearInput = document.querySelector('.year');
    const expiryDisplay = document.querySelector('.expiry-date');

    const cvvInput = document.querySelector('.cvv');
    const cvcDisplay = document.querySelector('.cvc-number');

    if (name && holderNameElement) {
        name.value = '';
        holderNameElement.innerText = 'Jane Appleseed';
    }

    if (name && holderNameElement) {
        numberInput.value = '';
        cardNumberDisplay.innerText = '0000 0000 0000 0000';
    }

    if (monthInput && yearInput && expiryDisplay) {
        monthInput.value = '';
        yearInput.value = '';
        expiryDisplay.innerText = '00/00';
    }

    if (cvvInput && cvcDisplay) {
        cvvInput.value = '';
        cvcDisplay.innerText = '000'
    }

}

function validateName() {
    const nameInput = document.querySelector('.js-name-input');
    if (!nameInput) {
        console.error('Name input element not found');
        return false;
    }

    const inputContent = nameInput.value.trim(); // Added trim() to remove whitespace
    
    const container = document.querySelector('.holder-name-input');
    if (!container) {
        console.error('Container element not found');
        return false;
    }

    // Clear previous error messages
    container.querySelectorAll('.error').forEach(msg => msg.remove());

    // Validation rules
    const containsNumbers = /\d/.test(inputContent);
    const containsSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(inputContent);
    
    if (inputContent === '') {
        displayError(container, 'Field cannot be empty');
        nameInput.classList.add('active-error');
        return false;
    }
    
    if (containsNumbers) {
        displayError(container, 'Should not contain numbers');
        nameInput.classList.add('active-error');
        return false;
    }
    
    if (containsSpecialChars) {
        displayError(container, 'Incorrect format');
        nameInput.classList.add('active-error');
        return false;
    }
    
    if (inputContent.length < 2) {
        displayError(container, 'Incorrect format');
        nameInput.classList.add('active-error');
        return false;
    }
    
    // If all validations pass
    const holderNameElement = document.querySelector('.js-holders-name');
    if (holderNameElement) {
        holderNameElement.innerText = inputContent;
        nameInput.classList.remove('active-error');
        console.log('Name input valid:', inputContent);
        return true;
    }
    
    //console.error('Holder name element not found');
    return false;
}

function validateNumber() {
    const numberInput = document.querySelector('.js-number-input');
    if (!numberInput) {
        console.error('Card number input element not found');
        return false;
    }

    // Remove any spaces or dashes from input
    const cardInputNumber = numberInput.value.replace(/[\s-]/g, '');
    
    const container = document.querySelector('.holder-number-input');
    if (!container) {
        console.error('Container element not found');
        return false;
    }

    // Clear previous error messages
    container.querySelectorAll('.error').forEach(msg => msg.remove());

    // Validation checks
    if (cardInputNumber === '') {
        displayError(container, 'Field cannot be empty');
        numberInput.classList.add('active-error');
        return false;
    }

    // Format the card number for display (groups of 4)
    const formattedNumber = formatCardNumber(cardInputNumber);
    
    // Update display
    const cardNumberDisplay = document.querySelector('.card-number');

    if (!/^\d+$/.test(cardInputNumber)) {
        displayError(container, 'Wrong format, numbers only');
        cardNumberDisplay.innerText = formattedNumber;
        numberInput.classList.add('active-error');
        return false;
    }

    if (cardInputNumber.length <= 13 || cardInputNumber.length > 16) {
        displayError(container, 'Incomplete Card number');
        numberInput.classList.add('active-error');
        return false;
    }

    
    if (cardNumberDisplay) {
        cardNumberDisplay.innerText = formattedNumber;
        numberInput.classList.remove('active-error');
        return true;
    }

    //console.error('Card number display element not found');
    return false;
}

// Helper function to format card number in groups of 4
function formatCardNumber(number) {
    const groups = [];
    for (let i = 0; i < number.length; i += 4) {
        groups.push(number.slice(i, i + 4));
    }
    return groups.join(' ');
}


function validateExpiryDate() {   
    const monthInput = document.querySelector('.month');
    const yearInput = document.querySelector('.year');
    
    if (!monthInput || !yearInput) {
        return false;
    }

    const monthInputValue = monthInput.value.trim();
    const yearInputValue = yearInput.value.trim();

    const container = document.querySelector('.date-label');
    if (!container) {
        return false;
    }

    // Clear previous error messages
    container.querySelectorAll('.error').forEach(msg => msg.remove());

    // Basic format validation
    if (monthInputValue === '' || yearInputValue === '') {
        displayError(container, `Can't be blank`);
        yearInput.classList.add('active-error');
        monthInput.classList.add('active-error');
        return false;
    }

    if (!/^\d{1,2}$/.test(monthInputValue) || !/^\d{2}$/.test(yearInputValue)) {
        displayError(container, 'Please enter valid date format');
        yearInput.classList.add('active-error');
        monthInput.classList.add('active-error');
        return false;
    }

    const month = parseInt(monthInputValue, 10);
    const year = parseInt(yearInputValue, 10);

    // Validate month range
    if (month < 1 || month > 12) {
        displayError(container, 'Invalid month');
        yearInput.classList.add('active-error');
        monthInput.classList.add('active-error');
        return false;
    }

    // Get current date for comparison
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

    // Validate year
    if (year < currentYear || year > currentYear + 10) {
        displayError(container, 'Invalid year');
        yearInput.classList.add('active-error');
        monthInput.classList.add('active-error');
        return false;
    }

    // Check if card is expired
    if (year === currentYear && month < currentMonth) {
        displayError(container, 'Card has expired');
        yearInput.classList.add('active-error');
        monthInput.classList.add('active-error');
        return false;
    }

    // Format display values
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedYear = year.toString().padStart(2, '0');

    // Update display
    const expiryDisplay = document.querySelector('.expiry-date');
    if (expiryDisplay) {
        expiryDisplay.innerText = `${formattedMonth}/${formattedYear}`;
        yearInput.classList.remove('active-error');
        monthInput.classList.remove('active-error');
        return true;
    }

    //console.error('Expiry date display element not found');
    return false;
}

function validateCvv() {
    const cvvInput = document.querySelector('.cvv');
    if (!cvvInput) {
        console.error('CVV input element not found');
        return false;
    }

    const cvvInputValue = cvvInput.value.trim();
    
    const container = document.querySelector('.cvv-container');
    if (!container) {
        console.error('Container element not found');
        return false;
    }

    // Clear previous error messages
    container.querySelectorAll('.error').forEach(msg => msg.remove());

    // Validation checks
    if (cvvInputValue === '') {
        displayError(container, "Can't be blank");
        cvvInput.classList.add('active-error');
        return false;
    }

    // Check if input contains only numbers
    if (!/^\d+$/.test(cvvInputValue)) {
        displayError(container, 'CVV must contain only numbers');
        cvvInput.classList.add('active-error');
        return false;
    }

    // Check CVV length (3 or 4 digits depending on card type)
    if (cvvInputValue.length < 3 || cvvInputValue.length > 4) {
        displayError(container, 'CVV must be 3 or 4 digits');
        cvvInput.classList.add('active-error');
        return false;
    }

    // Update display
    const cvcDisplay = document.querySelector('.cvc-number');
    if (cvcDisplay) {
        // Mask all but the last digit for security
        const maskedCvv = cvvInputValue.replace(/\d(?=\d{1})/g, '*');
        cvcDisplay.innerText = maskedCvv;
        cvvInput.classList.remove('active-error');
        console.log('CVV input valid');
        return true;
    }

    //console.error('CVC display element not found');
    return false;
}


// Helper function for displaying errors
function displayError(container, message) {
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error');
    errorMessage.textContent = message;
    container.appendChild(errorMessage);
}

const imageBg = document.querySelector('.bg');

function resizeWindow() {
    // Use window.innerWidth instead of window.width
    if (window.innerWidth <= 600) {
        // Add check to ensure image element exists
        if (imageBg) {
            imageBg.src = 'images/bg-main-mobile.png';
        }
    } else {
        if (imageBg) {
            imageBg.src = 'images/bg-main-desktop.png';
        }
    }
}

// Check if image element exists before adding event listener
if (imageBg) {
    // Run on initial load
    resizeWindow();
    
    // Add debounced resize listener to prevent excessive function calls
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeWindow, 250); // Wait 250ms after last resize event
    });
} else {
    console.error('Background image element not found');
}

/*
// Optional: Add load event listener to ensure image loads properly
imageBg?.addEventListener('load', () => {
    console.log('Background image loaded successfully');
});

// Optional: Add error handling for image loading
imageBg?.addEventListener('error', () => {
    console.error('Failed to load background image');
});
// Validate year
 

// Luhn algorithm check (credit card number validation)
if (!isValidLuhn(cardInputNumber)) {
    displayError(container, 'Invalid card number');
    return false;
}
 
// Helper function to implement Luhn algorithm for card number validation
function isValidLuhn(number) {
    let sum = 0;
    let isEven = false;
    
    // Loop through values starting from the right
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i), 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return (sum % 10) === 0;
}
*/