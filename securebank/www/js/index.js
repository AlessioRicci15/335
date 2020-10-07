/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    /* document.getElementById('deviceready').classList.add('ready'); */

    StatusBar.backgroundColorByHexString("#2b7c9a");

    var element = document.getElementById("version");
 
    if(typeof(element) != 'undefined' && element != null){
        element.innerHTML = "Version " + device.version;
    }
    
    const firebaseConfig = {
        apiKey: "AIzaSyBwnZ3YiHxT0b_ZndDxjwV2pzWLiqaljGU",
        authDomain: "m335-cf3fc.firebaseapp.com",
        databaseURL: "https://m335-cf3fc.firebaseio.com",
        projectId: "m335-cf3fc",
        storageBucket: "m335-cf3fc.appspot.com",
        messagingSenderId: "35467309357",
        appId: "1:35467309357:web:c32c5d838854bd0e54e3a4",
        measurementId: "G-5TQW8V32T5"
      };

      firebase.initializeApp(firebaseConfig);

      firebase.auth().signInAnonymously().then(()=>{

        var ref = firebase.database().ref();
        ref.on("value", function (res) {
            var json = res.val();

            var first_name = document.getElementById("first_name");
            if(typeof(first_name) != 'undefined' && first_name != null){
                first_name.value = json.kunden[0].vorname;
            }
            var last_name = document.getElementById("last_name"); 
            if(typeof(last_name) != 'undefined' && last_name != null){
                last_name.value = json.kunden[0].nachname;
            }
            var birthday = document.getElementById("birthday"); 
            if(typeof(birthday) != 'undefined' && birthday != null){
                birthday.value = json.kunden[0].geburtstag;
            }
            var password = document.getElementById("password");
            if(typeof(password) != 'undefined' && password != null){
                password.value = json.kunden[0].password;
            }
            var email = document.getElementById("email");   
            if(typeof(email) != 'undefined' && email != null){ 
                email.value = json.kunden[0].email;
            }
            
            var mtpl = $("#myTemplateKonto").html();
            if(typeof(mtpl) != 'undefined' && mtpl != null){ 
                json.kunden[0].konten.forEach(element => {
                    if (element.amount < 0) {
                        navigator.vibrate(3000);
                    }
                    var html = Mustache.render(mtpl, element);
                    $("tbody").append(html);
                });
            }   

            var mtpl = $("#myTemplateKarte").html();
            if(typeof(mtpl) != 'undefined' && mtpl != null){ 
                json.kunden[0].kreditkarten.forEach(element => {
                    if (element.spend > element.limit) {
                        navigator.vibrate(3000);
                    }
                    var html = Mustache.render(mtpl, element);
                    $("tbody").append(html);
                });
            } 

            M.updateTextFields();
        })

      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
    });

}