/*
TODO LIST

- Gérer l'aléatoire dans le placement des images
- Pouvoir choisir le nombre de cartes en jeu
- Gérer les débuts et fin de partie
- Ajouter une animation (confeti) lors de victoire 
- Pouvoir relancer une partie
- Gérer le bug du click deux fois sur une même image
- Compter le nombre de coûts pour gagner (stocker des stats en cookie ?)

*/


//déclarer un tableau de toutes les cartes
let jeuTableau;
let allCards = document.querySelectorAll(".card");
let cptClickCurrent = 0;
let dataImageShowed;

allCards.forEach(card => {
    card.addEventListener("click", function(){
        playGame(card);  
    });
});

function playGame(card){
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
        dataImageShowed = card.dataset.image;
    }
    else if(cptClickCurrent == 2){
        //deuxième click, je vérifie si l'image a été trouvée
        card.classList.remove("hidden");
        if(dataImageShowed == card.dataset.image){
            allCards.forEach(card => {
                if(card.classList.contains("hidden")){
                    //c'est une carte cachée
                }
                else{
                    card.classList.add("finded");
                }
            });
        }

        cptClickCurrent = 0;
        dataImageShowed = "";

        //Compter les cards qui n'ont pas la classe 'finded'
        //si = 0 alors on a gagné, le jeu est fini
    }
}