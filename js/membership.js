/* ====================================
   MEMBERSHIP PLAN SYSTEM
==================================== */

// ====================================
// PLAN HIERARCHY (For Upgrades)
// ====================================

const PLAN_HIERARCHY = {
    'Basic': 0,
    'Premium': 1,
    'Elite': 2
};

document.addEventListener(

    'DOMContentLoaded',

    () => {

        // CHECK IF USER IS LOGGED IN

        checkMembershipPageAccess();

        initializeMembershipButtons();

        displayCurrentMembership();

        initializeJoinNowButton();

    }

);

/* ====================================
   CHECK MEMBERSHIP PAGE ACCESS
==================================== */

function checkMembershipPageAccess() {

    const user =
        JSON.parse(

            localStorage.getItem('user')

        );

    const backButton =
        document.getElementById(
            'backToDashboard'
        );

    // IF USER LOGGED IN - SHOW BACK BUTTON

    if (user && backButton) {

        backButton.style.display = 'block';

    }

}

/* ====================================
   DISPLAY CURRENT MEMBERSHIP
==================================== */

async function displayCurrentMembership() {

    const user =
        JSON.parse(

            localStorage.getItem(
                'user'
            )

        );

    // NO USER - SKIP

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

        // NO ACTIVE MEMBERSHIP - USER NEEDS TO CHOOSE ONE

        if (!data.success || !data.data) {

            hideUpgradeTitle();

            return;

        }

        // GET MEMBERSHIP DATA

        const membership =
            data.data;

        // SHOW STATUS SECTION

        const statusDiv =
            document.getElementById(
                'membershipStatus'
            );

        if (statusDiv) {

            statusDiv.style.display =
                'block';

        }

        // CALCULATE DATES

        const approveDate =
            new Date(
                membership.approvedAt ||
                membership.createdAt
            );

        const expiryDate =
            new Date(
                approveDate.getTime() +
                (30 * 24 * 60 * 60 * 1000)
            );

        const today =
            new Date();

        const daysRemaining =
            Math.ceil(
                (expiryDate - today) /
                (1000 * 60 * 60 * 24)
            );

        // UPDATE STATUS BADGE

        const statusBadge =
            document.getElementById(
                'statusBadge'
            );

        if (statusBadge) {

            statusBadge.textContent =
                membership.status ===
                'approved'
                    ? 'Active'
                    : 'Pending';

            statusBadge.className =
                membership.status ===
                'approved'
                    ? 'status-badge active'
                    : 'status-badge pending';

        }

        // UPDATE DETAILS

        document.getElementById(
            'currentPlan'
        ).textContent =
            membership.plan || 'N/A';

        document.getElementById(
            'currentStatus'
        ).textContent =
            membership.status
                .charAt(0)
                .toUpperCase() +
            membership.status
                .slice(1);

        document.getElementById(
            'approvedDate'
        ).textContent =
            approveDate
                .toLocaleDateString();

        document.getElementById(
            'expiryDate'
        ).textContent =
            expiryDate
                .toLocaleDateString();

        document.getElementById(
            'daysRemaining'
        ).textContent =
            daysRemaining > 0
                ? `${daysRemaining} days`
                : 'Expired';

        // ====================================
        // HIDE ALL PLANS NOT FOR UPGRADE
        // ====================================

        hideNonUpgradablePlans(membership.plan);

        // ====================================
        // HIDE COMPARISON & CTA IF ACTIVE
        // ====================================

        if (membership.status === 'approved') {

            const comparisonSection =
                document.querySelector(
                    '.membership-comparison'
                );

            const ctaSection =
                document.querySelector(
                    '.cta-section'
                );

            if (comparisonSection) {

                comparisonSection.style.display =
                    'none';

            }

            if (ctaSection) {

                ctaSection.style.display =
                    'none';

            }

        }

    }

    catch (error) {

        console.log(
            'Error fetching membership:',
            error
        );

        hideUpgradeTitle();

    }

}

/* ====================================
   HIDE UPGRADE TITLE
==================================== */

function hideUpgradeTitle() {

    const upgradeTitle =
        document.getElementById(
            'upgradeOptionsTitle'
        );

    if (upgradeTitle) {

        upgradeTitle.style.display = 'none';

    }

}

/* ====================================
   HIDE NON-UPGRADABLE PLANS
==================================== */

function hideNonUpgradablePlans(currentPlan) {

    const membershipCards =
        document.querySelectorAll(
            '.membership-card'
        );

    const currentPlanLevel =
        PLAN_HIERARCHY[currentPlan] || 0;

    membershipCards.forEach((card) => {

        const cardTitle =
            card.querySelector('h3')?.textContent
                .trim() || '';

        const cardPlanLevel =
            PLAN_HIERARCHY[cardTitle] || 0;

        const button =
            card.querySelector(
                '.choose-plan-btn'
            );

        // DISABLE IF SAME PLAN
        if (cardPlanLevel === currentPlanLevel) {

            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';

            if (button) {
                button.disabled = true;
                button.textContent = 'Current Plan';
                button.style.background =
                    'rgba(100,100,100,0.5)';
                button.style.cursor = 'not-allowed';
            }

        }

        // HIDE IF NOT AN UPGRADE

        else if (cardPlanLevel < currentPlanLevel) {

            card.style.display = 'none';

        }

        else {

            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';

        }

    });

    // CHECK IF ANY UPGRADES AVAILABLE

    const visibleCards =
        Array.from(membershipCards)
            .filter(card => card.style.display !== 'none');

    const upgradeTitle =
        document.getElementById(
            'upgradeOptionsTitle'
        );

    if (visibleCards.length === 0) {

        const membershipsGrid =
            document.querySelector(
                '.memberships-grid'
            );

        if (upgradeTitle) {

            upgradeTitle.style.display = 'none';

        }

        if (membershipsGrid) {

            const noUpgradeMsg =
                document.createElement('div');

            noUpgradeMsg.className =
                'no-upgrades-available';

            noUpgradeMsg.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px 20px;
                color: #666;
                font-size: 18px;
            `;

            let elitePlanName = currentPlan;

            if (currentPlan === 'Premium') {

                elitePlanName = 'Premium Plan';

            }

            else if (currentPlan === 'Elite') {

                elitePlanName = 'Elite Plan';

            }

            noUpgradeMsg.innerHTML = `
                <h3 style="margin-bottom: 10px; color: #333; font-size: 24px;">
                    You have the ${elitePlanName}
                </h3>
                <p style="font-size: 16px;">
                    You already have the highest membership tier available.
                    Enjoy your unlimited access and premium benefits!
                </p>
            `;

            membershipsGrid.innerHTML = '';

            membershipsGrid.appendChild(
                noUpgradeMsg
            );

        }

    }

    else {

        if (upgradeTitle) {

            upgradeTitle.style.display = 'block';

        }

    }

}

function initializeJoinNowButton() {

    const joinBtn =
        document.getElementById(
            'joinNowBtn'
        );

    if (!joinBtn) {

        return;

    }

    joinBtn.addEventListener(

        'click',

        () => {

            const user =
                JSON.parse(

                    localStorage.getItem(
                        'user'
                    )

                );

            // REDIRECT IF NOT LOGGED IN

            if (!user) {

                window.location.href =
                    './register.html';

            }

        }

    );

}

/* ====================================
   INITIALIZE MEMBERSHIP BUTTONS
==================================== */

function initializeMembershipButtons() {

    const chooseButtons =
        document.querySelectorAll(
            '.choose-plan-btn'
        );

    // NO BUTTONS FOUND

    if (!chooseButtons.length) {

        return;

    }

    // LOOP BUTTONS

    chooseButtons.forEach((button) => {

        button.addEventListener(

            'click',

            async () => {

                // ====================================
                // GET USER
                // ====================================

                const user =
                    JSON.parse(

                        localStorage.getItem(
                            'user'
                        )

                    );

                // ====================================
                // LOGIN CHECK
                // ====================================

                if (!user) {

                    alert(
                        'Please login first'
                    );

                    window.location.href =
                        './login.html';

                    return;

                }

                // ====================================
                // GET PLAN DETAILS
                // ====================================

                const selectedPlan =
                    button.getAttribute(
                        'data-plan'
                    );

                const selectedPrice =
                    button.getAttribute(
                        'data-price'
                    );

                // ====================================
                // CHECK CURRENT MEMBERSHIP
                // ====================================

                const currentMembership =
                    document.getElementById(
                        'currentPlan'
                    )?.textContent;

                if (currentMembership === selectedPlan) {

                    alert(
                        `You already have the ${selectedPlan} membership plan.`
                    );

                    return;

                }

                // ====================================
                // CONFIRM PLAN
                // ====================================

                const confirmPlan =
                    confirm(

                        `Do you want to request ${selectedPlan} Membership Plan?`

                    );

                if (!confirmPlan) {

                    return;

                }

                // ====================================
                // CREATE MEMBERSHIP REQUEST
                // ====================================

                try {

                    const response =
                        await fetch(

                            'http://localhost:5000/api/membership-requests',

                            {

                                method: 'POST',

                                headers: {

                                    'Content-Type':
                                        'application/json'

                                },

                                body: JSON.stringify({

                                    userId:
                                        user.id,

                                    userName:
                                        `${user.firstName} ${user.lastName}`,

                                    email:
                                        user.email,

                                    plan:
                                        selectedPlan,

                                    price:
                                        selectedPrice

                                })

                            }

                        );

                    const data =
                        await response.json();

                    // ====================================
                    // SUCCESS
                    // ====================================

                    if (data.success) {

                        alert(

`Thank you for choosing the ${selectedPlan} Membership Plan upgrade.

Plan Price: $${selectedPrice}

Please visit the gym reception and complete your payment.

After payment verification, the admin will approve your upgrade request.`

                        );

                        // OPTIONAL REDIRECT

                        window.location.href =
                            './dashboard.html';

                    }

                    // ====================================
                    // FAILED
                    // ====================================

                    else {

                        alert(
                            data.message
                        );

                    }

                }

                // ====================================
                // ERROR
                // ====================================

                catch (error) {

                    console.log(error);

                    alert(
                        'Membership request failed'
                    );

                }

            }

        );

    });

}