const hbs = require("hbs");

hbs.registerHelper("renderNavbar", (user) => {
    if (user === undefined) {
        return new hbs.SafeString(`<li class="nav-item active">
                    <a class="nav-link" href="/login"> Login <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link" href="/signup"> Sign Up <span class="sr-only">(current)</span></a>
                </li>`);
    }
    return new hbs.SafeString(`
    <li class="nav-item active">
        <a class="nav-link" href="/profile"> Profile <span class="sr-only">(current)</span></a>
    </li>
    <li class="nav-item active">
        <a class="nav-link" href="/editProfile"> Edit <span class="sr-only">(current)</span></a>
    </li>
    <li class="nav-item active">
        <a class="nav-link" href="/logout"> Logout <span class="sr-only">(current)</span></a>
    </li>`);
});