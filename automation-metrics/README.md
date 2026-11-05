# Métricas de automatización

La sección está integrada en `../index.html` y calcula métricas con las 20 pruebas automatizadas de la tienda.

- Cobertura = casos automatizados / casos planificados × 100. El ejemplo usa 20 de 25 = 80 %; puedes cambiar el total planificado.
- Pass rate y fail rate se calculan con el resultado actual de las 20 pruebas. Activa defectos en la tienda para observar los cambios.
- Tiempo de ejecución se mide al ejecutar la suite actual y se muestra en milisegundos.

La lógica está en `automation-metrics.js` y las pruebas unitarias en `tests/automation-metrics.test.js`. Desde la raíz del proyecto, ejecuta:

```sh
node --test automation-metrics/tests/automation-metrics.test.js
```
