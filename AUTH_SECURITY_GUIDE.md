# Supabase Security: RLS & PKCE Guide

## 1. RLS (Row Level Security)
**Nedir?** Veritabanı seviyesinde, tablodaki satırlara kimin erişebileceğini belirleyen kurallar bütünüdür.
- **Mantık**: "Sadece kendi oluşturduğum veriyi gör", "Adminler her şeyi silsin" gibi kurallar SQL ile tanımlanır.
- **Önem**: Veritabanı API'si (PostgREST) dış dünyaya açık olduğu için, frontend'den gelen her sorgu RLS süzgecinden geçer.
- **Kritik**: RLS kapalıysa, Anon Key'e sahip herkes tüm veriyi okuyabilir/silebilir.

## 2. PKCE (Proof Key for Code Exchange)
**Nedir?** OAuth 2.0 (Giriş yapma süreçleri) için ek bir güvenlik katmanıdır.
- **Sorun**: Yetkilendirme kodu (Auth Code) internet trafiğinde çalınabilir.
- **Çözüm**: Giriş başlarken bir "kod anahtarı" oluşturulur, giriş bitince bu anahtar doğrulanır. Anahtar yoksa giriş iptal edilir.
- **Kullanım**: Supabase Auth (SSR veya Client) modern tarayıcı akışlarında PKCE'yi varsayılan olarak kullanır. Çalınan kodların başka makinelerde kullanılmasını engeller.

## 3. Discobolos Auth Sorunu ve Çözümü

### Sorun
Supabase'in varsayılan e-posta sistemindeki (Auth) düşük gönderim limitleri, yeni oyuncuların kayıt olmasını ve şifre sıfırlama süreçlerini engelledi. "Email confirmation" ve "Reset link" trafiği limitlere takıldığı için sisteme giriş yapılamadı.

### Değerlendirilen Seçenekler
- **Seçenek B**: Supabase Auth'u tutup e-posta onayını kapatmak. (Hala şifre politikalarına ve servis limitlerine bağımlı).
- **Seçenek A (Seçilen)**: Supabase Auth'u bypass edip tamamen özel bir **"Access Code"** sistemine geçmek.

### Uygulanan Çözüm: Custom Access Code System
- **Mekanizma**: `public.players` tablosuna her oyuncu için bir `access_code` eklendi.
- **Session**: Giriş başarılı olunca tarayıcıya `player_token` (Player ID) çerezi (cookie) atanır.
- **Middleware**: Sayfa koruması Supabase oturumu yerine bu çereze bakar. ID veritabanında varsa ve kaptansa admin paneline izin verir.
- **RLS Notu**: Bu sistemde kullanıcılar veritabanına "anon" (misafir) olarak istek attığı için, SQL seviyesinde RLS politikaları `public.players` tablosu için `FOR ALL` (herkese açık) olarak güncellenmelidir. Güvenlikten artık Next.js Middleware sorumludur.
