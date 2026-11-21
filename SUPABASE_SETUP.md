# Configurar Supabase (guía rápida)

## 1. Crear el proyecto y la tabla
1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Abre **SQL Editor → New query**, pega el contenido de `supabase/schema.sql` y pulsa **Run**.
3. (Opcional) Ejecuta `supabase/seed.sql` para cargar las 9 oportunidades de ejemplo.

## 2. Crear tu usuario administrador (Supabase Auth)
1. **Authentication → Users → Add user → Create new user**.
2. Escribe tu **correo** y una **contraseña segura**, y marca **Auto Confirm User** (así puedes iniciar sesión de inmediato).
3. **Recomendado:** en **Authentication → Sign In / Providers** (o *Providers → Email*), desactiva **Allow new users to sign up**.
   Así nadie más puede crear cuentas; los administradores se crean solo desde el panel de Supabase.
4. Repite el paso 1–2 por cada persona que deba administrar el sitio.

> Además de Supabase Auth, el sitio exige que el correo esté en `ADMIN_EMAILS` (paso siguiente).
> Es una segunda barrera: una cuenta que no figure ahí no entra al panel aunque exista en Supabase.

## 3. Obtener las claves
En **Project Settings → API Keys** copia:

| Variable | Valor | ¿Pública? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clave `anon` / *publishable* | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | clave `service_role` / *secret* | **No** |
| `ADMIN_EMAILS` | tu correo (varios: separados por comas) | No |

> La clave `service_role` ignora la seguridad de la base de datos. Solo debe vivir en el servidor:
> nunca con prefijo `NEXT_PUBLIC_`, nunca en el repositorio.

Las variables `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET` de versiones anteriores **ya no se usan**.

## 4. Desarrollo local
```bash
cp .env.example .env.local   # completa los valores
npm install
npm run dev
```
Abre `http://localhost:3000/admin`: te llevará a `/admin/login`. Inicia sesión con el correo y la contraseña
del paso 2. Publica una oportunidad: debe aparecer en la web y en **Table Editor → opportunities**.
Prueba también **Cerrar sesión** y que `/admin` vuelva a pedir el login.

## 5. Despliegue en Vercel
1. Sube el proyecto a GitHub e impórtalo en Vercel.
2. En **Settings → Environment Variables** crea las variables de `.env.example`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS`
   y, si tienes dominio propio, `NEXT_PUBLIC_SITE_URL`).
3. Despliega (o *Redeploy* si ya lo habías hecho antes de definirlas; las variables `NEXT_PUBLIC_*` se fijan en el build).

## Seguridad
- La tabla tiene **RLS activado y sin políticas**: la clave pública (`anon`) no puede leer ni escribir datos.
  Todo el acceso pasa por el servidor de Next.js con la clave `service_role`.
- `/admin` está protegido por **middleware** (redirige al login) y cada página y acción del panel vuelve a
  comprobar la sesión en el servidor con `auth.getUser()`.
- Supabase Auth aplica límites de intentos de inicio de sesión por su cuenta.
- Para cambiar una contraseña o quitar a un administrador: **Authentication → Users** y quítalo de `ADMIN_EMAILS`.
