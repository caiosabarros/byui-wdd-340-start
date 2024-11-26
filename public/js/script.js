function checkPassword(args) {
    let valid = false;
    let condition = args.value.length >= 12;
    if (condition) {
        // make sure it has an uppercase letter
        let pattern = /[A-Z]/
        valid = pattern.test(args.value);
        // make sure it has a lowercase letter
        pattern = /[a-z]/
        valid = pattern.test(args.value);
        // make sure it has a special symbol
        pattern = /[!@#$%^&*(),.?":{}|<>]/
        valid = pattern.test(args.value);
        // make sure it has a number
        pattern = /\d/
        valid = pattern.test(args.value);
    }
    if (!valid && condition) {
        document.getElementById("invalid-input").style.color = "red";
        document.getElementById("invalid-input").innerHTML = "password must contain at least 12 characters composed of a number, a special, an uppercase and a lowercase character";
        document.getElementById("register-submit").setAttribute("disabled", "true");
    } else if (valid && condition) {
        // clear if non-empty
        document.getElementById("invalid-input").innerHTML = "";
        document.getElementById("register-submit").removeAttribute("disabled");
    }
}