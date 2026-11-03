var envelope = document.getElementById("envelope");
var hint = document.getElementById("hint");
var start = document.getElementById("start");
var letter = document.getElementById("letter");

letter.innerHTML = [
  '<h1>Hi, Kristel.</h1>',
  '<p>This is from your boi,and it’s from the heart. Take your time.</p>',
  '<p>I already told you how I feel. And I asked you, what if you take a chance with me? What if we try? You told me you can’t, because you know yourself, and you’re afraid you’ll hurt me. I understand that fear, and I don’t take it lightly. For me, it felt like I had nothing to lose. I was willing to take the risk rather than regret it later.</p>',
  '<p>You told me you don’t want to cut off our communication, and that you only want us to be friends. I have no problem with that. You matter to me, and that doesn’t depend on anything you give back. I’m staying.</p>',
  '<p>I just want to understand your side. I get that it’s because of your trauma and all, but the part where you said you know yourself, what do you mean by that? I just want everything between us to be clear. And I respect whatever you decide.</p>',
  '<p>You can be open with me about how you feel, whether it’s about me or about us, whatever it is. You don’t have to say it perfectly or have it all figured out. I won’t judge you or make you feel small. You’re safe with me, and I’ll always be here.</p>',
  '<p>Also, tell me if it’s okay or not for me to keep pursuing you even though you don’t feel the same, because who knows, it might work out, or things between us might change. But if it’s not okay, that’s no problem for me. I just want you to be honest with me. Anything is okay to say, even “I don’t know” or “I’m not ready.” Nothing you write can break this.</p>',
  '<div id="answerBox">',
  '<textarea id="answer" placeholder="Write anything here…"></textarea>',
  '<small id="hintSmall">You need to write something before you can send it, but any honest answer counts.</small>',
  '<button class="go" id="sendBtn" type="button" disabled>Send</button>',
  '</div>'
].join("");

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
