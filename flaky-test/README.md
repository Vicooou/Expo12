# Pruebas inestables (flaky tests)

La calculadora está integrada en `../index.html`. El ejemplo comienza con 10 casos repetidos y 2 casos cuyo resultado cambió: 2 / 10 × 100 = 20 %.

Repite las pruebas sin cambiar el código, los datos relevantes ni las condiciones del entorno para que la comparación tenga sentido. La página también repite las 20 comprobaciones reales de la tienda diez veces y compara cada resultado; así calcula la tasa de inestabilidad de esa suite. La función está en `flaky-tests.js` y las pruebas unitarias, en `tests/flaky-tests.test.js`.

Desde la raíz del proyecto, ejecuta:

```sh
node --test flaky-test/tests/flaky-tests.test.js
```
