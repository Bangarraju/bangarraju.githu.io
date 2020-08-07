import Service from './service';
import {initUserDb, addUserData} from './indexedDb'

import '../styles/login.scss'

const service = Service;

initUserDb();

//Find the user with credentials entered
function validateUser() {
    const url = "http://localhost:3000/users";
    let formdata = new FormData(login);
    let userName = formdata.get('userName');
    let password = formdata.get('password');
    let userFound = false;
    service.get(url, handleRequest)
    function handleRequest(status, data) {
        if (status == 200) {
            if (data.length) {
                data.map((user) => {
                    if (user.name == userName && user.password == password) {
                        addUserData(user)
                        document.getElementById('errorMessage').innerText = ""
                        window.open('index.html', '_self') //after user found redirect to index.html
                        userFound = true;
                    }
                })
            }else{
                console.log("User data is not found")
            }
        }else{
            console.log("error" + status + " " +data)
        }
    }
    if (!userFound) {
        document.getElementById('errorMessage').innerText = "* Incorrect username or password. Please try again"
    }

}

//validating form whether it is filled or not
function validateForm() {
    //form Data using form element
    let form = document.forms["loginForm"];
    let userName = form["userName"].value;
    let password = form["password"].value;
   
    if (userName !== "" && password !== "" ) {
        const userRegex = /[=%"]/g
        //valiate password regex to select one UpperCase, one Lowercase, one digit, special character and minimum 8 character length
        const pswdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g
        if(userName.match(userRegex)){
            document.getElementById('errorUser').innerText = "* User name is not valid"
            return false;
        }
        if(!password.match(pswdRegex)){
            document.getElementById('errorPswd').innerText = "* Password must contains one uppercase letter, one lowercase letter, one special Character, minimum 8 character length"
            return false

        }
        document.getElementById('errorUser').innerText ="";
        document.getElementById('errorPswd').innerText = "";
        return true;
        
    } else {
        //validating userName whether it is filles=d or not
        (userName == "" || userName == null) ? addClassToElement('userName','required','errorUser')
                                                    : removeClassToElement('userName','required'); 
        //validating password item whether it is selected or not
        (password == "" || password == null) ? addClassToElement('password','required','errorPswd')
                                            : removeClassToElement('password','required');

        return false;
    }
    function addClassToElement(ElementName, className,errorElementId){
        form[ElementName].classList.add(className);
        document.getElementById(errorElementId).innerText = "* This field is required";
    }
    function removeClassToElement(ElementName,className,errorElementId){
        form[ElementName].classList.remove(className);
        document.getElementById(errorElementId).innerText ="";
    }
}

window.onload = function () {
    //form on submit
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            validateUser();
        }
    }

    //onblur on text field
    $("input[type='text']").on("blur",function(){
        if(this.value){
            this.classList.remove('required')
            document.getElementById('errorUser').innerText ="";
        }else{
            this.classList.add('required')
        }
    })
    //onblur on password field
    $("input[type='password']").on("blur",function(){
        if(this.value){
            this.classList.remove('required')
            document.getElementById('errorPswd').innerText ="";
        }else{
            this.classList.add('required')
        }
    })
}
