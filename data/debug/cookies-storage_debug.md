# Almacenamiento en el navegador

Cookies - `localStorage` - `sessionStorage`


# Agenda

Cookies (y su relación directa con HTTP)


Cookies vs Web Storage


# Cookies

Mecanismo de gestión de estado en HTTP, especificado
en la RFC 6265, que permite emular sesiones sobre un
protocolo que es, por diseño, sin estado (stateless).
El servidor las establece mediante el header de respuesta
```
Set-Cookie
```

El agente de usuario las reenvía en cada petición con el
header `Cookie`
Se transmiten como parte del tráfico HTTP: no requieren
JavaScript






|Quién escribe|Cómo|
|---|---|
|Servidor|Header `Set-Cookie`  en la respuesta<br>HTTP|
|Cliente<br>(JS)|`document.cookie = "..."`, solo si no<br>es `HttpOnly`|


```
HTTP/1.1 200 OK
Set-Cookie: sesion=abc123; Max-Age=3600; Secure; HttpOnly

GET /perfil HTTP/1.1
Cookie: sesion=abc123

```

# Asociación de sesión en HTTP

HTTP es un protocolo sin estado: cada request se procesa
de forma independiente. Para conservar la identidad del
cliente, el servidor requiere un identificador de sesión.

```
 Cliente
 Servidor
 |
                 |
 |----- POST /login (credenciales) ------>|
 |
 (autentica; crea entrada en tabla de sesiones)
   |<---- Set-Cookie: sesion=abc123 ---------|
 |
                 |
 |----- GET /perfil ---------------------->|
 |   Cookie: sesion=abc123
 |
 |
 (busca "abc123" en tabla de sesiones)
   |<---- 200 OK (recurso autorizado) -------|

```








|Elemento|Ubicación|Contenido|
|---|---|---|
|Identificador de<br>sesión|Cliente<br>(cookie)|Token opaco<br>( `abc123` )|
|Estado de sesión|Servidor|Usuario, permisos,<br>expiración|


La cookie transporta el identificador; el estado reside en
el servidor.


# Cookies · atributos importantes








|Atributo|Para qué sirve|
|---|---|
|`Expires`  / `Max-`<br>`Age`|Cuándo expira (sin esto: cookie de<br>sesión)|
|`Domain`  / `Path`|En qué origen/ruta se envía|
|`Secure`|Solo se manda por HTTPS|
|`HttpOnly`|JS no puede leerla<br>( `document.cookie` )|


# Cookies · desde JS

```
 // Escribir
 document.cookie = "tema=oscuro; path=/; max-age=3600"

 // Leer (solo las que NO son HttpOnly)
 console.log(document.cookie)
 // "tema=oscuro; otraCookie=valor"

```

API vieja e incómoda: todo es un solo string, hay que
parsearlo a mano
Límite chico: ~4 KB por cookie
Se mandan en cada request al servidor → pesan en el
tráfico


# Cookies · casos de uso






|Caso de uso|Ejemplo|
|---|---|
|Sesión de usuario /<br>autenticación|`sesion=abc123; HttpOnly`<br>tras el login|
|Preferencia leída por<br>el servidor|`idioma=es-AR`  para renderizar<br>la página (SSR)|




# Web Storage API

```
 storage.setItem(clave, valor)
 storage.getItem(clave)
 storage.removeItem(clave)
 storage.clear()

```

A diferencia de las cookies, nunca viajan en los requests
HTTP
Solo existen del lado del cliente, accesibles por JS
Pares clave/valor, siempre strings
Aislados por origen (protocolo + dominio + puerto)
Quién escribe: únicamente JavaScript ejecutándose en el
cliente. El servidor no tiene forma de escribir directamente:
no hay un header equivalente a `Set-Cookie` .


# localStorage

Almacenamiento persistente, por origen.
Sin fecha de expiración
Sobrevive a cerrar la pestaña, el navegador - reiniciar el
equipo
Se borra solo explícitamente ( `clear()`, `removeItem()` )
Límite típico: ~5–10 MB por origen
Compartido entre todas las pestañas del mismo origen

```
 localStorage.setItem("tema", "oscuro")
 const tema = localStorage.getItem("tema")
 localStorage.removeItem("tema")

```

# localStorage · casos de uso






|Caso de uso|Ejemplo|
|---|---|
|Preferencia de UI|Tema oscuro/claro, idioma elegido<br>en el cliente|
|Carrito de<br>compras|Ítems agregados, persisten entre<br>visitas|
|Cache de datos<br>de API|Evitar refetch de datos que<br>cambian poco|
|Borrador de<br>formulario|Autosave para no perder texto<br>largo si se cierra la pestaña|
|Feature flags / A-B<br>testing|Bandera asignada al cliente, sin ida<br>y vuelta al servidor|


# sessionStorage

Almacenamiento temporal, acotado a una pestaña.
Vive mientras la pestaña esté abierta
Se borra al cerrarla (no al recargar la página)
No se comparte entre pestañas, ni del mismo origen
Mismo límite de tamaño que `localStorage`

```
 sessionStorage.setItem("pasoActual", "2")
 const paso = sessionStorage.getItem("pasoActual")

```

# sessionStorage · casos de uso












|Caso de uso|Ejemplo|
|---|---|
|Formulario / wizard<br>multi-paso|Paso actual y datos ingresados<br>en esa pestaña|
|Checkout en curso|Datos de compra que no deben<br>sobrevivir a la pestaña|
|`state` / `nonce`  de<br>OAuth|Valor temporal validado al<br>volver del redirect|



Filtros de una tabla Orden/búsqueda propios de esa
pestaña, no de otras


# Cookies vs Web Storage


















|Col1|Cookies|localStorage|sessionStorage|
|---|---|---|---|
|Viaja en<br>cada<br>request<br>HTTP|Sí|No|No|
|Quién<br>escribe|Servidor o<br>JS|Solo JS|Solo JS|
|Quién lee|Servidor y<br>JS|Solo JS|Solo JS|
|Duración|Configurable|Persistente|Por<br>pestaña|
|Tamaño|~4 KB|~5–10 MB|~5–10 MB|
|Uso típico|Sesión, auth|Preferencias,<br>cache|Estado de<br>un flujo|


# Buenas prácticas de seguridad

Datos sensibles (tokens, sesión) → cookie **`HttpOnly`** +


cualquier script → vulnerables a XSS
No guardar más de lo necesario, y siempre validar/limitar
tamaño


# Resumen

Cookies: viajan en cada request HTTP, ideales para
sesión/auth
localStorage: persistente, solo cliente, todas las pestañas
sessionStorage: temporal, solo cliente, una pestaña


Speaker notes


