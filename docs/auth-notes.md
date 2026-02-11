# Auth & Storage Notları

## Supabase Storage RLS ve Auth İlişkisi

Supabase Storage Row Level Security (RLS) politikaları, `auth.role()` veya `auth.uid()` gibi fonksiyonlara güveniyorsa, istemcinin (client) Supabase Auth servisi üzerinden **gerçekten** oturum açmış olması gerekir.

Eğer uygulama içinde kendi token/cookie sisteminizi kullanıyor ve `supabase.auth.signInWithPassword` gibi metodları çağırmıyorsanız, istemci tarafındaki Supabase istemcisi (`createClient`) sunucuya kimlik bilgisi (Bearer token) gönderemez. Bu durumda Storage işlemleri `anon` (anonim) rolüyle yapılır ve `authenticated` rolü gerektiren RLS politikaları başarısız olur.

### Yapılması Gerekenler

1.  **Giriş Sayfası (`login/page.tsx`)**:
    Kullanıcı giriş yaparken, sadece veritabanı sorgusu değil, aynı zamanda Supabase Auth oturumu da açılmalıdır:

    ```typescript
    const { error } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword,
    });
    ```

2.  **Yükleme Bileşeni (`image-upload.tsx`)**:
    Yükleme işleminden önce oturumun aktif olup olmadığı kontrol edilmelidir. Ancak RLS politikaları doğru ayarlandıysa ve adım 1 yapıldıysa bu kontrol sadece UX (kullanıcı deneyimi) içindir, güvenlik zaten Sunucu tarafında (Supabase) sağlanır.

    ```typescript
    // İsteğe bağlı, debug için
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) console.warn("No active Supabase session found!");
    ```
