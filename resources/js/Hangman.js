
class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service.herokuapp.com/.sh?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  async start(difficulty, next) {
    // get word and set it to the class's this.word
    // clear canvas
    // draw base
    // reset this.guesses to empty array
    // reset this.isOver to false
    // reset this.didWin to false
    //TODO get correct word
   this.word = await this.getRandomWord(difficulty);
   this.word = this.word.toLowerCase();
   //this.word = 'testing'.toLowerCase();
    this.clearCanvas();
    this.drawBase();
    this.guesses = [];
    this.wrongGuesses = 0;
    this.isOver = false;
    this.didWin = false;
     next();
  }
  /**
   *
   * @param {string} letter the guessed letter.
   */
  // Check if nothing was provided and throw an error if so
  guess(letter) {
    this.error = '';
    if (letter === '' || letter === null){
      this.error = 'Please enter a letter to guess with';
    }
    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    else if(!/^[a-zA-Z]+$/.test(letter)){
      this.error = 'Only letters A-Z can be accepted';
    }
    // Check if more than one letter was provided. throw an error if it is.
    else if(letter.trim().length > 1){
      this.error = 'You may only guess one letter at a time'
    }
    // if it's a letter, convert it to lower case for consistency.
    else{
      let character = letter.toLowerCase();
       // check if this.guesses includes the letter. Throw an error if it has been guessed already.
       if(this.guesses.includes(character)){
         this.error = 'You have already guessed this letter';
       }
       else{
            // add the new letter to the guesses array.
         this.guesses.push(character)
             // check if the word includes the guessed letter:
         if(this.word.includes(character)){
               //    if it's is call checkWin()
           this.checkWin();
         }
         else{
              //    if it's not call onWrongGuess()
           this.onWrongGuess();
         }
       }
    }
   
  }

  checkWin() {
    // using the word and the guesses array, figure out how many remaining unknowns.
    let correctChars = 0;
    let totalChars = this.uniqueCharCount(this.word);
    var s;
    for(s of this.guesses){
  if(this.word.includes(s)){
  correctChars++
    }
  }
  let remainingUnknowns = totalChars - correctChars;
  // if zero, set both didWin, and isOver to true
  if(remainingUnknowns == 0){
  this.didWin = true;
  this.isOver = true;
  }
     
}

uniqueCharCount(word){
  let buffer = "";
  let i;
  for (i = 0; i < word.length; i++) {
      if (!buffer.includes(String.valueOf(word.charAt(i)))) {
          buffer += word.charAt(i);
      }
  }
  return buffer.length;
}

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    this.wrongGuesses++;
    switch(this.wrongGuesses){
      case 1:
        this.drawHead();
        break;
        case 2:
        this.drawBody();
        break;
        case 3:
        this.drawRightArm();
         break;
        case 4:
        this.drawLeftArm();
        break;
        case 5:
        this.drawRightLeg();
        break;
        case 6:
        this.drawLeftLeg();
        this.isOver = true;
        this.didWin = false;
        break;
    }
  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
   var  wordHolderArray = [];
   var tempLetter = '';
   var i;
   for (i = 0; i < this.word.length; i++) 
    {
     tempLetter = this.word.charAt(i);
     if(this.guesses.includes(tempLetter)){
        wordHolderArray.push(tempLetter);
       }
       else{
        wordHolderArray.push('_');
       }
      }
      return wordHolderArray.join(' ');
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    let text = `Previous Guesses: ${this.guesses.join(', ')}`;
    return text;
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 95, 10); // Top
    this.ctx.fillRect(180, 10, 10, 88); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {
    this.ctx.beginPath(); 
    this.ctx.arc(180,120,23,0,Math.PI*2,false); 
    this.ctx.closePath(); 
    this.ctx.stroke(); }

  drawBody() {this.ctx.moveTo(180,143); 
    this.ctx.lineTo(180,248); 
    this.ctx.stroke(); }

  drawLeftArm() {this.ctx.moveTo(180,175); 
    this.ctx.lineTo(142,167); 
    this.ctx.stroke(); }

  drawRightArm() {this.ctx.moveTo(180,175); 
    this.ctx.lineTo(218,167); 
    this.ctx.stroke(); }

  drawLeftLeg() {this.ctx.moveTo(180,245); 
    this.ctx.lineTo(145,270); 
    this.ctx.stroke(); }

  drawRightLeg() {this.ctx.moveTo(180,245); 
    this.ctx.lineTo(215,270); 
    this.ctx.stroke(); }
}
