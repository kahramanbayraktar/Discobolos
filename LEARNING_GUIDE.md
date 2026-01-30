# Discobolos Project: Deep-Dive Learning Guide

Bu rehber, projedeki kritik dosyaların teknik işleyişini ve mimari kararların "neden"lerini derinlemesine açıklar.

---

## 1. Supabase Client Yapılandırması (Neden 3 Farklı Client?)

Projede `lib/` altında farklı Supabase yapılandırmaları görmenin sebebi, Next.js'in **Server-Side Rendering (SSR)** ve **Edge Computing** yapısıdır.

### A. `lib/supabase.ts` (Standart SDK)
Bu dosya, `@supabase/supabase-js` kütüphanesini kullanır. 
*   **Görevi:** Arka plan script'leri (seed, test) veya basit veri çekme işlemleri için kullanılır.
*   **Dezavantajı:** Tarayıcı çerezlerini (cookies) otomatik olarak yönetmez. Bu yüzden Auth (Giriş) işlemleri için tek başına yetersizdir.

### B. `lib/supabase/server.ts` (Sunucu Tarafı Auth)
`@supabase/ssr` kütüphanesini kullanır.
*   **Görevi:** Server Components içerisinde çalışırken kullanıcının o anki oturumunu (session) çerezlerden okur.
*   **Teknik Detay:** `cookies()` fonksiyonunu kullanarak Supabase'e "Kullanıcının kimlik bilgilerini şu çerezlerden al" talimatını verir.

### C. `lib/supabase/client.ts` (İstemci Tarafı Auth)
*   **Görevi:** Browser (istemci) üzerinde çalışan bileşenlerde (örn: Login formu) kullanılır. 
*   **Teknik Detay:** Tarayıcının `localStorage` veya `cookies` alanına erişerek oturum açma işlemini gerçekleştirir.

---

## 2. `lib/supabase/middleware.ts`: Güvenlik Duvarı
Bu dosya, uygulamanın **kalbidir**. Next.js her bir sayfa isteği aldığında bu fonksiyon çalışır.

*   **Oturum Yenileme (Session Refresh):** Supabase'in JWT (JSON Web Token) süresi dolabilir. `supabase.auth.getUser()` fonksiyonu çağrıldığında, eğer token eskiyse middleware bunu otomatik olarak yeniler ve yeni çerezleri tarayıcıya yazar.
*   **Rota Koruması (Admin Check):** 
    ```typescript
    const isAdminRoute = pathname.split('/').some(segment => segment === 'admin')
    if (isAdminRoute && !user) {
      // Kullanıcı giriş yapmamışsa /login'e fırlat
    }
    ```
    Buradaki mantık şudur: URL içinde `admin` kelimesi geçiyorsa ve `supabase.auth.getUser()` bize bir kullanıcı dönmüyorsa, kullanıcıyı dil kodunu bozmadan (`/tr/login`) giriş sayfasına yönlendirir.

---

## 3. `lib/supabase.ts` İçindeki Veri Eşleşme (Mapping)
Veritabanı dilleri (SQL) genellikle `snake_case` (yılan_yazımı) kullanır. JavaScript dünyası ise `camelCase` (deveYazımı) üzerine kuruludur.

`getEvents` fonksiyonundaki şu blok bu iki dünyayı birbirine bağlar:
```typescript
return (data || []).map((row: any) => ({
  id: row.id,
  title: row.title,
  endTime: row.end_time, // Veritabanındaki 'end_time', JS'de 'endTime' olur
  locationUrl: row.location_url,
  // ...
}));
```
**Neden önemli?** Eğer bu eşleşmeyi yapmazsak, frontend tarafında `event.end_time` yazmak zorunda kalırız ki bu da temiz kod (clean code) prensiplerine aykırıdır.

---

## 4. Supabase Auth Entegrasyonu: Adım Adım Akış

1.  **Giriş:** Kullanıcı `/login` sayfasında bilgilerini girer. `lib/supabase/client.ts` kullanılarak `signInWithPassword` çağrılır.
2.  **Çerez Yazımı:** Başarılı girişte Supabase, tarayıcıya bir çerez (cookie) bırakır.
3.  **İstek:** Kullanıcı `/admin/events` sayfasına gitmek ister.
4.  **Middleware:** `middleware.ts` devreye girer, çerezi okur, Supabase'e sorar ("Bu kullanıcı kim?"). Supabase "Evet, bu geçerli bir admin" derse geçişe izin verir.
5.  **Render:** Sayfa sunucuda (`Server Component`) hazırlanırken `lib/supabase/server.ts` üzerinden tekrar bir kontrol yapılır ve veri DB'den çekilip HTML olarak gönderilir.

---

## 5. Row Level Security (RLS) Mantığı

SQL ile yazdığımız kural şuydu:
`create policy ... to authenticated with check (true);`

*   **Public (Anon):** Sadece `getEvents` ile veriyi okuyabilir.
*   **Admin (Authenticated):** Formu doldurup "Gönder" dediğinde, tarayıcıdaki oturum bilgisi isteğe eklenir. Supabase veritabanı bu bilgiyi görür ve RLS kuralına bakıp "Bu kullanıcı kimliği doğrulanmış, yazabilir" diyerek izni verir.

---

## Özet: Hata Aldığın Noktalardaki Çözümler
*   **404 Hatası:** Redirect ederken `./` gibi bağıl yollar kullanmak yerine, dinamik dil kodunu (`/${lang}/events`) kullanarak kesin (absolute) yollar belirledik.
*   **RLS Hatası:** Form içinde yanlış istemciyi (çerez bilmeyen) kullandığımız için veritabanı bizi "isimsiz kullanıcı" sandı. `lib/supabase/client.ts`'e geçerek bu sorunu çözdük.
