const renderAvatar = async()=>{
    let profile = await fetch("/api/users/me");
    profile = await profile.json();
    let avatar = await fetch(`/api/users/${profile._id}/avatar`);
    avatar = await avatar.blob();
    const urlCreator = window.URL || window.webkitURL;
    const url = await urlCreator.createObjectURL(avatar);
    document.getElementById("avatar").src = url;
}

renderAvatar();