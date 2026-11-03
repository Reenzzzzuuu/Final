var envelope = document.getElementById("envelope");
var hint = document.getElementById("hint");
var start = document.getElementById("start");
var letter = document.getElementById("letter");
var answer = document.getElementById("answer");
var sendBtn = document.getElementById("sendBtn");
var answerBox = document.getElementById("answerBox");
var hintSmall = document.getElementById("hintSmall");

var NTFY_TOPIC = "herreply-qweasdzxc";
var HINT_TEXT = hintSmall.textContent;

envelope.onclick = function () {
  if (envelope.className.indexOf("open") > -1) return;

  envelope.className = "open";
  hint.style.opacity = 0;

  setTimeout(function () {
    start.className = "start gone";
  }, 3000);

  setTimeout(function () {
    letter.className = "show";
  }, 3400);
};

answer.oninput = function () {
  sendBtn.disabled = answer.value.trim() === "";
  hintSmall.textContent = HINT_TEXT;
  hintSmall.style.color = "";
};

function sendToNtfy(text, done) {
  if (NTFY_TOPIC === "") return done(false);

  var finished = false;
  var controller = window.AbortController ? new AbortController() : null;

  function finish(ok) {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    done(ok);
  }

  var timer = setTimeout(function () {
    if (controller) controller.abort();
    finish(false);
  }, 10000);

  var options = {
    method: "POST",
    body: text,
    headers: { "Title": "Kristel replied" }
  };
  if (controller) options.signal = controller.signal;

  fetch("https://ntfy.sh/" + NTFY_TOPIC, options)
    .then(function (res) { finish(res.ok); })
    .catch(function () { finish(false); });
}

sendBtn.onclick = function () {
  var text = answer.value.trim();
  if (text === "") return;

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  sendToNtfy(text, function (ok) {
    if (ok) {
      showThanks();
    } else {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
      hintSmall.textContent = "It didn’t go through. Please check your internet and try again. Your answer is still here.";
      hintSmall.style.color = "#a0301f";
    }
  });
};

function showThanks() {
  answer.readOnly = true;
  sendBtn.style.display = "none";
  hintSmall.style.display = "none";

  var thanks = document.createElement("div");
  thanks.innerHTML =
    "<p style='margin-top:18px'>Thank you for being real with me. You are loved, Kristel, exactly as you are.</p>" +
    "<p>Your Boi Renz</p>";
  answerBox.appendChild(thanks);

  letter.scrollTop = letter.scrollHeight;
}