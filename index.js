// Otworzenie gry - domyślne wartości
let cps = 0;
let score = 0;
window.volume = 1;
window.theme = "light";
window.click_strength = 1;
window.idle_clicks = 0;
window.skins = ["robert"];
window.strength_buff_active = false;
window.current_skin_buff = "";
window.current_skin_buff_amount = 0;
window.skin_buff_strength = 0;
window.has_skin_buff_auto_click = 0;
window.current_skin = "robert";
document.querySelector("#label_strength").innerText = `Stronger click (${window.click_strength})`;
document.querySelector("#label_idle").innerText = `Auto clicking (${window.idle_clicks})`;

// Losowa liczba z przedziału
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pobranie zapisu gry
function get_saved_info() {
    if (window.localStorage.getItem("score")) {
        let json = JSON.parse(window.localStorage.getItem("score"));
        score = parseInt(json.score);
        window.click_strength = parseInt(json.click_strength);
        document.querySelector("#label_strength").innerText = `Stronger click (${window.click_strength})`;
        document.querySelector("#buy_strength").innerText = `Buy (${window.click_strength*100})`;
        document.querySelector("#buy_strength").dataset.price = window.click_strength * 100;
        document.querySelector("#buy_strength_buff").dataset.price = window.click_strength * 2 * 50;
        document.querySelector("#buy_strength_buff").innerText = `BUY (${window.click_strength*2*50})`;
        window.idle_clicks = parseInt(json.idle_clicks);
        document.querySelector("#label_idle").innerText = `Auto clicking (${window.idle_clicks})`;
        document.querySelector("#buy_idle").innerText = `Buy (${(window.idle_clicks+1)*200})`;
        document.querySelector("#buy_idle").dataset.price = (window.idle_clicks + 1) * 200;
        document.querySelector("span").innerText = `MeowCount: ${score}`;
        window.skins = json.skins;
        window.current_skin = json.current_skin;
        window.skin_buff_strength = parseInt(json.skin_buff_strength);
        window.has_skin_buff_auto_click = parseInt(json.has_skin_buff_auto_click);
        if(window.has_skin_buff_auto_click){
            window.skin_buff_auto_click = setInterval(function(){
                score++;
                save();
                document.querySelector(".score").innerText = `MeowCount: ${score}`;
                document.querySelector(".shop > h3").innerText = score + "C";
                document.querySelector(".skiny > h3").innerText = score + "C";
            },1000/window.has_skin_buff_auto_click)
        }
    }
    if (window.localStorage.getItem("meow_settings")) {
        let json = JSON.parse(window.localStorage.getItem("meow_settings"));
        window.volume = json.volume;
        window.theme = json.theme;
        document.querySelector(".settings > input").value = window.volume * 100;
        if (window.theme == "dark") {
            document.querySelector(".theme_switch").removeAttribute("checked");
            dark_theme();
        }
    }
}
get_saved_info();

// Ustawienie skina
document.querySelector("#cat_img").src = `images/${window.current_skin}.jpg`;

// Sprawdzanie statusu skinów przy otwieraniu sklepu
function skiny_check() {
    document.querySelectorAll(".skin").forEach(el => {
        window.skins.forEach(e => {
            if (el.dataset.name == e) {
                el.querySelector(".skin_buy").setAttribute("style", "pointer-events: none;filter: contrast(0.5);");
                el.querySelector(".skin_buy").innerText = "Posiadasz";
                el.dataset.state = 1;
                if (el.dataset.name == window.current_skin) {
                    el.querySelector(".skin_set").setAttribute("style", "pointer-events: none;filter: contrast(0.5);");
                    el.querySelector(".skin_set").innerText = "Ustawiony";
                } else {
                    el.querySelector(".skin_set").setAttribute("style", "pointer-events: auto;filter: contrast(1);");
                    el.querySelector(".skin_set").innerText = "Ustaw";
                }
            }
        })
        if (el.dataset.state == 0) {
            el.querySelector(".skin_set").setAttribute("style", "pointer-events: none;filter: contrast(0.5);");
        }
    })
}
skiny_check();

// Zapisanie stanu gry
function save() {
    let strength = window.click_strength;
    let skin_buff_strength = window.skin_buff_strength;
    if (window.strength_buff_active) {
        strength = strength / 2;
        skin_buff_strength = skin_buff_strength/2;
    }
    window.localStorage.setItem("score", JSON.stringify({
        score: score,
        click_strength: strength,
        idle_clicks: window.idle_clicks,
        skins: window.skins,
        current_skin: window.current_skin,
        skin_buff_strength: skin_buff_strength,
        has_skin_buff_auto_click: window.has_skin_buff_auto_click,
    }));
}

// Zapisanie ustawień
function save_settings() {
    window.localStorage.setItem("meow_settings", JSON.stringify({
        volume: window.volume,
        theme: window.theme,
    }));
}

// Wyskakujące cyferki przy klikaniu na kotka
function click_effect(e) {
    let div = document.createElement("div");
    div.classList.add("random_div");
    div.innerText = `+${window.click_strength+window.skin_buff_strength}`;
    div.setAttribute("style", `position: absolute; top: ${e.clientY}px;left: ${e.clientX}px;`);
    document.body.appendChild(div);
    setTimeout(function () {
        div.remove();
    }, 500)
}

// Okienko "Na pewno?"
async function decision() {
    return new Promise(function (resolve, reject) {
        let decision = document.createElement("div");
        decision.classList.add("decision");
        decision.innerHTML = `<span>Na pewno?</span><br /><button id="button_tak">TAK</button><button id="button_nie">NIE</button>`;
        document.body.appendChild(decision);
        decision.style.animation = "slideInDown 0.5s ease";
        document.querySelector("#button_tak").addEventListener("click", function () {
            resolve();
        })
        document.querySelector("#button_nie").addEventListener("click", function () {
            reject();
        })
    })
}

// Kod wykonany przy kliknięciu na kotka/spacji
function click_handler(e){
    cps++;
    score = parseInt(score + window.click_strength + window.skin_buff_strength);
    if (document.querySelector("#cat_img").style.transform == "scale(1)") {
        document.querySelector("#cat_img").style.transform = "scale(1.1)";
    } else {
        document.querySelector("#cat_img").style.transform = "scale(1)"
    }
    let audio = document.querySelector(".audio_meow").cloneNode(true);
    audio.volume = 0.4 * window.volume;
    audio.play();
    document.querySelector(".score").innerText = `MeowCount: ${score}`;
    document.querySelector(".shop > h3").innerText = score + "C";
    document.querySelector(".skiny > h3").innerText = score + "C";
    save();
}

// Zdarzenie - kliknięcie kotka
document.querySelector("#cat_img").addEventListener("click", function (e) {
    click_handler(e);
    click_effect(e);
})

// Zdarzenie - Kliknięcie Spacji
document.body.addEventListener("keyup", function (e) {
    if (e.code == "Space") {
        click_handler(e);
    }
})

// Zdarzenie - przycisk reset
document.querySelector(".reset_btn").addEventListener("click", async function (e) {
    if (!document.querySelector(".decision")) {
        await decision().then(function () {
            score = 0;
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            window.localStorage.removeItem("score");
            window.click_strength = 1;
            document.location.reload();
        }, function () {
            document.querySelector(".decision").style.animation = "slideOutUp 0.5s ease";
            setTimeout(function () {
                document.querySelector(".decision").remove();
            }, 500)
        });
    }
})

// Sprawdzanie CPS
setInterval(function () {
    document.querySelector(".cps").innerText = `CPS: ${cps}`;
    if (cps > 5) {
        let rand = Math.floor(randomNumber(2, 10));
        document.querySelector(`.audio:nth-of-type(${rand})`).volume = window.volume;
        document.querySelector(`.audio:nth-of-type(${rand})`).play();
    }
    cps = 0;
}, 1000)

// "Auto clicking"
if (window.idle_clicks > 0) {
    window.interval = setInterval(function () {
        score++;
        save();
        document.querySelector(".score").innerText = `MeowCount: ${score}`;
        document.querySelector(".shop > h3").innerText = score + "C";
        document.querySelector(".skiny > h3").innerText = score + "C";
    }, 1000 / window.idle_clicks)
}

document.body.addEventListener("click", function (e) {
    // Zamknięcie/Otworzenie Sklepu
    if (e.target.className == "x_icon") {
        if (e.target.id == "x_open") {
            document.querySelector(".shop").style.animation = "slideInRight 0.5s ease"
            document.querySelector(".shop").style.display = "block";
            document.querySelector(".shop > h3").innerText = score + "C";
        } else {
            document.querySelector(".shop").style.animation = "slideOutRight 0.5s ease"
            setTimeout(function () {
                document.querySelector(".shop").style.display = "none";
            }, 450)
        }
    }
    // Zamknięcie/Otworzenie Skinów
    if (e.target.className == "x_icon_skins") {
        if (e.target.id == "span_skins") {
            document.querySelector(".skiny").style.animation = "slideInRight 0.5s ease"
            document.querySelector(".skiny").style.display = "block";
            document.querySelector(".skiny > h3").innerText = score + "C";
        } else {
            document.querySelector(".skiny").style.animation = "slideOutRight 0.5s ease"
            setTimeout(function () {
                document.querySelector(".skiny").style.display = "none";
            }, 450)
        }
    }
    // Kupowanie ulepszeń
    if (e.target.className == "buy") {
        if (score >= parseInt(e.target.dataset.price)) { // Udane kupienie
            score = score - parseInt(e.target.dataset.price);
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            save();
            document.querySelector(".shop > h3").innerText = score + "C";
            // Kupienie "Stronger Click"
            if (e.target.dataset.type == "click_strength") {
                window.click_strength++;
                document.querySelector("#buy_strength_buff").dataset.price = window.click_strength *100;
                document.querySelector("#buy_strength_buff").innerText = `BUY (${window.click_strength*100})`;
                document.querySelector("#label_strength").innerText = `Stronger click (${window.click_strength})`;
                e.target.dataset.price = parseInt(e.target.dataset.price) + 100;
                e.target.innerText = `Buy (${e.target.dataset.price})`;
            }
            // Kupienie "Auto Clicking"
            if (e.target.dataset.type == "idle_clicks") {
                window.idle_clicks++;
                document.querySelector("#label_idle").innerText = `Auto clicking (${window.idle_clicks})`;
                e.target.dataset.price = parseInt(e.target.dataset.price) + 200;
                e.target.innerText = `Buy (${e.target.dataset.price})`;
                if (window.interval) {
                    clearInterval(window.interval);
                }
                window.interval = setInterval(function () {
                    score++;
                    save();
                    document.querySelector(".score").innerText = `MeowCount: ${score}`;
                    document.querySelector(".shop > h3").innerText = score + "C";
                    document.querySelector(".skiny > h3").innerText = score + "C";
                }, 1000 / window.idle_clicks)
            }
        } else { // Brak pieniędzy
             e.target.style.animation = "shake 1s ease";
                setTimeout(function(){
                    e.target.style.animation = "";
                }, 1000)
        }
        e.target.blur();
    }
    // Kupowanie skinów
    if (e.target.className == "skin_buy") {
        if (score >= e.target.dataset.price) { // Udane kupienie
            window.skins.push(e.target.parentElement.dataset.name);
            score -= e.target.dataset.price;
            skiny_check();
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            document.querySelector(".shop > h3").innerText = score + "C";
            document.querySelector(".skiny > h3").innerText = score + "C";
            save();
        } else { // Brak pieniędzy
                e.target.style.animation = "shake 1s ease";
                setTimeout(function(){
                    e.target.style.animation = "";
                }, 1000)
        }
        e.target.blur();
    }
    // Ustawienie skina
    if (e.target.className == "skin_set") {
        window.current_skin = e.target.parentElement.dataset.name;
        document.querySelector("#cat_img").src = `images/${e.target.parentElement.dataset.name}.jpg`;
        if(e.target.dataset.buff == "click_strength"){
            window.skin_buff_strength = parseInt(e.target.dataset.buffAmount);
            clearInterval(window.skin_buff_auto_click);
            window.has_skin_buff_auto_click = 0;
        }else if(e.target.dataset.buff == "auto_click"){
            window.has_skin_buff_auto_click = parseInt(e.target.dataset.buffAmount);
            window.skin_buff_strength = 0;
            window.skin_buff_auto_click = setInterval(function(){
                score++;
                save();
                document.querySelector(".score").innerText = `MeowCount: ${score}`;
                document.querySelector(".shop > h3").innerText = score + "C";
                document.querySelector(".skiny > h3").innerText = score + "C";
            },1000/window.has_skin_buff_auto_click)
        }else{
            window.skin_buff_strength = 0;
            clearInterval(window.skin_buff_auto_click);
            window.has_skin_buff_auto_click = 0;
        }
        save();
        skiny_check();
        e.target.blur();
    }
    // Kupowanie Buffów
    if (e.target.className == "buy buff") {
        if (score >= e.target.dataset.price) { // Udane kupienie
            score = score - parseInt(e.target.dataset.price);
            document.querySelector(".score").innerText = `MeowCount: ${score}`;
            document.querySelector(".shop > h3").innerText = score + "C";
            document.querySelector(".skiny > h3").innerText = score + "C";
            if (e.target.dataset.buff == "strength") {
                window.strength_buff_active = true;
                window.click_strength = window.click_strength*2;
                window.skin_buff_strength = window.skin_buff_strength*2;
                e.target.disabled = "true";
                e.target.style = "filter: contrast(0.5);pointer-events: none;";
                document.querySelector("#buy_strength").disabled = "true";
                document.querySelector("#buy_strength").style = "filter: contrast(0.5);pointer-events: none;";
                e.target.innerText = "20s";
                let time_left = 20;
                let count = 0;
                // "Strength Buff"
                const interval = setInterval(function () {
                    time_left--;
                    e.target.innerText = time_left + "s";
                    if (time_left == 0 && count == 0) {
                        count++;
                        time_left = 60;
                    } else if (time_left == 0) {
                        clearInterval(interval);
                    }
                }, 1000)
                setTimeout(function () { // Czas trwania buffa
                    window.click_strength = window.click_strength / 2;
                    window.skin_buff_strength = window.skin_buff_strength / 2;
                    window.strength_buff_active = false;
                    document.querySelector("#buy_strength").removeAttribute("disabled");
                    document.querySelector("#buy_strength").style = "filter: contrast(1);pointer-events: auto;";
                }, 20000)
                setTimeout(function () { // Czas trwania cooldown'u po buffie
                    e.target.removeAttribute("disabled");
                    e.target.innerText = `BUY (${e.target.dataset.price})`;
                    e.target.style = "filter: contrast(1);pointer-events: auto;";
                }, 80000)
            }
        } else { // Brak pieniędzy
             e.target.style.animation = "shake 1s ease";
                setTimeout(function(){
                    e.target.style.animation = "";
                }, 1000)
        }
        e.target.blur();
    }
})

// Responsywność strony
function responsivity(x) {
    if (x.matches){
        document.querySelector("#x_open").innerHTML = '<i class="fa fa-shopping-cart" style="pointer-events: none;"></i>';
        document.querySelector("#span_skins").innerHTML = '<i class="fa fa-paint-brush" style="pointer-events: none;"></i>';
    } else {
        document.querySelector("#x_open").innerHTML = "SKLEP";
        document.querySelector("#span_skins").innerHTML = "SKINY";
    }
}
var x = window.matchMedia("(max-width: 630px)");
responsivity(x);
x.addListener(responsivity);

// Otworzenie/Zamknięcie ustawień
document.querySelector(".settings_icon").addEventListener("click", function () {
    document.querySelector(".settings").style.display = "block";
    document.querySelector(".settings").style.animation = "slideInRight 0.5s ease";
})
document.querySelector("#x_settings").addEventListener("click", function () {
    document.querySelector(".settings").style.animation = "slideOutRight 0.5s ease"
    setTimeout(function () {
        document.querySelector(".settings").style.display = "none";
    }, 450)
})

// Delay na zapisywaniu ustawień
let timeout = 1;
document.querySelector(".settings > input").addEventListener("input", function (e) {
    if (typeof timeout !== 'undefined' || timeout !== null) {
        clearTimeout(timeout);
    }
    let volume = e.target.value / 100;
    window.volume = volume;
    timeout = setTimeout(function () {
        save_settings();
    }, 200)
})

// Jasny motyw
function light_theme() {
    window.theme = "light";
    document.documentElement.style.setProperty('--color', '#000000');
    document.documentElement.style.setProperty('--bg', '#ffffff');
    document.documentElement.style.setProperty('--button-bg', '#202020');
    document.querySelector(".reset_btn").style.cssText = "border: 1px solid #202020g;";
    document.querySelector(".new_style").remove();
}

// Ciemny motyw
function dark_theme() {
    window.theme = "dark";
    document.documentElement.style.setProperty('--color', '#ffffff');
    document.documentElement.style.setProperty('--bg', '#202020');
    document.documentElement.style.setProperty('--button-bg', 'transparent');
    document.querySelector(".reset_btn").style.cssText = "border: 1px solid var(--color);";
    let new_style = document.createElement("style");
    new_style.classList.add("new_style");
    new_style.innerHTML = ".reset_btn:hover{background: #fff;color: #202020;}";
    document.querySelector(".settings").appendChild(new_style);
}

// Zdarzenie - zmiana motywu
document.querySelector(".theme_switch").addEventListener("click", function () {
    if (document.querySelector(".new_style")) {
        light_theme();
        save_settings();
    } else {
        dark_theme();
        save_settings();
    }
})