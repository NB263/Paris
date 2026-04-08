//Mettre nombres arabe en romain
function toRoman(num) {
    const romans = {20:"XX", 19:"XIX", 18:"XVIII", 17:"XVII", 16:"XVI", 15:"XV", 14:"XIV", 13:"XIII", 12:"XII", 11:"XI", 10:"X", 9:"IX", 8:"VIII", 7:"VII", 6:"VI", 5:"V", 4:"IV", 3:"III", 2:"II", 1:"I"};
    for (const cle in romans) {
        if (Number(cle) === Number(num)) {
            return romans[cle];
        }
    }
};

//Créer un dictionnaire de 20 0
let indexSlides = Object.fromEntries(
  Array.from({ length: 20 }, (_, x) => [x+1, 0])
);

//Détecter un clic sur un path
var paths = document.querySelectorAll('path.arrondissement');
paths.forEach(function (path) {
    path.addEventListener('click', function () {
        //Remettre toutes les slides à 0 après un clic
        for (let i=1; i<=20; i++){
            indexSlides[i] = 0;
        };
        activerPaths(this);
    });
});

//Afficher le path et le carousel
function activerPaths(arrPath){
    // Supprimer les classes actives des autres éléments
    document.querySelectorAll('.is-active').forEach(function (item) {
        item.classList.remove('is-active');
    });

    // Activer le path cliqué ou suivant
    arrPath.classList.add('is-active');

    // Activer le carrousel correspondant
    var id = arrPath.id.replace('arr', 'carousel-');
    const carousel = document.getElementById(id);
    document.querySelectorAll('.carousel').forEach((c) => c.classList.remove('is-active'));
    carousel.classList.add('is-active');
    
    //Afficher le h1 avec l'arr correspondant
    const paris = "PARIS"
    const h1 = document.querySelector("h1");
    h1.innerHTML = "";
    for (let i = 0; i < paris.length; i++) {
        const lettre = document.createElement("span");
        lettre.innerHTML = paris[i];
        h1.appendChild(lettre);
    };
    
    const tiret = document.createElement("span");
    tiret.innerHTML = " - ";
    h1.appendChild(tiret);
    
    const arrRoman = toRoman(arrPath.id.replace('arr', ''));
    
    for (let i = 0; i < arrRoman.length; i++) {
        const car = document.createElement("span");
        car.innerHTML = arrRoman[i];
        h1.appendChild(car);
    };

    let indexCarousel = arrPath.id.replace('arr', '') - 1;

    const slides = carousel.querySelectorAll(".slide");
    const lieux = document.querySelectorAll(".lieu");
    const prevButton = carousel.querySelector("#prev");
    const nextButton = carousel.querySelector("#next");

    // Fonction pour mettre à jour les slides actives
    const updateSlides = () => {
        slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === indexSlides[indexCarousel+1]);
        });
        lieux.forEach((lieu) => {
            lieu.classList.toggle("active", lieu.id === `${indexCarousel + 1}-${indexSlides[indexCarousel+1] + 1}`);
        });
    };

    // Masquer tous les lieux au chargement
    lieux.forEach((lieu) => {
        lieu.classList.remove('active');
    });

    // Initialisation : activer la première slide et le premier lieu
    updateSlides();

    // Supprimer les anciens listeners des boutons
    prevButton.removeEventListener("click", prevButton.listener);
    nextButton.removeEventListener("click", nextButton.listener);

    //Executer la fonction du bouton "précédent"
    const prevListener = () => {
        //Reculer d'une slide
        if (!(indexSlides[indexCarousel+1] === 0 && indexCarousel === 0)) {indexSlides[indexCarousel+1] --};
        if (indexSlides[indexCarousel+1] < 0) {
            if (indexCarousel > 0){
                //Mettre à la dernière slide du carousel précédent
                indexSlides[indexCarousel] = document.getElementById(`carousel-${indexCarousel}`).querySelectorAll(".slide").length - 1;
                //Activer le path et carousel précédent si on revient avant le premier
                activerPaths(document.getElementById(`arr${indexCarousel}`));
            };    
        }
        //Sinon juste actualiser la slide
        else{updateSlides()};
    };
    //Executer la fonction du bouton "suivant"
    const nextListener = () => {
        //Avancer d'une slide
        if (!(indexSlides[indexCarousel+1] > slides.length - 1 && indexCarousel === 19)) {indexSlides[indexCarousel+1] ++};
        if (indexSlides[indexCarousel+1] > slides.length - 1) {
            if (indexCarousel < 19){
                //Remettre toutes les slides à 0 après un clic
                for (let i=1; i<=20; i++){
                    indexSlides[i] = 0;
                };
                //Activer le path et carousel suivant si on va après le dernier
                activerPaths(document.getElementById(`arr${indexCarousel + 2}`))
            };      
        }
        //Sinon juste actualiser la slide
        else{updateSlides()};
    };

    //Détecter un clic sur un bouton
    prevButton.addEventListener("click", prevListener);
    nextButton.addEventListener("click", nextListener);

    // Sauvegarder les références pour le prochain nettoyage
    prevButton.listener = prevListener;
    nextButton.listener = nextListener;
};