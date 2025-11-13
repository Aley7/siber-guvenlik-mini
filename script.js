/* script.js: tüm işlevler burada */

// Ses
const clickAudio = document.getElementById('clickSound');
function playClick() {
    if (!clickAudio) return;
    clickAudio.currentTime = 0;
    clickAudio.play().catch(e => {
        // tarayıcı izin vermezse sessizce pas geç
        console.warn("Ses çalmada sorun:", e);
    });
}

/* ---------- Şifre Güç / Entropy ---------- */
function entropyScore(pw) {
    let pool = 0;
    if (/[a-z]/.test(pw)) pool += 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/\d/.test(pw)) pool += 10;
    if (/[^A-Za-z0-9]/.test(pw)) pool += 32;
    const score = pw.length * (Math.log2(pool || 1));
    return Math.round(score);
}
function updateMeter(score) {
    const pct = Math.min(100, Math.round(score / 2));
    const bar = document.getElementById('pwMeter');
    bar.style.width = pct + '%';
    if (pct < 40) bar.style.background = '#ff6b6b';
    else if (pct < 70) bar.style.background = '#ffd166';
    else bar.style.background = '#6be5a3';
}
function checkPassword() {
    playClick();
    const pw = document.getElementById('password').value;
    const score = entropyScore(pw);
    updateMeter(score);

    let errors = [];
    if(pw.length < 8) errors.push("En az 8 karakter");
    if(!/[A-Z]/.test(pw)) errors.push("Büyük harf eksik");
    if(!/[a-z]/.test(pw)) errors.push("Küçük harf eksik");
    if(!/\d/.test(pw)) errors.push("Rakam eksik");
    if(!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) errors.push("Özel karakter eksik");

    const res = document.getElementById('passwordResult');
    if(errors.length === 0) {
        res.innerText = `Entropy: ${score} bits — Şifre Güçlü ✅`;
        saveHistory('checked', pw);
    } else {
        res.innerText = `Entropy: ${score} bits\nEksikler:\n` + errors.join("\n");
        saveHistory('checked', pw);
    }
}

/* ---------- Rastgele şifre + kopyala ---------- */
function generatePassword() {
    playClick();
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    let password = "";
    for(let i=0; i<12; i++){
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('generatedPassword').value = password;
    document.getElementById('generateNote').innerText = "Oluşturuldu. Kopyala butonuyla panoya gönder.";
    saveHistory('generated', password);
}
document.getElementById('copyBtn').addEventListener('click', () => {
    playClick();
    const val = document.getElementById('generatedPassword').value;
    if(!val) { alert('Önce şifre oluştur'); return; }
    navigator.clipboard.writeText(val).then(() => {
        const b = document.getElementById('copyBtn');
        b.innerText = 'Kopyalandı ✓';
        setTimeout(()=> b.innerText = 'Kopyala', 1300);
    }).catch(e => {
        alert('Kopyalama desteklenmiyor');
    });
});

/* ---------- Fake port tarayıcı ---------- */
function fakePortScan() {
    playClick();
    const ip = document.getElementById('ipAddress').value || "127.0.0.1";
    const ports = [21,22,23,25,53,80,110,143,443,8080];
    const result = document.getElementById('portResult');
    const bar = document.getElementById('scanBar');
    result.innerText = `Tarama başlatıldı: ${ip}\n`;
    bar.style.width = '0%';
    let i = 0;
    function step() {
        if(i >= ports.length) {
            bar.style.width = '100%';
            result.innerText += "\nTarama tamamlandı!";
            saveHistory('scan', `Tarandı: ${ip}`);
            return;
        }
        const open = Math.random() < 0.25;
        result.innerText += `Port ${ports[i]} ${open ? 'açık ✅' : 'kapalı ❌'}\n`;
        bar.style.width = `${Math.round(((i+1)/ports.length)*90)}%`;
        i++;
        setTimeout(step, 500 + Math.random()*700);
    }
    step();
}

/* ---------- localStorage geçmiş ---------- */
function saveHistory(type, value) {
    const key = 'sv_history';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.unshift({type, value, time: new Date().toLocaleString()});
    localStorage.setItem(key, JSON.stringify(arr.slice(0,6)));
    renderHistory();
}
function renderHistory() {
    const key = 'sv_history';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    const ul = document.getElementById('historyList');
    ul.innerHTML = '';
    arr.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `[${item.time}] ${item.type}: ${item.value.length > 40 ? item.value.slice(0,40) + '...' : item.value}`;
        ul.appendChild(li);
    });
}
document.getElementById('clearHistory').addEventListener('click', () => {
    localStorage.removeItem('sv_history');
    renderHistory();
});

/* ---------- Tema toggle ---------- */
const toggle = document.getElementById('themeToggle');
toggle.addEventListener('click', () => {
    playClick();
    document.body.classList.toggle('light');
    toggle.innerText = document.body.classList.contains('light') ? '🌞' : '🌙';
});

/* ---------- Event listener bağlama ---------- */
document.getElementById('checkBtn').addEventListener('click', checkPassword);
document.getElementById('generateBtn').addEventListener('click', generatePassword);
document.getElementById('scanBtn').addEventListener('click', fakePortScan);

/* Başlangıçta geçmişi göster */
renderHistory();
// Kontrol Et butonu
document.getElementById("checkBtn").addEventListener("click", function() {
    var audio = document.getElementById("clickSound");
    audio.play();
});

// Şifre Oluştur butonu
document.getElementById("generateBtn").addEventListener("click", function() {
    var audio = document.getElementById("clickSound");
    audio.play();
});

// Tarama Başlat butonu
document.getElementById("scanBtn").addEventListener("click", function() {
    var audio = document.getElementById("clickSound");
    audio.play();
});


