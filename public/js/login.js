console.log("On login page")

// const getInput = ()=>{
//     const email = document.querySelector('#inputEmail').value;
//     const pwd = document.querySelector('#inputPassword').value;
//     return {email,pwd};
// };

// console.log(getInput());

const login = async (credentials) => {
    console.log(credentials);
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
    localStorage.setItem('TOKEN', JSON.stringify(result.token));

    //retrieve from local storge
    //JSON.parse(localStorage.getItem('TOKEN'))

    return result;
};

document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.querySelector('#inputEmail').value;
    const password = document.querySelector('#inputPassword').value;
    login({ email, password })
        .then(async res => {
            console.log(JSON.parse(localStorage.getItem('TOKEN')));
            await fetch(`/`, {
                method: 'POST',
                body: JSON.stringify(res),
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('TOKEN'))}`
                }
            });
            console.log(res);
            // window.location.href=("/");
        })
        .catch(e => {
            console.log("Error");
        })

});