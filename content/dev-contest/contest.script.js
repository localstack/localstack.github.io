
function toggleLoading(button) {
    button.toggleAttribute('disabled')
    const spinner = button.querySelectorAll('span[role="status"]')[0];
    spinner.toggleAttribute("hidden")
}

function enableInfoContainer() {
    const infoContainer = document.getElementById('contestSignupInfoContainer');
    const formContainer = document.getElementById('contestSignupFormContainer');

    document.getElementById("contest-signup-signupEmail").innerText = getCookieValue("contest-signup-signupEmail")
    document.getElementById("contest-signup-fullName").innerText = getCookieValue("contest-signup-fullName")

    formContainer.classList.add('d-none');
    infoContainer.classList.remove('d-none');
}

function onContestSignup() {
    // get form data
    const form = document.getElementById('contestSignupForm');
    const button = form.querySelectorAll(['button[type="submit"'])[0]
    toggleLoading(button);

    const formData = new FormData(form);
    const payload = {
        "signupEmail": formData.get("signupEmail"),
        "fullName": formData.get("fullName"),
        "hasLocalstackAccount": formData.has("hasLocalstackAccount"),
        "newsletter": formData.has("newsletter"),
    }

    // store signup data
    fetch(
        'https://api.tinybird.co/v0/events?name=analytics_events',
        {
            method: 'POST',
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                session_id: getSessionId(),
                action: "signup",
                version: "1",
                payload: JSON.stringify(payload)
            }),
            headers: { Authorization: 'Bearer p.eyJ1IjogIjAwZDRjYzRjLTg4N2UtNGNmZS05YzY4LTJjNzMyNjE5ODdjMCIsICJpZCI6ICIzMjYzMDFiNy04NmMwLTRiMzAtOGEwZC05NzZjZjAyNzQ2MmYifQ.Zz7EPOp7wODY6ZMh-ls5tp2yrndl51flUOQIT2c1b04' }
        }
    )
        .then(res => {
            if (!res.ok) {
                throw Error(res.status + " " + res.statusText)
            }
            return res.json()
        })
        .then(result => {
            alert(`Thanks ${payload['fullName']}, you're signed up with ${payload['signupEmail']}`);
            setCookieValue("contest-signup-signupEmail", payload['signupEmail'], 21600);
            setCookieValue("contest-signup-fullName", payload['fullName'], 21600);
            enableInfoContainer();
            toggleLoading(button);
        })
        .catch(error => {
            console.log(error);
            alert("Sorry, there was an error with your signup: " + error + ". Please contact us at info@localstack.cloud")
            toggleLoading(button);
        });

    return false;
}

(function () {
    // show the info container if user is already signed up
    if (getCookieValue("contest-signup-signupEmail")) {
        enableInfoContainer();
    }
})();
