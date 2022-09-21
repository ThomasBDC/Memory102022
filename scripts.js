let jeuTableau;
let allCards = document.querySelectorAll(".card");

allCards.forEach(card => {
    card.addEventListener("click", function(){
        if(card.classList.contains("hidden")){
            card.classList.remove("hidden");
        }
        else{
            card.classList.add("hidden");
        }
    });
})

function generateGameArray(x, y){
    let Tableau = new Array(x);
    for (var i = 0; i < Tableau.length; i++) {
        Tableau[i] = new Array(y);
    }

    jeuTableau = Tableau;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

