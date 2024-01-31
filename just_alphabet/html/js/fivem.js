

$(document).ready(function() {

  window.addEventListener('message', function(event) {
    let action = event.data.action;

    if (action === 'startGame') {
      start()
    }
  });

  let lettersArray = [];
  let timeRemaining = 5;
  let gameInterval;

  let success = new Audio('sfx/success.mp3');
  let fail = new Audio('sfx/fail.mp3');

  function generateRandomLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  function updateLetterDivs() {
    for (let i = 1; i <= 15; i++) {
      const letter = generateRandomLetter();
      lettersArray.push(letter);
      document.getElementById(i.toString()).innerText = letter;
      document.getElementById(i.toString()).classList.remove('clicked');
    }
  }

  function handleKeyPress(event) {
    const pressedKey = event.key.toUpperCase();

    if (lettersArray.length > 0 && pressedKey === lettersArray[0]) {
      lettersArray.shift();
      const divId = (15 - lettersArray.length).toString();
      document.getElementById(divId).classList.add('clicked');

      if (lettersArray.length === 0) {
        clearInterval(gameInterval)
        $('.hack-container').fadeOut(500)
        success.currentTime = 0;
        success.play();
        $.post(`https://${GetParentResourceName()}/success`)
        $(".hack-notify").animate({top: '1vw'}, 500);
        $(".hack-status").text("SUCCESS")
        setTimeout(() => {
          $(".hack-notify").animate({top: '-10vw'}, 500);
        }, 1500);
      }
    }
  }

  function updateProgressBar() {
    const progressBar = document.querySelector('.fill');
    progressBar.style.height = (timeRemaining / 6) * 100 + '%';

    if (timeRemaining === 0) {
      clearInterval(gameInterval);
      $.post(`https://${GetParentResourceName()}/failed`)
      fail.currentTime = 0;
      fail.play();
      $('.hack-container').fadeOut(500)
      $(".hack-notify").animate({top: '1vw'}, 500);
      $(".hack-status").text("FAILED")
      setTimeout(() => {
        $(".hack-notify").animate({top: '-10vw'}, 500);
      }, 1500);
    } else {
      timeRemaining--;
    }
  }

  // function resetGame() {
  //   clearInterval(gameInterval);
  //   timeRemaining = 30;
  //   updateLetterDivs();
  //   gameInterval = setInterval(updateProgressBar, 1000);
  // }

  function start() {
    $('.hack-container').fadeIn(500)
    $('.information-before-start').fadeIn(500)
    $('.hack').fadeOut(0)

    setTimeout(() => {
      updateLetterDivs();

      timeRemaining = 6;
      document.addEventListener("keydown", handleKeyPress);
    
      gameInterval = setInterval(updateProgressBar, 1000);
      $('.information-before-start').fadeOut(500)
      $('.hack').fadeIn(500)
    }, 2000);
  }

  // start()

});

