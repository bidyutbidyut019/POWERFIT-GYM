// ====================================
// BACKEND API URL
// ====================================

const API_URL =
    'https://server-073l.onrender.com/api/auth';

/* ====================================
   REGISTER FORM
==================================== */

const registerForm =
    document.getElementById('registerForm');

if (registerForm) {

    registerForm.addEventListener(

        'submit',

        async (e) => {

            e.preventDefault();

            const password =
                document.getElementById('password').value;

            const confirmPassword =
                document.getElementById('confirmPassword').value;

            // PASSWORD CHECK

            if (password !== confirmPassword) {

                alert('Passwords do not match');

                return;

            }

            // FORM DATA

            const formData = {

                firstName:
                    document.getElementById('firstName').value,

                lastName:
                    document.getElementById('lastName').value,

                email:
                    document.getElementById('email').value,

                phone:
                    document.getElementById('phone').value,

                age:
                    document.getElementById('age').value,

                gender:
                    document.getElementById('gender').value,

                password: password

            };

            try {

                const response = await fetch(

                    `${API_URL}/register`,

                    {

                        method: 'POST',

                        headers: {

                            'Content-Type': 'application/json'

                        },

                        body: JSON.stringify(formData)

                    }

                );

                const data =
                    await response.json();

                console.log(data);

                // SUCCESS

                if (data.success) {

                    alert(
                        'Registration Successful'
                    );

                    // SAVE TOKEN

                    localStorage.setItem(

                        'token',

                        data.token

                    );

                    // SAVE USER

                    localStorage.setItem(

                        'user',

                        JSON.stringify(data.data)

                    );

                    // REDIRECT

                    window.location.href =
                        './login.html';

                } else {

                    alert(data.message);

                }

            } catch (error) {

                console.log(error);

                alert(
                    'Registration Failed'
                );

            }

        }

    );

}

/* ====================================
   LOGIN FORM
==================================== */

const loginForm =
    document.getElementById('loginForm');

if (loginForm) {

    loginForm.addEventListener(

        'submit',

        async (e) => {

            e.preventDefault();

            const formData = {

                email:
                    document.getElementById('email').value,

                password:
                    document.getElementById('password').value

            };

            try {

                const response = await fetch(

                    `${API_URL}/login`,

                    {

                        method: 'POST',

                        headers: {

                            'Content-Type': 'application/json'

                        },

                        body: JSON.stringify(formData)

                    }

                );

                const data =
                    await response.json();

                console.log(data);

                // SUCCESS

                if (data.success) {

                    // SAVE TOKEN

                    localStorage.setItem(

                        'token',

                        data.token

                    );

                    // SAVE USER

                    localStorage.setItem(

                        'user',

                        JSON.stringify(data.data)

                    );

                    alert(
                        'Login Successful'
                    );

                    // ADMIN CHECK

                    if (

                        data.data.role === 'admin'

                    ) {

                        window.location.href =
                            './admin-dashboard.html';

                    } else {

                        window.location.href =
                            './dashboard.html';

                    }

                } else {

                    alert(data.message);

                }

            } catch (error) {

                console.log(error);

                alert(
                    'Login Failed'
                );

            }

        }

    );

}

/* ====================================
   PROFILE MENU SYSTEM
==================================== */

function initializeProfileMenu() {

    const user =
        JSON.parse(
            localStorage.getItem('user')
        );

    // NAV ELEMENTS

    const loginNav =
        document.getElementById('loginNav');

    const registerNav =
        document.getElementById('registerNav');

    const profileNav =
        document.getElementById('profileNav');

    const logoutNav =
        document.getElementById('logoutNav');

    const profileLetter =
        document.getElementById('profileLetter');

    // USER LOGGED IN

    if (user) {

        if (loginNav) {

            loginNav.style.display =
                'none';

        }

        if (registerNav) {

            registerNav.style.display =
                'none';

        }

        if (profileNav) {

            profileNav.style.display =
                'flex';

        }

        if (logoutNav) {

            logoutNav.style.display =
                'flex';

        }

        if (

            profileLetter &&

            user.firstName

        ) {

            profileLetter.innerText =

                user.firstName
                    .charAt(0)
                    .toUpperCase();

        }

    }

    // USER NOT LOGGED IN

    else {

        if (loginNav) {

            loginNav.style.display =
                'block';

        }

        if (registerNav) {

            registerNav.style.display =
                'block';

        }

        if (profileNav) {

            profileNav.style.display =
                'none';

        }

        if (logoutNav) {

            logoutNav.style.display =
                'none';

        }

    }

}

/* ====================================
   LOGOUT FUNCTION
==================================== */

function logoutUser() {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    alert('Logout Successful');

    window.location.href =
        './login.html';

}

/* ====================================
   INITIALIZE PROFILE MENU
==================================== */

initializeProfileMenu();
