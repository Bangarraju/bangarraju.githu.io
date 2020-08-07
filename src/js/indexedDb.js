import 'regenerator-runtime/runtime';
import Service from './service'

//prefixes of implementation that we want to test
// window.indexedDB = window.indexedDB || window.mozIndexedDB || 
// window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || 
window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
window.msIDBKeyRange

if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const service = Service;
let theaterDb;

function initTheaterDb(callback){

    let openRequest = indexedDB.open("theaters", 1);
    
    openRequest.onerror = function (event) {
        console.error("Error", openRequest.error);
    };
    
    openRequest.onsuccess = function (event) {
        console.log('theater db initialized')
        theaterDb = event.target.result;
        callback ? callback(event.target.result) : ''
    };
    
    openRequest.onupgradeneeded = function (event) {
        theaterDb = event.target.result;
        let menuStore = theaterDb.createObjectStore("theater", { keyPath: "name" });
    
        let menu = menuStore.getAll();
    
        if (menu.length) {
            console.log('theater is there already')
        } else {
            console.log('db upgrade needed please reload')
        }
    }
    
}

function addTheaters(theaters) {
    let transaction = theaterDb.transaction('theater', 'readwrite');
    let theaterStore = transaction.objectStore('theater', { keyPath: "name" })
    theaters.map((theater) => {
        theaterStore.add(theater)
    })
}

function getTheaters(callback) {
    initTheaterDb(()=>{
        let transaction = theaterDb.transaction('theater');
        let theaterStore = transaction.objectStore('theater')
        let theaters = theaterStore.getAll();
        theaters.onsuccess = function (event) {
            callback(event.target.result)
        }
    });
}

function updateTheater(theater){
    initTheaterDb(()=>{
        let transaction = theaterDb.transaction(['theater'], 'readwrite');
        let theaterStore = transaction.objectStore('theater')
        let theaterReq = theaterStore.get(theater.name)
        theaterReq.onsuccess = function(event){
            let newTheaterData = event.target.result
            newTheaterData = theater;
            let requestUpdate = theaterStore.put(newTheaterData);
            requestUpdate.onerror = function(event) {
                console.log(event.target.result + " not successfully updated in db")
            };
            requestUpdate.onsuccess = function(event) {
                // Success - the data is updated!
                console.log(event.target.result + " successfully updated in db")
            };
        }
    })
}


function initCitiesDb(callback){
    let cititesDb
    let openRequest = indexedDB.open("cities", 1);
    
    openRequest.onerror = function (event) {
        console.error("Error", openRequest.error);
    };
    
    openRequest.onsuccess = function (event) {
        console.log('cities db initialized')
        cititesDb = event.target.result;
        callback ? callback(cititesDb) : ''
    };
    
    openRequest.onupgradeneeded = function (event) {
        cititesDb = event.target.result;
        let cityStore = cititesDb.createObjectStore("city", { autoIncrement : true });
    
        let citiesReq = cityStore.getAll();
    
        if (citiesReq.length) {
            console.log('theater is there already')
        } else {
            console.log('db upgrade needed please reload')
        }
    }
}

function addCities(citiesData){
    initCitiesDb((db)=>{
        let transaction = db.transaction('city', 'readwrite');
        let store = transaction.objectStore('city', { autoIncrement : true })
        let citiesReq = store.getAll();
        citiesReq.onsuccess = function (event) {
            if(!event.target.result.length){
                citiesData.map((city) => {
                    store.add(city)
                })
            }
        }
        
    })
}

function getCities(callback){
    initCitiesDb((db)=>{
        let transaction = db.transaction('city');
        let store = transaction.objectStore('city')
        let citiesReq = store.getAll();
        citiesReq.onsuccess = function (event) {
            callback(event.target.result)
        }
    })
}

function initUserDb(callback){
    let userDb
    let openRequest = indexedDB.open("users", 1);
    
    openRequest.onerror = function (event) {
        console.error("Error", openRequest.error);
    };
    
    openRequest.onsuccess = function (event) {
        console.log('user db initialized')
        userDb = event.target.result;
        callback ? callback(userDb) : ''
    };
    
    openRequest.onupgradeneeded = function (event) {
        userDb = event.target.result;
        let userStore = userDb.createObjectStore("user", {keyPath: "id"});
    
        let userGetReq = userStore.getAll();
    
        if (userGetReq.length) {
            console.log('user Db is there already')
        } else {
            console.log('db upgrade needed please reload')
        }
    }
}

function addUserData(userData){
    initUserDb((db)=>{
        let transaction = db.transaction('user', 'readwrite');
        let store = transaction.objectStore('user', { keyPath : "id" })
        let userGetReq = store.getAll();
        userGetReq.onsuccess = function (event) {
            if(!event.target.result.length){
                store.add(userData)
            }
        }
    })
}

function getUserData(callback){
    initUserDb((db)=>{
        let transaction = db.transaction('user', 'readwrite');
        let store = transaction.objectStore('user', { keyPath : "id" })
        let userGetReq = store.getAll();
        userGetReq.onsuccess = function (event) {
            callback(event.target.result[0])
        }
    })
}

function deleteUser(userId){
    initUserDb((db)=>{
        let transaction = db.transaction('user', 'readwrite');
        let store = transaction.objectStore('user', { keyPath : "id" })
        let deleteReq = store.delete(userId)
        deleteReq.onsuccess = function (event){
            console.log("deleted "+ event.target.result)
        }
    })
}

export {
    initTheaterDb,
    initCitiesDb,
    initUserDb,
    getTheaters,
    getCities,
    getUserData,
    addCities,
    addTheaters,
    addUserData,
    updateTheater,
    deleteUser
}