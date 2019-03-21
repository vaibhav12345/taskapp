const renderAvatar = async () => {
    let profile = await fetch("/api/users/me");
    profile = await profile.json();
    let avatar = await fetch(`/api/users/${profile._id}/avatar`);
    avatar = await avatar.blob();
    const urlCreator = window.URL || window.webkitURL;
    const url = await urlCreator.createObjectURL(avatar);
    document.getElementById("avatar").src = url;
}

renderAvatar();


const editUserProfile = async (credentials) => {
    console.log(credentials);
    try {
        let result = await fetch(`/api/users/update`, {
            method: 'PATCH',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (result.status === 400) {
            throw new Error();
        }

        result = await result.json();
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

        let editObj = {};
        if (email)
            editObj["email"] = email;
        if (password) {
            if (retypePassword !== password)
                throw new Error("Passwords don't match");
            else
                editObj["password"] = password;
        }

        if (name)
            editObj["name"] = name;

        if (age && typeof (parseInt(age)) === "number")
            editObj["age"] = age;

        console.log(editObj);
        let res = await editUserProfile(editObj);
        window.location = "/profile";


    } catch (e) {
        console.log(e);
        window.location = "/editProfile";
    }

});

const upload = async file => {
    const formData = new FormData();
    formData.append("avatar", file);
    
    const options = {
        method: "POST",
        body: formData  //Header is already set beacuse its defined in fetch api so no need to explicity setup header as it causes issues https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
    };
    // delete options["Content-Type"]
    let res = await fetch("/api/users/me/avatar", options);
    return res;
};

document.getElementById("upload").addEventListener("click", e => {
    e.preventDefault();
    let avatar = document.getElementById("inputFile");
    avatar = avatar.files[0];
    // console.log(avatar);
    if (avatar !== undefined) {
        upload(avatar)
            .then(res=>{
                if(res.status===200){
                    // console.log("Rendering new avatar");
                    renderAvatar();
                }
            })
            .catch(e=>{
                console.log(e);
            });
    }

});

document.getElementById("inputEmail").addEventListener("click",e=>{
    e.preventDefault();
    document.getElementById("inputEmail").removeAttribute("readonly");
});