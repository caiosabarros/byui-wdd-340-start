const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
    const updateBtn = document.getElementById("update-vehicle")
    updateBtn.removeAttribute("disabled")
})