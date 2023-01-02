let cps = 0;
let score = 0;
window.click_strength = 1;
window.idle_clicks = 0;
window.skins = ["robert"];
window.current_skin = "robert";
document.querySelector("#label_strength").innerText = `Stronger click (${window.click_strength})`;
document.querySelector("#label_idle").innerText = `Auto clicking (${window.idle_clicks})`;
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
if(window.localStorage.getItem("score")){
            let json = JSON.parse(window.localStorage.getItem("score"));
            score = parseInt(json.score);
            window.click_strength = parseInt(json.click_strength);
            document.querySelector("#label_strength").innerText = `Stronger click (${window.click_strength})`;
            document.querySelector("#buy_strength").innerText = `Buy (${window.click_strength*100})`;
            document.querySelector("#buy_strength").dataset.price = window.click_strength*100;
            window.idle_clicks = parseInt(json.idle_clicks);
            document.querySelector("#label_idle").innerText = `Stronger click (${window.idle_clicks})`;
            document.querySelector("#buy_idle").innerText = `Buy (${(window.idle_clicks+1)*200})`;
            document.querySelector("#buy_idle").dataset.price = (window.idle_clicks+1)*200;
            document.querySelector("span").innerText = `MeowCount: ${score}`;
            window.skins = json.skins;
            window.current_skin = json.current_skin;
}
document.querySelector("#cat_img").src = `images/${window.current_skin}.jpg`;
skiny_check();
function skiny_check(){
    document.querySelectorAll(".skin").forEach(el => {
        window.skins.forEach(e => {
          if(el.dataset.name == e){
              el.querySelector(".skin_buy").setAttribute("style", "pointer-events: none;filter: contrast(0.5);");
              el.querySelector(".skin_buy").innerText = "Posiadasz";
              el.dataset.state = 1;
              if(el.dataset.name == window.current_skin){
                el.querySelector(".skin_set").setAttribute("style", "pointer-events: none;filter: contrast(0.5);");
                el.querySelector(".skin_set").innerText = "Ustawiony";
            }else{
                el.querySelector(".skin_set").setAttribute("style", "pointer-events: auto;filter: contrast(1);");
                el.querySelector(".skin_set").innerText = "Ustaw";
            }
          }
        })
        if(el.dataset.state == 0){
            el.querySelector(".skin_set").setAttribute("style", "pointer-events: none;filter: contrast(0.5);");
        }
    })
}
function save(){
  window.localStorage.setItem("score", JSON.stringify({
    score: score,
    click_strength: window.click_strength,
    idle_clicks: window.idle_clicks,
    skins: window.skins,
      current_skin: window.current_skin,
  }));
}
function click_effect(e){
  let div = document.createElement("div");
  div.classList.add("random_div");
  div.innerText = `+${window.click_strength}`;
  div.setAttribute("style", `position: absolute; top: ${e.clientY}px;left: ${e.clientX}px;`);
  document.body.appendChild(div);
  setTimeout(function(){
    div.remove();
  }, 500)
}
async function decision(){
  return new Promise(function(resolve, reject){
    let decision = document.createElement("div");
    decision.classList.add("decision");
    decision.innerHTML = `<span>Na pewno?</span><br /><button id="button_tak">TAK</button><button id="button_nie">NIE</button>`;
    document.body.appendChild(decision);
    decision.style.animation = "slideInDown 0.5s ease";
    document.querySelector("#button_tak").addEventListener("click", function(){
      resolve();
    })
    document.querySelector("#button_nie").addEventListener("click", function(){
      reject();
    })
  })
}
        document.querySelector("#cat_img").addEventListener("click", function(e){
            cps++;
            score = parseInt(score+window.click_strength);
            if(score == 100000){
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
            click_effect(e);
            let audio = document.querySelector(".audio_meow").cloneNode(true);
            audio.volume = 0.2;
            audio.play();
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            document.querySelector(".shop > h3").innerText = score+"C";
            document.querySelector(".skiny > h3").innerText = score+"C";
            save();
        })
        document.body.addEventListener("keyup", function(e){
            cps++;
            if(e.code == "Space"){
            score = parseInt(score+window.click_strength);
            if(score == 100000){
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
            document.querySelector(".shop > h3").innerText = score+"C";
            document.querySelector(".skiny > h3").innerText = score+"C";
            save();
        }
        })
        document.querySelector(".reset_btn").addEventListener("click", async function(e){
          await decision().then(function(){
            score = 0;
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            window.localStorage.removeItem("score");
              window.click_strength = 1;
              document.location.reload();
          }, function(){
            document.querySelector(".decision").style.animation = "slideOutUp 0.5s ease";
            setTimeout(function(){
              document.querySelector(".decision").remove();
            }, 500)
          });
        })
        setInterval(function(){
            document.querySelector(".cps").innerText = `CPS: ${cps}`;
            if(cps > 5){
                let rand = Math.floor(randomNumber(2,10));
                document.querySelector(`.audio:nth-of-type(${rand})`).play();
            }
            cps = 0;
        }, 1000)
      if(window.idle_clicks > 0){
        window.interval = setInterval(function(){
            score++;
           save();
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            document.querySelector(".shop > h3").innerText = score+"C";
            document.querySelector(".skiny > h3").innerText = score+"C";
            if(score == 100000){
              document.querySelector("canvas").style.display = "block"; 
              document.querySelector("#cat_img").style.animation = "spin 2s infinite"; 
              document.querySelector(".score").style.animation = "spin 2s infinite"; 
              document.querySelector(".cps").style.animation = "spin 2s infinite"; 
              clearInterval(window.interval);
           }
        }, 1000/window.idle_clicks)
      }
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
      if(e.target.className == "x_icon_skins"){
        if(e.target.id == "span_skins"){
            document.querySelector(".skiny").style.animation = "slideInRight 0.5s ease"
            document.querySelector(".skiny").style.display = "block";
            document.querySelector(".skiny > h3").innerText = score+"C";
        }else{
            document.querySelector(".skiny").style.animation = "slideOutRight 0.5s ease"
            setTimeout(function(){
                document.querySelector(".skiny").style.display = "none";
            }, 500) 
        }
    }
    if(e.target.className == "buy"){
        if(score >= parseInt(e.target.dataset.price)){
        score = score-parseInt(e.target.dataset.price);
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
         save();
        document.querySelector(".shop > h3").innerText = score+"C";
        if(e.target.dataset.type == "click_strength"){
            window.click_strength++;
            document.querySelector("#label_strength").innerText = `Stronger click (${window.click_strength})`;
            e.target.dataset.price = parseInt(e.target.dataset.price)+100;
            e.target.innerText = `Buy (${e.target.dataset.price})`;
        }
        if(e.target.dataset.type == "idle_clicks"){
          window.idle_clicks++;
          document.querySelector("#label_idle").innerText = `Auto clicking (${window.idle_clicks})`;
          e.target.dataset.price = parseInt(e.target.dataset.price)+200;
          e.target.innerText = `Buy (${e.target.dataset.price})`;
         if(window.interval){
          clearInterval(window.interval);
         }
          window.interval = setInterval(function(){
            score++;
            save();
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            document.querySelector(".shop > h3").innerText = score+"C";
            document.querySelector(".skiny > h3").innerText = score+"C";
            if(score == 100000){
              document.querySelector("canvas").style.display = "block"; 
              document.querySelector("#cat_img").style.animation = "spin 2s infinite"; 
              document.querySelector(".score").style.animation = "spin 2s infinite"; 
              document.querySelector(".cps").style.animation = "spin 2s infinite"; 
              clearInterval(window.interval);
           }
        }, 1000/window.idle_clicks)
      }
        if(document.querySelector(".span_bieda")){
            document.querySelector(".span_bieda").remove();
        }
        }else{
            if(!document.querySelector(".span_bieda")){
            document.querySelector(".shop > h3").innerHTML =  document.querySelector(".shop > h3").innerHTML+`<br /><span class="span_bieda">Nie stać cie ;(</span>`;
            document.querySelector(".shop > h3").style.animation = "shake 1s ease";
            setTimeout(function(){
              document.querySelector(".shop > h3").style.animation = "none";
            }, 1000)
            }else{
              document.querySelector(".shop > h3").style.animation = "shake 1s ease";
              setTimeout(function(){
                document.querySelector(".shop > h3").style.animation = "none";
              }, 1000)
            }
        }
        e.target.blur();
    }
    if(e.target.className == "skin_buy"){
        if(score >= e.target.dataset.price){
            window.skins.push(e.target.parentElement.dataset.name);
            score -= e.target.dataset.price;
            skiny_check();
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            document.querySelector(".shop > h3").innerText = score+"C";
            document.querySelector(".skiny > h3").innerText = score+"C";
            save();
        }else{
           if(!document.querySelector(".span_bieda")){
            document.querySelector(".skiny > h3").innerHTML =  document.querySelector(".skiny > h3").innerHTML+`<br /><span class="span_bieda">Nie stać cie ;(</span>`;
            document.querySelector(".skiny > h3").style.animation = "shake 1s ease";
            setTimeout(function(){
              document.querySelector(".skiny > h3").style.animation = "none";
            }, 1000)
            }else{
              document.querySelector(".skiny > h3").style.animation = "shake 1s ease";
              setTimeout(function(){
                document.querySelector(".skiny > h3").style.animation = "none";
              }, 1000)
            } 
        }
        e.target.blur();
    }
    if(e.target.className == "skin_set"){
        window.current_skin = e.target.parentElement.dataset.name;
        document.querySelector("#cat_img").src = `images/${e.target.parentElement.dataset.name}.jpg`;
        save();
        skiny_check();
        e.target.blur();
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

function myFunction(x) {
  if (x.matches) { // If media query matches
    document.querySelector("#x_open").innerHTML = '<i class="fa fa-shopping-cart" style="pointer-events: none;"></i>';
    document.querySelector("#span_skins").innerHTML = '<i class="fa fa-paint-brush" style="pointer-events: none;"></i>';
  } else {
    document.querySelector("#x_open").innerHTML = "SKLEP";
    document.querySelector("#span_skins").innerHTML = "SKINY";
  }
}

var x = window.matchMedia("(max-width: 630px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes