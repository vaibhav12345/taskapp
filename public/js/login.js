console.log("On login page")

const getCookieValue = (key) => {
    const cookieArr = document.cookie.split("; ");
    let val = undefined;
    cookieArr.forEach(current => {
        const pair = current.split("=");
        if (pair[0] === key) {
            val = pair[1];
            return;
        }
    });
    return val;
}

const login = async (credentials) => {
    console.log(credentials);
    try {
        let result = await fetch(`/api/users/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (result.status === 400) {
            throw new Error();
        }

        result = await result.json();
        // Put the token in localstorage
        // localStorage.setItem('TOKEN', JSON.stringify(result.token));

        //Put in cookie
        document.cookie = `TOKEN=${result.token}; path=/`;

        //retrieve from local storge
        //JSON.parse(localStorage.getItem('TOKEN'))

        return result;
    } catch (e) {
        throw new Error(e);
    }
};

document.querySelector("form").addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.querySelector('#inputEmail').value;
    const password = document.querySelector('#inputPassword').value;
    try {
        let res = await login({ email, password });
        window.location = "/home";


    } catch (e) {
        window.location = "/login";
    }

});