/*
TODO LIST

- Compter le nombre de coûts pour gagner (stocker des stats en cookie ?)

*/


//déclarer un tableau de toutes les cartes
let jeuTableau;

let cptClickCurrent = 0;
let CardClickedId;
const cards = ["king", "queen", "valet", "as", "kingPiq", "kingtrefle"];
const gameBoard = document.getElementById("GameBoard");
let nbPairesOnGame;
let cptCartesTrouvees = 0;
const nbCoupsCurrentNode = document.getElementById("NbCoupsCurrent");
const BestScoreNode = document.getElementById("BestScore");
const avgScoreNode = document.getElementById("avgScore");
const BestScoreCookie ="BestScore";
const AllScoresCookie = "AllScores"

let nbCoups = 0;

BestScoreNode.innerText = getCookie(BestScoreCookie)
avgScoreNode.innerText = getAverageNbCoups();

document.getElementById("playButton").addEventListener("click", function(){
    let nbCardInput = document.getElementById("nbCardInput");
    initGame(nbCardInput.value);
});

document.getElementById("masCards").addEventListener("click", function(){
    let nbCardInput = document.getElementById("nbCardInput");
    if(nbCardInput.value < 6){
        nbCardInput.value ++;
    }
});

document.getElementById("menosCards").addEventListener("click", function(){
    let nbCardInput = document.getElementById("nbCardInput");
    if(nbCardInput.value > 2){
        nbCardInput.value --;
    }
});


/*
Cette fonction gère ce qui se passe
quand on clique sur une carte
*/
function clickOnCardEvent(card){
    let allCards = document.querySelectorAll(".card");
    if(card.classList.contains("finded")){
        return;
    }
    cptClickCurrent ++;
    
    if(cptClickCurrent == 1){
        //premier click, je cache les images trouvées avant
        allCards.forEach(card => {
            if(card.classList.contains("finded")){
                //c'est une carte trouvée
            }
            else{
                //pas trouvée, il faut qu'elle soit masquée
                card.classList.add("hidden");
            }
        });
        //j'affiche la carte que je viens de cliquer 
        card.classList.remove("hidden");
        //je stocke la réponse derrière la carte
        CardClickedId = card.id;
    }
    else if(cptClickCurrent == 2){
        //deuxième click, je vérifie si l'image a été trouvée
        if(CardClickedId == card.id){
            cptClickCurrent = 1;
            return;
        }
        else{
            card.classList.remove("hidden");
            let cardClickedBefore = document.getElementById(CardClickedId);
            if(cardClickedBefore.dataset.image == card.dataset.image){
                allCards.forEach(card => {
                    if(card.classList.contains("hidden")){
                        //c'est une carte cachée
                    }
                    else if(!card.classList.contains("finded")){
                        card.classList.add("finded");
                        cptCartesTrouvees++;
                    }
                });
            }
    
            nbCoups++;
            nbCoupsCurrentNode.innerText = nbCoups;
            cptClickCurrent = 0;
            CardClickedId = "";

            if(cptCartesTrouvees == nbPairesOnGame*2){
                //Animation rigolote
                setAnimationWin();
                //Partie terminée, je mets à jour les cookies
                let oldScore = getCookie(AllScoresCookie);
                let allscore = "";
                if(oldScore != null){
                    allscore = oldScore+"."+nbCoups;
                }
                else{
                    allscore = nbCoups;
                }

                setCookie(AllScoresCookie, allscore);
                avgScoreNode.innerText = getAverageNbCoups();
                
                if(nbCoups < getCookie(BestScoreCookie) 
                || getCookie(BestScoreCookie) == null){
                    //On a battu le meilleur score !
                    setCookie(BestScoreCookie, nbCoups);
                    BestScoreNode.innerText = nbCoups;
                    
                    let audio = new Audio("sounds/cheer2.mp3");
                    audio.play();
                }
                else{
                    let audio = new Audio("sounds/applause.mp3");
                    audio.play();
                }
            }
        }
    }
}

function initGame(nbPaires){
    stopAnimation();
    gameBoard.innerHTML = "";
    nbPairesOnGame = nbPaires;
    cptCartesTrouvees = 0;
    nbCoups = 0;
    nbCoupsCurrentNode.innerText = nbCoups;
    let gameCard = [];
    for (let i = 0; i < nbPaires; i++) {
        gameCard.push([cards[i], false]);
        gameCard.push([cards[i], false]);
    }
    console.log(gameCard);

    for(let i = 0; i < gameCard.length; i++){
        let cardIsPositionned = false;
        while(!cardIsPositionned){
            let randomNumber = getRandomArbitrary(0, gameCard.length);
            if(gameCard[randomNumber][1] == false){
                cardIsPositionned = true;
                gameCard[randomNumber][1] = true;
                //Faut générer le code HTML, et l'inclure.
                let cardHtml = getHtmlCodeCard(gameCard[randomNumber][0], i);
                gameBoard.innerHTML += cardHtml;
            }
        }
        
    }

    //Ajouter l'évènement du click
    /*
    J'ajoute l'évènement de click sur toutes les cartes
    */
    let allCards = document.querySelectorAll(".card");
    allCards.forEach(card => {
        card.addEventListener("click", function(){
            clickOnCardEvent(card);  
        });
    });
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getHtmlCodeCard(nomCard, id){
    return `<div class="card hidden" id="${id}" data-image="${nomCard}">
                <img src="img/${nomCard}.png" />
            </div>`;
}

function setAnimationWin(){
    let animateDiv = document.getElementById("allconfettis");
    animateDiv.innerHTML = "";

    for(let i =0; i < 100; i++){
        let confeti = document.createElement("div");
        confeti.classList.add("confetti");
        confeti.style.left = getRandomArbitrary(0,100)+'%';
        confeti.style.animationDelay = 50*i+"ms";
        confeti.style.backgroundColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        animateDiv.appendChild(confeti);
    }
}

function stopAnimation(){
    let animateDiv = document.getElementById("allconfettis");
    animateDiv.innerHTML = "";
}

function setCookie(name, value) {
    // Encode value in order to escape semicolons, commas, and whitespace
    var cookie = name + "=" + encodeURIComponent(value);
    /* Sets the max-age attribute so that the cookie expires
    after the specified number of days */
    cookie += "; max-age=" + (100*24*60*60);
    document.cookie = cookie;
}

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    
    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}

function getAverageNbCoups(){
    let allscore = getCookie(AllScoresCookie);
    if(allscore != null){
        let allScoreTab = allscore.split(".");
        let sum = 0;
        let nbParties = 0;
        allScoreTab.forEach(score => {
            sum += +score;
            nbParties ++;
        });
    
        let moyenne = sum / nbParties;
        return Math.round(moyenne);
    }
    else{
        return 0;
    }
}