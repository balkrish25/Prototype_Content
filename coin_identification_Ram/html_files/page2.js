window.addEventListener("load", () => {
  const text =
    "There are two types of money. This type of money is called coins. This type of money is called notes. You can use both coins or notes to pay for things.";

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1; // normal speed
  utterance.pitch = 1;
  utterance.lang = "en-IN"; // Indian English accent
  setTimeout(() => {
    speechSynthesis.speak(utterance);
  }, 800); // starts reading after 0.8 sec
});
