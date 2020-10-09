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
      M.updateTextFields();
      var mtpl = $("#myTemplateKonto").html();
      if (typeof mtpl != "undefined" && mtpl != null) {
        json.kunden[0].konten.forEach((element) => {
          if (parseInt(element.amount) < 0) {
            alert("You spend more than you have.");
            navigator.vibrate(3000);
            navigator.notification.beep(2);
          }
          var html = Mustache.render(mtpl, element);
          $("tbody").append(html);
        });
      }

      var mtpl = $("#myTemplateKarte").html();
      if (typeof mtpl != "undefined" && mtpl != null) {
        json.kunden[0].kreditkarten.forEach((element) => {
          if (parseInt(element.spend) > parseInt(element.limit)) {
            alert("You spend more than you can.");
            navigator.vibrate(3000);
            navigator.notification.beep(2);
          }
          var html = Mustache.render(mtpl, element);
          $("tbody").append(html);
        });
      }

      $(".modal").modal();

      $(".editK").click(function (e) {
        e.preventDefault();
        var currency = $(this).attr("data-currency");
        var id = 0;
        var ref = firebase.database().ref();
        ref.on("value", function (snapshot) {
          var json = snapshot.val();
          for (
            let index = 0;
            index < json.kunden[0].kreditkarten.length;
            index++
          ) {
            console.log(json.kunden[0].kreditkarten[index]);
            if (json.kunden[0].kreditkarten[index].currency == currency) {
              id = index;
            }
          }
        });
        $("#modat_titel").html("Edit credit card");
        $("#modat_inhalt").load("karte.html", function () {
          $("#kartenausgaben").val(json.kunden[0].kreditkarten[id].spend);
          $("#kartenwährung").val(json.kunden[0].kreditkarten[id].currency);
          $("#kartenlimite").val(json.kunden[0].kreditkarten[id].limit);
          M.updateTextFields();
          var mymodal = M.Modal.getInstance($(".modal"));
          mymodal.open();
          $("#cancel").click(function () {
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
          $("#speichernK").click(function () {
            var id = 0;
            var currency = document.getElementById("kartenwährung").value;
            var ref = firebase.database().ref();
            ref.on("value", function (snapshot) {
              var json = snapshot.val();
              for (
                let index = 0;
                index < json.kunden[0].kreditkarten.length;
                index++
              ) {
                console.log(json.kunden[0].kreditkarten[index]);
                if (json.kunden[0].kreditkarten[index].currency == currency) {
                  id = index;
                }
              }
            });
            firebase
              .database()
              .ref("kunden/" + 0 + "/kreditkarten/" + id + "/")
              .update({
                spend: document.getElementById("kartenausgaben").value,
                limit: document.getElementById("kartenlimite").value,
              });
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
          $("#deletK").click(function () {
            var id = 0;
            var currency = document.getElementById("kartenwährung").value;
            var ref = firebase.database().ref();
            ref.on("value", function (snapshot) {
              var json = snapshot.val();
              for (
                let index = 0;
                index < json.kunden[0].kreditkarten.length;
                index++
              ) {
                console.log(json.kunden[0].kreditkarten[index]);
                if (json.kunden[0].kreditkarten[index].currency == currency) {
                  id = index;
                }
              }
            });
            firebase
              .database()
              .ref("kunden/" + 0 + "/kreditkarten/" + id + "/")
              .remove();
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
        });
      });

      $(".edit").click(function (e) {
        e.preventDefault();
        var name = $(this).attr("data-Name");
        var id = 0;
        var ref = firebase.database().ref();
        ref.on("value", function (snapshot) {
          var json = snapshot.val();
          for (let index = 0; index < json.kunden[0].konten.length; index++) {
            console.log(json.kunden[0].konten[index]);
            if (json.kunden[0].konten[index].name == name) {
              id = index;
            }
          }
        });
        $("#modat_titel").html("Edit account");
        $("#modat_inhalt").load("konto.html", function () {
          $("#kontoname").val(json.kunden[0].konten[id].name);
          $("#kontowährung").val(json.kunden[0].konten[id].currency);
          $("#kontowert").val(json.kunden[0].konten[id].amount);
          M.updateTextFields();
          var mymodal = M.Modal.getInstance($(".modal"));
          mymodal.open();
          $("#cancel").click(function () {
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
          $("#speichern").click(function () {
            var id = 0;
            var name = document.getElementById("kontoname").value;
            var ref = firebase.database().ref();
            ref.on("value", function (snapshot) {
              var json = snapshot.val();
              for (
                let index = 0;
                index < json.kunden[0].konten.length;
                index++
              ) {
                console.log(json.kunden[0].konten[index]);
                if (json.kunden[0].konten[index].name == name) {
                  id = index;
                }
              }
            });
            firebase
              .database()
              .ref("kunden/" + 0 + "/konten/" + id + "/")
              .update({
                amount: document.getElementById("kontowert").value,
              });
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
          $("#delet").click(function () {
            var id = 0;
            var name = document.getElementById("kontoname").value;
            var ref = firebase.database().ref();
            ref.on("value", function (snapshot) {
              var json = snapshot.val();
              for (
                let index = 0;
                index < json.kunden[0].konten.length;
                index++
              ) {
                console.log(json.kunden[0].konten[index]);
                if (json.kunden[0].konten[index].name == name) {
                  id = index;
                }
              }
            });
            firebase
              .database()
              .ref("kunden/" + 0 + "/konten/" + id + "/")
              .remove();
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
        });
      });

      $("#newKonto").click(function (e) {
        e.preventDefault();
        $("#modat_titel").html("Create account");
        $("#modat_inhalt").load("kontoNeu.html", function () {
          M.updateTextFields();
          var mymodal = M.Modal.getInstance($(".modal"));
          mymodal.open();
          $("#cancel").click(function () {
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
          $("#speichernKKN").click(function () {
            var id = 0;
            var ref = firebase.database().ref();
            ref.on("value", function (snapshot) {
              var json = snapshot.val();
              json.kunden[0].konten.forEach((element) => {
                if (element.name !== name) {
                  id++;
                }
              });
            });
            firebase
              .database()
              .ref("kunden/" + 0 + "/konten/" + id + "/")
              .set({
                name: document.getElementById("kontonameKKN").value,
                currency: document.getElementById("kontowährungKKN").value,
                amount: document.getElementById("kontowertKKN").value,
              });
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
        });
      });

      $("#newKarte").click(function (e) {
        e.preventDefault();
        $("#modat_titel").html("Create credit card");
        $("#modat_inhalt").load("karteNeu.html", function () {
          M.updateTextFields();
          var mymodal = M.Modal.getInstance($(".modal"));
          mymodal.open();
          $("#cancel").click(function () {
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
          $("#speichernKN").click(function () {
            var id = 0;
            var ref = firebase.database().ref();
            ref.on("value", function (snapshot) {
              var json = snapshot.val();
              json.kunden[0].kreditkarten.forEach((element) => {
                if (element.name !== name) {
                  id++;
                }
              });
            });
            firebase
              .database()
              .ref("kunden/" + 0 + "/kreditkarten/" + id + "/")
              .set({
                currency: document.getElementById("kartenwährungKN").value,
                spend: document.getElementById("kartenausgabenKN").value,
                limit: document.getElementById("kartenlimiteKN").value,
              });
            var mymodal = M.Modal.getInstance($(".modal"));
            mymodal.close();
          });
        });
      });
    });
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
        document.getElementById("fehler").innerHTML = "Wrong name or password";
      }
    });
  });
}

function signin() {
  var id = 0;
  var ref = firebase.database().ref();
  ref.on("value", function (snapshot) {
    var json_elemente = snapshot.val().kunden;
    var keys = Object.keys(json_elemente);
    id = Math.max.apply(null, keys) + 1;
  });

  firebase
    .database()
    .ref("kunden/" + id + "/")
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
          amount: "0",
        },
      ],
      kreditkarten: [
        {
          currency: "CHF",
          spend: "0",
          limit: "1000",
        },
      ],
    });
  window.location.href = "index.html";
}

function updateuser() {
  var id = 0;
  var ref = firebase.database().ref();
  ref.on("value", function (snapshot) {
    var json = snapshot.val().kunden;
    var keys = Object.keys(json_elemente);
    json.kunden.forEach((element) => {});
  });

  firebase
    .database()
    .ref("kunden/" + id + "/")
    .update({
      vorname: document.getElementById("first_name").value,
      nachname: document.getElementById("last_name").value,
      password: document.getElementById("password").value,
      email: document.getElementById("email").value,
      geburtstag: document.getElementById("birthday").value,
    });
}
