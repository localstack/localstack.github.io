// simple session-id tracking (idea from tinybird flock.js)
function sessionIdFromCookie() {
    const i = 'session-id'
    let a = {};
    return document.cookie.split(";").forEach((function (i) {
        let [e, r] = i.split("=");
        a[e.trim()] = r
    })), a[i]
}

function getSessionId() {
    const id = sessionIdFromCookie() || "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (a => (a ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> a / 4).toString(16)));
    document.cookie = `session-id=${id}; Max-Age=1800; path=/; secure`
    return id
}
