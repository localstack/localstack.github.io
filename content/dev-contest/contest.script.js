function onContestSignup() {
    // get form data
    const form = document.getElementById('contestSignupForm');
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
            headers: {Authorization: 'Bearer p.eyJ1IjogIjAwZDRjYzRjLTg4N2UtNGNmZS05YzY4LTJjNzMyNjE5ODdjMCIsICJpZCI6ICIzMjYzMDFiNy04NmMwLTRiMzAtOGEwZC05NzZjZjAyNzQ2MmYifQ.Zz7EPOp7wODY6ZMh-ls5tp2yrndl51flUOQIT2c1b04'}
        }
    )
        .then(res => res.json())
        .then(data => console.log(data))
        .then(v => alert("ok sent!"))

    // we use jquery for this
    return false;
}

function getFormData() {
    return false;
}

(function () {

    console.log(getSessionId())

    //
    // $("#contestSignupForm").on("submit", function(event) {
    //     console.log($(this).serialize());
    //     var data = JSON.stringify( $(this).serializeArray() ); //  <-----------
    //
    //     console.log( data );
    //     return false; //don't submit
    //     return false;
    // })

})()
