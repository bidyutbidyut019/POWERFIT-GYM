// ====================================
// BOOKING PAGE JAVASCRIPT
// POWERFIT GYM
// ====================================

document.addEventListener("DOMContentLoaded", () => {

    // ====================================
    // INITIALIZE BOOKING FORM
    // ====================================

    initializeBookingForm();

});

/* ====================================
   BOOKING FORM
==================================== */

function initializeBookingForm() {

    const bookingForm =
        document.getElementById("bookingForm");

    if (!bookingForm) return;

    bookingForm.addEventListener(
        "submit",
        handleBookingSubmit
    );

}

/* ====================================
   HANDLE FORM SUBMIT
==================================== */

function handleBookingSubmit(event) {

    event.preventDefault();

    // ====================================
    // GET FORM VALUES
    // ====================================

    const fullName =
        document.getElementById("fullName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const service =
        document.getElementById("service").value;

    const trainer =
        document.getElementById("trainer").value;

    const bookingDate =
        document.getElementById("bookingDate").value;

    const bookingTime =
        document.getElementById("bookingTime").value;

    // ====================================
    // VALIDATION
    // ====================================

    if (
        fullName === "" ||
        email === "" ||
        phone === "" ||
        service === "" ||
        trainer === "" ||
        bookingDate === "" ||
        bookingTime === ""
    ) {

        showMessage(
            "Please fill all required fields.",
            "error"
        );

        return;
    }

    // ====================================
    // EMAIL VALIDATION
    // ====================================

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }

    // ====================================
    // PHONE VALIDATION
    // ====================================

    const phonePattern =
        /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {

        showMessage(
            "Phone number must be 10 digits.",
            "error"
        );

        return;
    }

    // ====================================
    // DATE VALIDATION
    // ====================================

    const selectedDate =
        new Date(bookingDate);

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {

        showMessage(
            "Please select a future date.",
            "error"
        );

        return;
    }

    // ====================================
    // SUCCESS MESSAGE
    // ====================================

    showMessage(
        "Booking Successful!",
        "success"
    );

    // ====================================
    // PREPARE BOOKING DATA
    // ====================================

    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {

        showMessage(

            "Please login to make a booking",

            "error"

        );

        return;

    }

    const user = JSON.parse(userData);

    const bookingData = {

        user: user.id,
        fullName,
        email,
        phone,
        service,
        trainer,
        bookingDate,
        bookingTime

    };

    // ====================================
    // SEND TO SERVER
    // ====================================

    try {

        const response = await apiCreateBooking(bookingData);

        if (response.success) {

            // SAVE TO LOCAL STORAGE AS BACKUP
            saveBooking(bookingData);

            // RESET FORM
            document.getElementById("bookingForm").reset();

        } else {

            showMessage(

                response.message || 'Booking failed',

                "error"

            );

        }

    } catch (error) {

        console.error('Booking Error:', error);

        // STILL SAVE TO LOCAL STORAGE IF SERVER FAILS
        saveBooking(bookingData);

        showMessage(

            'Booking saved (server connection issue)',

            'warning'

        );

    }

}

/* ====================================
   SAVE BOOKING TO LOCAL STORAGE
==================================== */

function saveBooking(data) {

    let bookings =
        JSON.parse(
            localStorage.getItem("gymBookings")
        ) || [];

    bookings.push(data);

    localStorage.setItem(
        "gymBookings",
        JSON.stringify(bookings)
    );

}

/* ====================================
   SHOW MESSAGE
==================================== */

function showMessage(message, type) {

    // Remove existing message
    const existingMessage =
        document.querySelector(".booking-message");

    if (existingMessage) {

        existingMessage.remove();
    }

    // Create message element
    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        `booking-message ${type}`;

    messageDiv.textContent =
        message;

    // Insert into page
    const bookingContainer =
        document.querySelector(".booking-container");

    bookingContainer.prepend(messageDiv);

    // Auto remove after 4 seconds
    setTimeout(() => {

        messageDiv.remove();

    }, 4000);

}

/* ====================================
   SET MINIMUM DATE
==================================== */

window.addEventListener("load", () => {

    const dateInput =
        document.getElementById("bookingDate");

    if (!dateInput) return;

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    const minDate =
        `${year}-${month}-${day}`;

    dateInput.setAttribute(
        "min",
        minDate
    );

});