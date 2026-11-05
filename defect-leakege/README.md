# Defect leakage en la tienda demo

La calculadora está integrada en la pantalla principal de la tienda (`../index.html`). Los valores iniciales reproducen el ejemplo de la exposición: 40 defectos detectados antes de producción y 10 encontrados en producción.

La función reutilizable está en `defect-leakage.js`; valida entradas enteras no negativas y evita dividir entre cero. La suite está en `tests/defect-leakage.test.js`.

Desde la raíz del proyecto, ejecuta:

```sh
node --test defect-leakege/tests/defect-leakage.test.js
```

El total cuenta defectos únicos de la misma versión y período: detectados antes de producción + encontrados en producción.
