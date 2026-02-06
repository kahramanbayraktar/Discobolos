const fs = require('fs');
const path = require('path');
const https = require('https');

// 1. .env.local dosyasından API Key'i oku
const envPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  // Hem GOOGLE_GENERATIVE_AI_API_KEY hem de varsa başka değişkenlere bak
  const match = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY=["']?([^"'\n]+)["']?/);
  if (match) {
    apiKey = match[1];
  }
} catch (e) {
  console.error("❌ .env.local dosyası okunamadı.");
  process.exit(1);
}

if (!apiKey) {
  console.error("❌ API Key bulunamadı (GOOGLE_GENERATIVE_AI_API_KEY).");
  process.exit(1);
}

console.log(`🔑 API Key bulundu: ${apiKey.substring(0, 5)}...`);
console.log("🌐 Google API'ye bağlanılıyor...");

// 2. Google Modellerini Listele
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      if (json.error) {
        console.error("❌ API Hatası:", json.error.message);
        return;
      }

      console.log("\n📋 Müsait Modeller Listesi:");
      console.log("=================================");
      
      if (!json.models) {
        console.log("Model bulunamadı.");
        return;
      }

      // Modelleri yazdır
      json.models.forEach(m => {
        console.log(`\n🔹 Model: ${m.name}`);
        console.log(`   Görünen Ad: ${m.displayName}`);
        console.log(`   Desteklenen İşlemler: ${JSON.stringify(m.supportedGenerationMethods)}`);
      });

      console.log("\n=================================");
      console.log("✅ Kontrol tamamlandı.");
      
      // Imagen kontrolü
      const imagen = json.models.find(m => m.name.includes('imagen'));
      if (imagen) {
        console.log("\n🎉 Müjde! Imagen modeli bulundu: " + imagen.name);
      } else {
        console.log("\n⚠️ Uyarı: Listede 'imagen' içeren bir model görünmüyor.");
      }

    } catch (e) {
      console.error("❌ JSON parse hatası:", e.message);
      console.log("Ham veri:", data);
    }
  });
}).on('error', (err) => {
  console.error("❌ Bağlantı hatası: ", err.message);
});
