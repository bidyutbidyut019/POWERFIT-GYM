// ====================================
// API CONFIGURATION
// ====================================

const API_BASE_URL = 'http://localhost:5000/api';

/* ====================================
   AUTHENTICATION ENDPOINTS
==================================== */

const AUTH_ENDPOINTS = {

    register: `${API_BASE_URL}/auth/register`,

    login: `${API_BASE_URL}/auth/login`

};

/* ====================================
   BOOKING ENDPOINTS
==================================== */

const BOOKING_ENDPOINTS = {

    getAll: `${API_BASE_URL}/bookings`,

    create: `${API_BASE_URL}/bookings`,

    update: (id) => `${API_BASE_URL}/bookings/${id}`,

    delete: (id) => `${API_BASE_URL}/bookings/${id}`

};

/* ====================================
   MEMBERSHIP ENDPOINTS
==================================== */

const MEMBERSHIP_ENDPOINTS = {

    getAll: `${API_BASE_URL}/memberships`,

    create: `${API_BASE_URL}/memberships`,

    update: (id) => `${API_BASE_URL}/memberships/${id}`,

    delete: (id) => `${API_BASE_URL}/memberships/${id}`

};

/* ====================================
   PAYMENT ENDPOINTS
==================================== */

const PAYMENT_ENDPOINTS = {

    getAll: `${API_BASE_URL}/payments`,

    create: `${API_BASE_URL}/payments`,

    update: (id) => `${API_BASE_URL}/payments/${id}`,

    delete: (id) => `${API_BASE_URL}/payments/${id}`

};

/* ====================================
   TRAINER ENDPOINTS
==================================== */

const TRAINER_ENDPOINTS = {

    getAll: `${API_BASE_URL}/trainers`,

    create: `${API_BASE_URL}/trainers`,

    update: (id) => `${API_BASE_URL}/trainers/${id}`,

    delete: (id) => `${API_BASE_URL}/trainers/${id}`

};

/* ====================================
   GET AUTH TOKEN FROM LOCAL STORAGE
==================================== */

function getAuthToken() {

    return localStorage.getItem('token');

}

/* ====================================
   MAKE API REQUEST WITH AUTH
==================================== */

async function makeRequest(url, options = {}) {

    const token = getAuthToken();

    const headers = {

        'Content-Type': 'application/json',

        ...options.headers

    };

    if (token) {

        headers['Authorization'] = `Bearer ${token}`;

    }

    try {

        const response = await fetch(url, {

            ...options,

            headers

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || 'API Error');

        }

        return data;

    } catch (error) {

        console.error('API Error:', error);

        throw error;

    }

}

/* ====================================
   EXPORT API FUNCTIONS
==================================== */

async function apiRegister(userData) {

    return makeRequest(AUTH_ENDPOINTS.register, {

        method: 'POST',

        body: JSON.stringify(userData)

    });

}

async function apiLogin(credentials) {

    return makeRequest(AUTH_ENDPOINTS.login, {

        method: 'POST',

        body: JSON.stringify(credentials)

    });

}

async function apiCreateBooking(bookingData) {

    return makeRequest(BOOKING_ENDPOINTS.create, {

        method: 'POST',

        body: JSON.stringify(bookingData)

    });

}

async function apiGetBookings() {

    return makeRequest(BOOKING_ENDPOINTS.getAll, {

        method: 'GET'

    });

}

async function apiGetMemberships() {

    return makeRequest(MEMBERSHIP_ENDPOINTS.getAll, {

        method: 'GET'

    });

}

async function apiGetTrainers() {

    return makeRequest(TRAINER_ENDPOINTS.getAll, {

        method: 'GET'

    });

}
