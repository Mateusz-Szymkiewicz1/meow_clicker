let cps = 0;
let score = 0;
window.click_strength = 1;
document.querySelector("#label_strength").innerText = `Stronger click (${window.click_strength})`;
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
        if(window.localStorage.getItem("score")){
            score = parseInt(window.localStorage.getItem("score")); 
            document.querySelector("span").innerText = `MeowCount: ${score}`;
        }
        document.querySelector("#cat_img").addEventListener("click", function(){
            cps++;
            score = parseInt(score+window.click_strength);
            if(score == 2137){
               document.querySelector("canvas").style.display = "block"; 
               document.querySelector("#cat_img").style.animation = "spin 2s infinite"; 
               document.querySelector(".score").style.animation = "spin 2s infinite"; 
               document.querySelector(".cps").style.animation = "spin 2s infinite"; 
            }
            if(document.querySelector("#cat_img").style.transform =="scale(1)"){
                document.querySelector("#cat_img").style.transform = "scale(1.1)"; 
            }else{
                document.querySelector("#cat_img").style.transform = "scale(1)"
            }
            let audio = document.querySelector(".audio_meow").cloneNode(true);
            audio.volume = 0.2;
            audio.play();
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            window.localStorage.setItem("score", score);
        })
        document.body.addEventListener("keyup", function(e){
            cps++;
            if(e.code == "Space"){
            score = parseInt(score+window.click_strength);
            if(score == 2137){
               document.querySelector("canvas").style.display = "block"; 
               document.querySelector("#cat_img").style.animation = "spin 2s infinite"; 
               document.querySelector(".score").style.animation = "spin 2s infinite"; 
               document.querySelector(".cps").style.animation = "spin 2s infinite"; 
            }
            if(document.querySelector("#cat_img").style.transform =="scale(1)"){
                document.querySelector("#cat_img").style.transform = "scale(1.1)"; 
            }else{
                document.querySelector("#cat_img").style.transform = "scale(1)"
            }
            let audio = document.querySelector(".audio_meow").cloneNode(true);
            audio.volume = 0.2;
            audio.play();
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            window.localStorage.setItem("score", score);
        }
        })
        document.querySelector(".reset_btn").addEventListener("click", function(e){
          score = 0;
          document.querySelector(".score").innerText = `MeowCount: ${score}`;
          window.localStorage.setItem("score", score);
            window.click_strength = 1;
            document.location.reload();
        })
        setInterval(function(){
            document.querySelector(".cps").innerText = `CPS: ${cps}`;
            if(cps > 5){
                let rand = Math.floor(randomNumber(2,10));
                document.querySelector(`.audio:nth-of-type(${rand})`).play();
            }
            cps = 0;
        }, 1000)
document.body.addEventListener("click", function(e){
    if(e.target.className == "x_icon"){
        if(e.target.id == "x_open"){
            document.querySelector(".shop").style.animation = "slideInRight 0.5s ease"
            document.querySelector(".shop").style.display = "block";
            document.querySelector(".shop > h3").innerText = score+"C";
        }else{
            document.querySelector(".shop").style.animation = "slideOutRight 0.5s ease"
            setTimeout(function(){
                document.querySelector(".shop").style.display = "none";
            }, 500) 
        }
    }
    if(e.target.className == "buy"){
        if(score >= parseInt(e.target.dataset.price)){
        score = score-parseInt(e.target.dataset.price);
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
          window.localStorage.setItem("score", score);
        document.querySelector(".shop > h3").innerText = score+"C";
        if(e.target.dataset.type == "click_strength"){
            window.click_strength++;
            document.querySelector("#label_strength").innerText = `Stronger click (${window.click_strength})`;
            e.target.dataset.price = parseInt(e.target.dataset.price)+100;
            e.target.innerText = `Buy (${e.target.dataset.price})`;
        }
        if(document.querySelector(".span_bieda")){
            document.querySelector(".span_bieda").remove();
        }
        }else{
            if(!document.querySelector(".span_bieda")){
            document.querySelector(".shop > h3").innerHTML =  document.querySelector(".shop > h3").innerHTML+`<br /><span class="span_bieda">Nie stać cie ;(</span>`;
            }
        }
    }
})
        let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const maxConfettis = 150;
const particles = [];

const possibleColors = [
  "DodgerBlue",
  "OliveDrab",
  "Gold",
  "Pink",
  "SlateBlue",
  "LightBlue",
  "Gold",
  "Violet",
  "PaleGreen",
  "SteelBlue",
  "SandyBrown",
  "Chocolate",
  "Crimson"
];

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
  this.x = Math.random() * W; // x
  this.y = Math.random() * H - H; // y
  this.r = randomFromTo(11, 33); // radius
  this.d = Math.random() * maxConfettis + 11;
  this.color =
    possibleColors[Math.floor(Math.random() * possibleColors.length)];
  this.tilt = Math.floor(Math.random() * 33) - 11;
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  this.tiltAngle = 0;

  this.draw = function() {
    context.beginPath();
    context.lineWidth = this.r / 2;
    context.strokeStyle = this.color;
    context.moveTo(this.x + this.tilt + this.r / 3, this.y);
    context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
    return context.stroke();
  };
}

function Draw() {
  const results = [];

  // Magical recursive functional love
  requestAnimationFrame(Draw);

  context.clearRect(0, 0, W, window.innerHeight);

  for (var i = 0; i < maxConfettis; i++) {
    results.push(particles[i].draw());
  }

  let particle = {};
  let remainingFlakes = 0;
  for (var i = 0; i < maxConfettis; i++) {
    particle = particles[i];

    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
    particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

    if (particle.y <= H) remainingFlakes++;

    // If a confetti has fluttered out of view,
    // bring it back to above the viewport and let if re-fall.
    if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
      particle.x = Math.random() * W;
      particle.y = -30;
      particle.tilt = Math.floor(Math.random() * 10) - 20;
    }
  }

  return results;
}

window.addEventListener(
  "resize",
  function() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },
  false
);

// Push new confetti objects to `particles[]`
for (var i = 0; i < maxConfettis; i++) {
  particles.push(new confettiParticle());
}

// Initialize
canvas.width = W;
canvas.height = H;
Draw();