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
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  /* console.log('Running cordova-' + cordova.platformId + '@' + cordova.version); */
  /* document.getElementById('deviceready').classList.add('ready'); */

  StatusBar.backgroundColorByHexString("#2b7c9a");

  var element = document.getElementById("version");
  if (typeof element != "undefined" && element != null) {
    element.innerHTML = "Version " + device.version;
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyBwnZ3YiHxT0b_ZndDxjwV2pzWLiqaljGU",
  authDomain: "m335-cf3fc.firebaseapp.com",
  databaseURL: "https://m335-cf3fc.firebaseio.com",
  projectId: "m335-cf3fc",
  storageBucket: "m335-cf3fc.appspot.com",
  messagingSenderId: "35467309357",
  appId: "1:35467309357:web:c32c5d838854bd0e54e3a4",
  measurementId: "G-5TQW8V32T5",
};

firebase.initializeApp(firebaseConfig);

firebase
  .auth()
  .signInAnonymously()
  .then(() => {
    var ref = firebase.database().ref();
    ref.on("value", function (res) {
      var json = res.val();

      var first_name = document.getElementById("first_name");
      if (typeof first_name != "undefined" && first_name != null) {
        first_name.value = json.kunden[0].vorname;
      }
      var last_name = document.getElementById("last_name");
      if (typeof last_name != "undefined" && last_name != null) {
        last_name.value = json.kunden[0].nachname;
      }
      var birthday = document.getElementById("birthday");
      if (typeof birthday != "undefined" && birthday != null) {
        birthday.value = json.kunden[0].geburtstag;
      }
      var password = document.getElementById("password");
      if (typeof password != "undefined" && password != null) {
        password.value = json.kunden[0].password;
      }
      var email = document.getElementById("email");
      if (typeof email != "undefined" && email != null) {
        email.value = json.kunden[0].email;
      }

      var mtpl = $("#myTemplateKonto").html();
      if (typeof mtpl != "undefined" && mtpl != null) {
        json.kunden[0].konten.forEach((element) => {
          if (element.amount < 0) {
            navigator.vibrate(3000);
          }
          var html = Mustache.render(mtpl, element);
          $("tbody").append(html);
        });
      }

      var mtpl = $("#myTemplateKarte").html();
      if (typeof mtpl != "undefined" && mtpl != null) {
        json.kunden[0].kreditkarten.forEach((element) => {
          if (element.spend > element.limit) {
            navigator.vibrate(3000);
          }
          var html = Mustache.render(mtpl, element);
          $("tbody").append(html);
        });
      }

      M.updateTextFields();
    });
  })
  .catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

function login() {
  var first_nameLI = document.getElementById("first_nameLI");
  var passwordLI = document.getElementById("passwordLI");
  var ref = firebase.database().ref();
  ref.on("value", function (res) {
    var json = res.val();
    json.kunden.forEach((element) => {
      if (
        first_nameLI.value === element.vorname &&
        passwordLI.value === element.password
      ) {
        window.location.href = "finanzen.html";
      } else {
        document.getElementById("fehler").innerHTML = "Anmeldedaten falsch";
      }
    });
  });
}

function signin() {
  var count = 0;
  var ref = firebase.database().ref();
  ref.on("value", function (snapshot) {
    var json_elemente = snapshot.val().kunden;
    var keys = Object.keys(json_elemente);
    count = Math.max.apply(null, keys) + 1;
  });

  firebase
    .database()
    .ref("kunden/" + count + "/")
    .set({
      vorname: document.getElementById("first_nameSI").value,
      nachname: document.getElementById("last_nameSI").value,
      password: document.getElementById("passwordSI").value,
      email: document.getElementById("emailSI").value,
      geburtstag: document.getElementById("birthdaySI").value,
      konten: [
        {
          name: "Sparkonto",
          currency: "CHF",
          amount: "0"
        }
      ],
      kreditkarten: [
        {
          currency: "CHF",
          spend: "0",
          limit: "1000"
        }
      ]
    });
  window.location.href = "index.html";
}

function updateuser() {
    var count = 0;
    var ref = firebase.database().ref();
    ref.on("value", function (snapshot) {
      var json = snapshot.val().kunden;
      var keys = Object.keys(json_elemente);
      json.kunden.forEach(element => {
          
      });
    });
  
    firebase
      .database()
      .ref("kunden/" + count + "/")
      .update({
        vorname: document.getElementById("first_name").value,
        nachname: document.getElementById("last_name").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
        geburtstag: document.getElementById("birthday").value
      });
  }

function kontoverwalten(name) {debugger;
    window.location.href = "konto.html";
    var id = 0;
    var ref = firebase.database().ref();
    ref.on("value", function (snapshot) {
      var json = snapshot.val().kunden;
      json.kunden[0].konten.forEach(element => {
          if (element.name !== name){
            id++;
          }
      });
    });

    var kontoname = document.getElementById("kontoname");
    kontoname.value = json.kunden[0].konten[id].name;
    var kontowährung = document.getElementById("kontowährung");
    kontowährung.value = json.kunden[0].konten[id].currency;
    var kontowert = document.getElementById("kontowert");
    kontowert.value = json.kunden[0].konten[id].amount;
      
  }

  function backkonto() {
      debugger;
    window.location.href = "konten.html";
  }

  function kontospeichern(name) {
    var id = 0;
    var ref = firebase.database().ref();
    ref.on("value", function (snapshot) {
      var json = snapshot.val().kunden;
      var keys = Object.keys(json_elemente);
      json.kunden[0].konten.forEach(element => {
          if (element.name !== name){
            id++;
          }
      });
    });
  
    firebase
      .database()
      .ref("kunden/konten/" + id + "/")
      .update({
        name: document.getElementById("kontoname").value,
        amount: document.getElementById("kontowert").value,
        currency: document.getElementById("kontowährung").value
      });
  }