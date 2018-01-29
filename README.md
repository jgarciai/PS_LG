#----------------------------------#
# PS_LG: Prueba de Codigo LogTrust #
# Autor: Jorge Garcia Iglesias     #
#----------------------------------#

Ejercicio 1:
============

Se ha definido una funcion evaluarNumeros, que recibe una lista de números y por
cada uno evalua si es perfecto, abundante o defectivo, para lo cual invoca a la
funcion sumaDivisores para calcular la suma de los divisores de cada número.

Para ejecutar el script seguir el ejemplo siguiente:

Ejemplo:

  ejercicio1.py 6 12 19 28 122 496 1050 8128

Salida esperada:

6 es un numero perfecto: 6 = 6 ( 1 + 2 + 3 )
12 es un numero abundante: 12 < 16 ( 1 + 2 + 3 + 4 + 6 )
19 es un numero defectivo: 19 > 1 ( 1 )
28 es un numero perfecto: 28 = 28 ( 1 + 2 + 4 + 7 + 14 )
122 es un numero defectivo: 122 > 64 ( 1 + 2 + 61 )
496 es un numero perfecto: 496 = 496 ( 1 + 2 + 4 + 8 + 16 + 31 + 62 + 124 + 248 )
1050 es un numero abundante: 1050 < 1926 ( 1 + 2 + 3 + 5 + 6 + 7 + 10 + 14 + 15 + 21 + 25 + 30 + 35 + 42 + 50 + 70 + 75 + 105 + 150 + 175 + 210 + 350 + 525 )
8128 es un numero perfecto: 8128 = 8128 ( 1 + 2 + 4 + 8 + 16 + 32 + 64 + 127 + 254 + 508 + 1016 + 2032 + 4064 )


Ejercicio 2:
============

Para realizar el ejercicio se ha utilizado la libreria javascript HighCharts
(https://code.highcharts.com/highcharts.js) para mostrar ambos graficos.

La pagina web se conecta a cada una de las urls proporcionadas para obtener los
datos. La consulta se hace en cadena, consultando primero los datos de la serie 1,
 2 y finalmente la serie 3.

Se utilizan una serie de variables globales para guardar la informacion de los
datos procesados en cada serie. Se definen dos variables globales para guardar
la fecha minima y maxima. Ambas fechas se van actualizando (si procede) según se
van procesando los eventos. La fecha minima se inicializa con un valor igual a
2999-01-01, y la fecha maxima con un valor igual a 1970-01-01.

Se define un Map para guardar los totales por categoria, y otro Map por categoria
con la dupla fecha y valor.

Según se van procesando los registros de cada serie, la funcion processEvent se
encarga de ir actualizando ambas estructuras de datos.

Una vez procesadas todas las series se evaluan ambas estructuras para obtener la
informacion de ambos charts. En el caso del Pie Charts, se recorre el map con los
totales y se calcula el porcentaje de cada categoria respecto el total de todas
las categorias. Para el Line Chart, se procesa el map de categorias para obtener
un array por categoria con todos los valores en el rango de fechas comprendido
entre la fecha minima y la maxima. Si para una fecha no existe valor para
alguna de las categorias se toma como valor 0.0.

Para obtener la fecha y categoria de la serie3 se ha creado una funcion parseRaw
que va leyendo caracter a caracter y obteniendo los valores separados por espacio.
Se asume que tanto la fecha como la categoria pueden venir en cualquier posicion
del registro, por lo que por cada valor se comprueba si es una fecha valida o no
mediante el uso de una expresion regular. Se asume como fecha valida el primer
campo que corresponde a un formato de fecha valido. De igual forma, se asume como
categori valida el primer valor comprendido entre los caractere '#'.
