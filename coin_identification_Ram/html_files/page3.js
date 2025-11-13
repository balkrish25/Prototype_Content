window.addEventListener("load", () => {
    setTimeout(() => {
        let speech = new SpeechSynthesisUtterance("Learn the coins");
        speech.lang = "en-IN";
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
    }, 500);
});
