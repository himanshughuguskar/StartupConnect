const startupQueue = [];
const investorQueue = [];

/*
 * Normalize role so both:
 * "Startup" / "startup"
 * "Investor" / "investor"
 * are accepted.
 */
function normalizeRole(role) {
    if (!role) {
        return null;
    }

    return String(role).trim().toLowerCase();
}


/*
 * Check whether a socket is already waiting in either queue.
 */
function isUserInQueue(socketId) {

    const inStartupQueue = startupQueue.some(
        user => user.socketId === socketId
    );

    const inInvestorQueue = investorQueue.some(
        user => user.socketId === socketId
    );

    return inStartupQueue || inInvestorQueue;
}


/*
 * Add user to the correct matchmaking queue.
 */
function addUserToQueue(user) {

    if (!user || !user.socketId) {
        return false;
    }

    if (isUserInQueue(user.socketId)) {
        return false;
    }

    const role = normalizeRole(user.role);

    /*
     * Store the normalized role.
     */
    user.role = role;

    if (role === "startup") {

        startupQueue.push(user);

        console.log(
            "Startup added to queue:",
            user.socketId,
            "User ID:",
            user.userId
        );

        console.log(
            "Queue status:",
            getQueueStatus()
        );

        return true;
    }

    if (role === "investor") {

        investorQueue.push(user);

        console.log(
            "Investor added to queue:",
            user.socketId,
            "User ID:",
            user.userId
        );

        console.log(
            "Queue status:",
            getQueueStatus()
        );

        return true;
    }

    console.log(
        "Invalid role received:",
        user.role
    );

    return false;
}


/*
 * Remove a user from whichever queue they are in.
 */
function removeUserFromQueue(socketId) {

    const startupIndex = startupQueue.findIndex(
        user => user.socketId === socketId
    );

    if (startupIndex !== -1) {

        startupQueue.splice(startupIndex, 1);

        console.log(
            "Startup removed:",
            socketId
        );

        console.log(
            "Queue status:",
            getQueueStatus()
        );

        return true;
    }


    const investorIndex = investorQueue.findIndex(
        user => user.socketId === socketId
    );

    if (investorIndex !== -1) {

        investorQueue.splice(investorIndex, 1);

        console.log(
            "Investor removed:",
            socketId
        );

        console.log(
            "Queue status:",
            getQueueStatus()
        );

        return true;
    }

    return false;
}


/*
 * Find a compatible user.
 *
 * Startup  <-> Investor
 */
function findMatch(user) {

    if (!user) {
        return null;
    }

    const role = normalizeRole(user.role);

    /*
     * STARTUP LOOKING FOR INVESTOR
     */
    if (role === "startup") {

        if (investorQueue.length === 0) {

            console.log(
                "No investor available. Startup waiting:",
                user.socketId
            );

            return null;
        }

        const randomIndex = Math.floor(
            Math.random() * investorQueue.length
        );

        const investor =
            investorQueue[randomIndex];


        /*
         * Remove both users from the queues
         * because they are now matched.
         */
        removeUserFromQueue(
            investor.socketId
        );

        removeUserFromQueue(
            user.socketId
        );


        console.log(
            "Matching startup:",
            user.userId,
            "with investor:",
            investor.userId
        );


        return {
            user1: user,
            user2: investor
        };
    }


    /*
     * INVESTOR LOOKING FOR STARTUP
     */
    if (role === "investor") {

        if (startupQueue.length === 0) {

            console.log(
                "No startup available. Investor waiting:",
                user.socketId
            );

            return null;
        }

        const randomIndex = Math.floor(
            Math.random() * startupQueue.length
        );

        const startup =
            startupQueue[randomIndex];


        /*
         * Remove both users from the queues
         * because they are now matched.
         */
        removeUserFromQueue(
            startup.socketId
        );

        removeUserFromQueue(
            user.socketId
        );


        console.log(
            "Matching investor:",
            user.userId,
            "with startup:",
            startup.userId
        );


        return {
            user1: user,
            user2: startup
        };
    }


    console.log(
        "Cannot find match. Invalid role:",
        user.role
    );

    return null;
}


/*
 * Return current queue information.
 */
function getQueueStatus() {

    return {
        startupsWaiting:
            startupQueue.length,

        investorsWaiting:
            investorQueue.length
    };
}


module.exports = {

    addUserToQueue,

    removeUserFromQueue,

    findMatch,

    getQueueStatus,

    isUserInQueue

};