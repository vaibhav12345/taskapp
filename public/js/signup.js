console.log("On signup page");

const signUp = async (credentials) => {
    console.log(credentials);
    try {
        let result = await fetch(`/api/users`, {
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
    try {
        const email = document.querySelector('#inputEmail').value;
        const password = document.querySelector('#inputPassword').value;
        const name = document.querySelector('#inputName').value;
        const retypePassword = document.querySelector('#repeatPassword').value;
        const age = document.querySelector('#inputAge').value;
        if(retypePassword !== password){
            throw new Error("Passwords don't match");
        }
        let res = await signUp({ name, email, password, age });
        window.location = "/home";


    } catch (e) {
        console.log(e);
        // window.location = "/signup";
    }

});