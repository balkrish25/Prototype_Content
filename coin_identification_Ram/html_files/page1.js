// window.addEventListener("load", () => {
//   // Wait for 0.5 seconds, then speak
//   setTimeout(() => {
//     const msg = new SpeechSynthesisUtterance("Let's learn about money!");
//     msg.rate = 0.7; // slower for clarity
//     msg.pitch = 1;
//     window.speechSynthesis.speak(msg);
//   },500); // 500ms = 0.5 second
// });


window.addEventListener("load", () => {
  const text =
    "Let's learn about money!";

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1; // normal speed
  utterance.pitch = 1;
  utterance.lang = "en-IN"; // Indian English accent
  setTimeout(() => {
    speechSynthesis.speak(utterance);
  }, 800); // starts reading after 0.8 sec
});
