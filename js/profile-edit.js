/* ====================================
   PROFILE EDIT SYSTEM
==================================== */

document.addEventListener(

    'DOMContentLoaded',

    () => {

        // CHECK AUTHENTICATION FIRST

        checkUserAuthentication();

        loadUserProfile();

        loadMembershipStatus();

        initializeProfileForm();

    }

);

/* ====================================
   CHECK USER AUTHENTICATION
==================================== */

function checkUserAuthentication() {

    const token =
        localStorage.getItem('token');

    const user =
        localStorage.getItem('user');

    // NOT LOGGED IN - REDIRECT

    if (!token || !user) {

        window.location.href =
            './login.html';

        return;

    }

}

/* ====================================
   LOAD USER PROFILE
==================================== */

function loadUserProfile() {

    const user =
        JSON.parse(

            localStorage.getItem('user')

        );

    // NO USER - SKIP (Already checked above)

    if (!user) {

        return;

    }

    // SET USER INFO

    const firstNameInput =
        document.getElementById(
            'firstName'
        );

    const lastNameInput =
        document.getElementById(
            'lastName'
        );

    const emailInput =
        document.getElementById('email');

    const phoneInput =
        document.getElementById('phone');

    const ageInput =
        document.getElementById('age');

    const genderInput =
        document.getElementById('gender');

    const fullNameElement =
        document.getElementById(
            'fullName'
        );

    const userEmailElement =
        document.getElementById(
            'userEmail'
        );

    const avatarLetterElement =
        document.getElementById(
            'avatarLetter'
        );

    // POPULATE FORM FIELDS

    if (firstNameInput) {

        firstNameInput.value =
            user.firstName || '';

    }

    if (lastNameInput) {

        lastNameInput.value =
            user.lastName || '';

    }

    if (emailInput) {

        emailInput.value =
            user.email || '';

    }

    if (phoneInput) {

        phoneInput.value =
            user.phone || '';

    }

    if (ageInput) {

        ageInput.value =
            user.age || '';

    }

    if (genderInput) {

        genderInput.value =
            user.gender || '';

    }

    // UPDATE HEADER

    if (fullNameElement) {

        fullNameElement.textContent =
            `${user.firstName} ${user.lastName}`;

    }

    if (userEmailElement) {

        userEmailElement.textContent =
            user.email;

    }

    // AVATAR

    if (

        avatarLetterElement &&

        user.firstName

    ) {

        avatarLetterElement.textContent =

            user.firstName
                .charAt(0)
                .toUpperCase();

    }

}

/* ====================================
   INITIALIZE PROFILE FORM
==================================== */

function initializeProfileForm() {

    const profileForm =
        document.getElementById(
            'profileForm'
        );

    if (!profileForm) {

        return;

    }

    profileForm.addEventListener(

        'submit',

        async (e) => {

            e.preventDefault();

            // GET USER

            const user =
                JSON.parse(

                    localStorage.getItem(
                        'user'
                    )

                );

            // GET FORM DATA

            const formData = {

                phone:
                    document.getElementById(
                        'phone'
                    ).value,

                age:
                    parseInt(

                        document.getElementById(
                            'age'
                        ).value

                    ),

                gender:
                    document.getElementById(
                        'gender'
                    ).value

            };

            try {

                // UPDATE USER

                const response =
                    await fetch(

                        `http://localhost:5000/api/users/${user.id}`,

                        {

                            method: 'PUT',

                            headers: {

                                'Content-Type':
                                    'application/json',

                                'Authorization':
                                    `Bearer ${localStorage.getItem('token')}`

                            },

                            body: JSON.stringify(
                                formData
                            )

                        }

                    );

                const data =
                    await response.json();

                // SUCCESS

                if (data.success) {

                    // UPDATE LOCAL STORAGE

                    const updatedUser = {

                        ...user,

                        ...formData

                    };

                    localStorage.setItem(

                        'user',

                        JSON.stringify(
                            updatedUser
                        )

                    );

                    // SHOW SUCCESS

                    showMessage(

                        'success',

                        'Profile updated successfully!'

                    );

                    // RESET FORM

                    setTimeout(

                        () => {

                            profileForm.reset();

                            loadUserProfile();

                        },

                        1500

                    );

                }

                // FAILED

                else {

                    showMessage(

                        'error',

                        data.message ||
                        'Failed to update profile'

                    );

                }

            }

            catch (error) {

                console.log(error);

                showMessage(

                    'error',

                    'Error updating profile'

                );

            }

        }

    );

}

/* ====================================
   SHOW MESSAGE
==================================== */

function showMessage(type, message) {

    const successDiv =
        document.getElementById(
            'successMessage'
        );

    const errorDiv =
        document.getElementById(
            'errorMessage'
        );

    // HIDE ALL

    if (successDiv) {

        successDiv.style.display = 'none';

    }

    if (errorDiv) {

        errorDiv.style.display = 'none';

    }

    // SHOW TYPE

    if (type === 'success' && successDiv) {

        successDiv.textContent = message;

        successDiv.style.display = 'block';

        setTimeout(

            () => {

                successDiv.style.display =
                    'none';

            },

            3000

        );

    }

    if (type === 'error' && errorDiv) {

        errorDiv.textContent = message;

        errorDiv.style.display = 'block';

        setTimeout(

            () => {

                errorDiv.style.display =
                    'none';

            },

            3000

        );

    }

}

/* ====================================
   LOAD MEMBERSHIP STATUS
==================================== */

async function loadMembershipStatus() {

    const user =
        JSON.parse(
            localStorage.getItem('user')
        );

    if (!user) {
        return;
    }

    try {

        const response =
            await fetch(

                `http://localhost:5000/api/memberships/user/${user.id}`,

                {

                    headers: {

                        'Authorization':
                            `Bearer ${localStorage.getItem('token')}`

                    }

                }

            );

        const data =
            await response.json();

        if (data.success && data.data) {

            const membership = data.data;
            const membershipSection =
                document.getElementById(
                    'membershipSection'
                );

            if (membershipSection) {

                membershipSection.style.display =
                    'flex';

                // Set membership plan
                const planElement =
                    document.getElementById(
                        'membershipPlan'
                    );

                if (planElement) {
                    planElement.textContent =
                        membership.plan || 'None';
                }

                // Set status
                const statusElement =
                    document.getElementById(
                        'membershipStatus'
                    );

                if (statusElement) {
                    const statusText =
                        membership.status ===
                        'approved'
                            ? 'Active'
                            : 'Pending Approval';

                    statusElement.textContent =
                        `Status: ${statusText}`;
                }

                // Set expiry date
                const expiryElement =
                    document.getElementById(
                        'membershipExpiry'
                    );

                if (expiryElement && membership.approvedAt) {

                    const expiryDate =
                        new Date(
                            membership.approvedAt
                        );

                    expiryDate.setMonth(
                        expiryDate.getMonth() + 1
                    );

                    expiryElement.textContent =
                        `Expires: ${expiryDate.toLocaleDateString()}`;

                }

            }

        }

    }

    catch (error) {

        console.log(
            'Error loading membership:',
            error
        );

    }

}
