//declaration des variables et listes utilies, initialisation de la position de départ
var direction = 'right', head = 'M16', score = 0, applePos = "D30", add = 0, nextCorrect = true;

const alphabet = [0, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 0];

var position = ['M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16'];

// ecoute des touches et réactions
document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    switch (e.key) {
        case "Right":
        case "ArrowRight":
            if (direction != "left") {
                direction = 'right';
            }
            break;
            
        case "Left":
        case "ArrowLeft":
            if (direction != "right") {
                direction = 'left';
            }
            break;
            
        case "Up":
        case "ArrowUp":
            if (direction != "down") {
                direction = 'up';
            }
            break;
            
        case "Down":
        case "ArrowDown":
            if (direction != "up") {
                direction = 'down';
            }
            break;
            
        case "Enter":
            reload();
            break;
    }
}

// première actualisation de la grille etappel des fonctions toutes les 0.1s
update();
setInterval(main, 120);
function main() {
    // fonction qui actualise la position du serpent
    walk();
    // fonction qui place les pommes et actualise le score
    apple();
    // fonction qui actualise la grille de jeux après les modifications précédentes
    update();
}

// fonction qui actualise la position du serpent
// selon la direction choisie et la position de la tête on affecte une nouvelle tête
// puis on passe à une nouvelle fonction qui valide la position
function walk() {
    var x, y, next, posAlph;
    if (nextCorrect == true) {
        switch (direction) {
            case "right":
                //nouvelle tête
                x = xy(head)[0] + 1;
                y = xy(head)[1];
                // verification
                verifWalk(x, y);
                break;
            case "left":
                x = xy(head)[0] - 1;
                y = xy(head)[1];
                verifWalk(x, y);
                break;
            case "up":
                x = xy(head)[0];
                y = xy(head)[1];
                // l'axe y est alphabétique, on utilise donc une fonction et la liste de l'alphabet
                posAlph = posAlpha(y);
                y = alphabet[posAlph - 1];
                verifWalk(x, y);
                break;
            case "down":
                x = xy(head)[0];
                y = xy(head)[1];
                posAlph = posAlpha(y);
                y = alphabet[posAlph + 1];
                verifWalk(x, y);
                break;
        }
    }
}

// fonction qui transforme l'id html/css en coordonnées avec un x digitale et un y alphabétique
function xy(coo) {
    var sp = coo.split('');
    y = sp[0];
    if (coo.length == 3) {
        x = sp[1] + sp[2];
    } else {
        x = sp[1];
    }
    res = [parseFloat(x), y];
    return res;
}

// fonction servant pour l'axe y
function posAlpha(y) {
    for (var i = 0; i < alphabet.length; i++) {
        if (alphabet[i] == y) {
            var pos = i;
        }
    }
    return pos;
}

// fonction qui vérifie la validité de la position et actualise la liste de postition si c'est correct
function verifWalk(x, y) {
    // combination des coordonnées pour créer un id compatible avec html/css
    next = y + x.toString();
    // validation
    nextCorrect = isCorrect(x, y, next);
    // actualisation de la position
    if (nextCorrect == true) {
        head = next;
        let newLength = position.push(next);
        if (add == 0) {
            let first = position.shift();
        } else {
            add = add - 1;
        }
    }
}

// la sous fonction qui vérifie les conditions
function isCorrect(x, y, yx) {
    ans = true;
    // verifie si on est encore dans la grille
    if (x < 1 || x > 40 || y == 0) { ans = false; document.body.style.backgroundColor = '#e84118'; }
    // verifie s'il y a une collision entre la tête et le corps
    for (let i in position) {
        if (position[i] == yx) {
            ans = false;
            document.body.style.backgroundColor = '#e84118';
        }
    }
    return (ans);
}

//actualisation de la grille de jeux (cubes dont on change les couleurs css)
function update() {
    var cubes = document.getElementsByClassName("cube");
    for (var i = 0; i < cubes.length; i++) {
        cubes[i].style.backgroundColor = "#353b48";
    }
    document.getElementById(applePos).style.backgroundColor = '#e84118';
    for (let j in position) {
        document.getElementById(position[j]).style.backgroundColor = '#4cd137';
    }
}

// fonction qui place les pommes et actualise le score
// une pomme est déjà placée lors de l'initiatisation, la fonction entre en jeux alors uniquement lorsqu'une pomme est mangée
function apple() {
    if (head == applePos) {
        // on incrémente le score
        score++;
        // on actualise le score
        document.getElementById("score").innerHTML = "Score : " + score.toString();
        // on assigne une nouvelle position à la pomme
        applePos = randPos();
        // on ajoute deux carrés au serpent
        add = add + 5;
    }
}
// renvoie une position aléatoire qui ne soit pas sur le serpent
function randPos() {
    do {
        var ok = true;
        // composée d'un x aléatoire entre 1 et 40
        x = getRandomInt(1, 41);
        // et d'un y aléatoire entre A et Z
        y = alphabet[getRandomInt(1, 27)];
        var nextApple = y + x.toString();
        for (let i in position) {
            if (position[i] == nextApple) {
                ok = false;
            }
        }
    } while (ok == false);
    return nextApple;
}

// fonction aléatoire acceptant un minimum inclue et un maximum exclue
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// fonction qui actualise la page sans la recharger (appeler par la touche enter ou le clique du bouton recommencer)
function reload() {
    window.location = window.location;
}