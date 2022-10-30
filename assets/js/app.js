function getCookieValue(key) {
    let a = {};
    return document.cookie.split(";").forEach((function (i) {
        let [e, r] = i.split("=");
        a[e.trim()] = r
    })), a[key]
}

function setCookieValue(key, value, maxAge = 1800, path = "/") {
    document.cookie = `${key}=${value}; Max-Age=${maxAge}; path=${path}; secure`
}

// simple session-id tracking (idea from tinybird flock.js)
function getSessionId() {
    const key = "session-id"
    const sessionId = getCookieValue(key) || "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (a => (a ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> a / 4).toString(16)));
    setCookieValue(key, sessionId);
    return sessionId
}
