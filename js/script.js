const landingPage = document.querySelector("#landing-page");
const createPage = document.querySelector("#create-room-page");
const joinPage = document.querySelector("#join-room-page");
const roomPage = document.querySelector("#room-page");

const createFormButton = document.querySelector("#create-form-button");
const joinFormButton = document.querySelector("#join-form-button");
const goBackButton = document.querySelector("#go-back-button");

const playNewYouTubeVideo = document.querySelector("#play-video");

function createWarningMessage(message) {
  const warningMessage = document.querySelector("#create-warning");
  warningMessage.innerHTML = message;
  const warningInterval = setInterval(() => {
    warningMessage.innerHTML = "";
    clearInterval(warningInterval);
  }, 2000);
  return;
}

function joinWarningMessage(message) {
  const warningMessage = document.querySelector("#join-warning");
  warningMessage.innerHTML = message;
  const warningInterval = setInterval(() => {
    warningMessage.innerHTML = "";
    clearInterval(warningInterval);
  }, 2000);
  return;
}

function showCopiedToClipboard() {
  const text = document.querySelector("#copied-to-clipboard");
  text.innerHTML = "Copied to Clipboard";
  const textInterval = setInterval(() => {
    text.innerHTML = "";
    clearInterval(textInterval);
  }, 1000);
  return;
}

document.addEventListener("click", function (event) {
  if (event.target.id == "create-form-button") {
    landingPage.style.display = "none";
    createPage.style.display = "flex";
  }

  if (event.target.id == "create-room-button") {
    const roomName = document.querySelector("#roomname").value;
    const videoURL = document.querySelector("#youtube-link").value;
    if (roomName.length == 0) {
      createWarningMessage("Please fill in the roomname field");
    } else {
      if (
        videoURL.length == 0 ||
        document.querySelector("#creator-username").value.length == 0
      ) {
        createWarningMessage("Please fill in all the fields");
      } else {
        localStorage.setItem("roomName", roomName);
        localStorage.setItem(
          "username",
          document.querySelector("#creator-username").value
        );
        localStorage.setItem("videoURl", videoURL);
        const roomCode = roomCodifier(
          5,
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        );
        getEmbedLink(document.querySelector("#youtube-link").value);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          roomName: roomName,
          roomCode: roomCode,
          videoURL: videoURL,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        try {
          fetch("http://localhost:3333/create", requestOptions).then(
            async (result) => {
              const resp = await result.json();
              if (resp.message == "success") {
                localStorage.setItem("roomCode", roomCode);
                createPage.style.display = "none";
                document.title = `WatchRoom - ${roomName}`;
                document.querySelector("#room-code-text").value = `${roomCode}`;
                document.querySelector("#current-youtube-link").value = `${
                  document.querySelector("#youtube-link").value
                }`;
                roomPage.style.display = "block";
              }
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  if (event.target.id == "join-form-button") {
    landingPage.style.display = "none";
    joinPage.style.display = "flex";
  }

  if (event.target.id == "join-room-button") {
    const inputRoomCode = document.querySelector("#roomcode").value;
    if (inputRoomCode.length == 0) {
      joinWarningMessage("Please fill in the roomcode field");
    } else {
      if (document.querySelector("#join-username").value.length == 0) {
        joinWarningMessage("Please fill in the username field");
      } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          roomCode: inputRoomCode,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        try {
          fetch("http://localhost:3333/join", requestOptions).then(
            async (result) => {
              const resp = await result.json();
              if (resp.message != "success") {
                document.getElementById("join-warning").innerHTML =
                  resp.message;
              } else {
                document.getElementById("join-warning").innerHTML = "";

                localStorage.setItem("roomCode", inputRoomCode);
                localStorage.setItem(
                  "username",
                  document.getElementById("join-username").value
                );
                createPage.style.display = "none";
                joinPage.style.display = "none";
                roomPage.style.display = "block";
                document.title = `WatchRoom - ${resp.roomName}`;
                document.querySelector(
                  "#room-code-text"
                ).value = `${resp.roomCode}`;
                document.querySelector("#current-youtube-link").value =
                  resp.videoURL;
                getEmbedLink(resp.videoURL);
              }
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
  if (event.target.id == "go-back-button") {
    joinPage.style.display = "none";
    createPage.style.display = "none";
    landingPage.style.display = "flex";
  }

  if (event.target.type == "submit") {
    console.log(document.querySelector("#current-youtube-link").value);
  }
});

playNewYouTubeVideo.addEventListener("click", () => {
  getEmbedLink(document.querySelector("#current-youtube-link").value);
});

const showTextCopiedToClipboard = document
  .querySelector("#room-code-text")
  .addEventListener("click", () => {
    const text = document.querySelector("#room-code-text").value;
    navigator.clipboard.writeText(text);
    showCopiedToClipboard();
  });

function getId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

function getEmbedLink(youtubeURL) {
  const videoId = getId(youtubeURL);
  document.querySelector(
    "iframe"
  ).src = `https://www.youtube.com/embed/${videoId}`;
  return;
}

function roomCodifier(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
