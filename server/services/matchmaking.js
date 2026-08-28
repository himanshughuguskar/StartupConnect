const startupQueue = [];
const investorQueue = [];

function isUserInQueue(socketId) {
    const inStartupQueue = startupQueue.some(
        user => user.socketId === socketId
    );

    const inInvestorQueue = investorQueue.some(
        user => user.socketId === socketId
    );

    return inStartupQueue || inInvestorQueue;
}

function addUserToQueue(user) {
    if (isUserInQueue(user.socketId)) {
        return false;
    }

    if (user.role === "startup") {
        startupQueue.push(user);
        console.log("Startup added to queue:", user.socketId);
        return true;
    }

    if (user.role === "investor") {
        investorQueue.push(user);
        console.log("Investor added to queue:", user.socketId);
        return true;
    }

    return false;
}

function removeUserFromQueue(socketId) {
    const startupIndex = startupQueue.findIndex(
        user => user.socketId === socketId
    );

    if (startupIndex !== -1) {
        startupQueue.splice(startupIndex, 1);
        console.log("Startup removed:", socketId);
        return true;
    }

    const investorIndex = investorQueue.findIndex(
        user => user.socketId === socketId
    );

    if (investorIndex !== -1) {
        investorQueue.splice(investorIndex, 1);
        console.log("Investor removed:", socketId);
        return true;
    }

    return false;
}

function findMatch(user) {
    if (user.role === "startup") {

        if (investorQueue.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(
            Math.random() * investorQueue.length
        );

        const investor = investorQueue[randomIndex];

        removeUserFromQueue(investor.socketId);
        removeUserFromQueue(user.socketId);

        return {
            user1: user,
            user2: investor
        };
    }

    if (user.role === "investor") {

        if (startupQueue.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(
            Math.random() * startupQueue.length
        );

        const startup = startupQueue[randomIndex];

        removeUserFromQueue(startup.socketId);
        removeUserFromQueue(user.socketId);

        return {
            user1: user,
            user2: startup
        };
    }

    return null;
}

function getQueueStatus() {
    return {
        startupsWaiting: startupQueue.length,
        investorsWaiting: investorQueue.length
    };
}

module.exports = {
    addUserToQueue,
    removeUserFromQueue,
    findMatch,
    getQueueStatus,
    isUserInQueue
};