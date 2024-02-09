import "@babel/polyfill"
import { login,logout, signup } from "./login";
import { displayMap } from "./mapBox";
import { settingUser,updatePassword } from "./settings";
import { bookTour } from "./stripe";
const map = document.getElementById("map")
if (map){
    const location = JSON.parse(map.dataset.locations)
    displayMap(location)

}

const Logout = document.querySelector(".nav__el--logout")
if (Logout) Logout.addEventListener("click",logout)

const loginForm = document.querySelector('.form--login');
if (loginForm){
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById("password").value
        login(email,password)
    })
}

const settingForm = document.querySelector(".form-user-data")
if(settingForm){
    settingForm.addEventListener("submit", e => {
        e.preventDefault()
        const form = new FormData()
        form.append('name',document.getElementById('name').value)
        form.append('email',document.getElementById('email').value)
        form.append('photo',document.getElementById('photo').files[0])
        
        settingUser(form)
    })
}

const savePassForm = document.querySelector(".form-user-settings")
if(savePassForm){
    savePassForm.addEventListener("submit",async e => {
        e.preventDefault()
        const passwordCurrent = document.getElementById("password-current").value
        const password = document.getElementById("password").value
        const passwordConfirm = document.getElementById("password-confirm").value
        await updatePassword(passwordCurrent,password,passwordConfirm)

        document.querySelector(".btn--save-pass").textContent = "Update..."

        setTimeout(() => {
            document.querySelector(".btn--save-pass").textContent = "save password"
        },1500);

    }) 
}

const btnBook = document.getElementById("book-tour")
if (btnBook){
    btnBook.addEventListener("click", e => {
        const {tourId} = e.target.dataset
        bookTour(tourId)
    })
}

const btnSignup = document.querySelector(".form--signup")
if (btnSignup){
    btnSignup.addEventListener("submit", e => {
        e.preventDefault()
        const name = document.getElementById("name").value
        const email = document.getElementById('email').value
        const password = document.getElementById("password").value
        const passwordConfirm = document.getElementById("passwordConfirm").value

        signup(name,email,password,passwordConfirm)
    })
}

const check = document.getElementById("menu-toggle")
if (check){
    check.checked = false
    check.addEventListener("change", e => { // Adds an event listener for "change" event
        if (e.target.checked) { // Checks if the checkbox is checked
            const dom = document.querySelector(".user-view__menu"); // Selects the element with class "user-view__menu"
            dom.style.transform = "translateX(0%)"; // Applies a transformation to move the element out of view
        } else{
            const dom = document.querySelector(".user-view__menu"); // Selects the element with class "user-view__menu"
            dom.style.transform = "translateX(-100%)"; 
        }
    });
}
 