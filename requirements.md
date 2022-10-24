Juanito quiere un programa a la medida que le avise cuándo comprar y cuándo vender bitcoin. Únicamente quiere recibir una sugerencia de compra o venta una vez al día. La estrategia que sigue es la de "comprar cuando todos venden" y "vender cuando todos compran" si el precio del día es más alto o bajo de la mediana del precio del mes anterior (últimos 30 días). Así que vamos a hacer lo siguiente:

Desarrollarle un programa que obtenga el precio de bitcoin una vez al día y guarde toda la información del último mes. Una vez que el programa tenga los precios de al menos 30 días entonces puede empezar a enviarle recomendaciones a Juanito por email. Alternativamente puedes hard-codear (u obtener de alguna API) los precios del último mes.

Cada que el programa obtenga un nuevo precio (y esté listo para hacer recomendaciones) debe también obtener el "Fear & Greed Index" del mercado de ese momento. Este indicador va del 0 al 100. 0 significa "Extreme Fear" y 100 "Extreme Greed", así que el programa únicamente debe sugerir una compra si el índice es menor a 20 y una venta si es mayor a 80.

Por lo tanto la lógica es la siguiente:

- Si el precio de hoy es más bajo que la mediana del precio del último mes y el Fear & Greed Index es menor a 20: mandar correo "buy bitcoin"
- Si el precio de hoy es más alto que la mediana del precio del último mes y el Fear & Greed Index es mayor a 80: mandar correo "sell bitcoin"
- De lo contrario mandar correo "hodl"

Notas: 

- No necesariamente tienes que implementar todo. Por ejemplo, un método sendEmail(email, message) que imprima en consola basta
- Todo puede ser en memoria pero si lo deseas puedes escribir algunos métodos falsos que simulen el accesso a una base de datos
- Tú puedes elegir qué estructura de datos utilizar y qué hacer en caso de errores
- Si lo consideras necesario puedes escribir comentarios en inglés. Juanito no habla español :(

API para obtener el precio de bitcoin: https://api.blockchain.com/v3/exchange/tickers/BTC-USD

API para obtener el Fear & Greed Index: https://api.alternative.me/fng/