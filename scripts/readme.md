# ReproStage (TuningTrack) - Fase 2: Implementación y Consultas CRUD (NoSQL)

## 1. Objetivo
Implementación física en MongoDB del modelo de gestión de telemetría y reprogramación automotriz diseñado en la Fase 1. El proyecto demuestra el uso de un esquema flexible (schema-less) y la ejecución de consultas de lectura y escritura mediante MQL.

## 2. Dataset de Prueba (Seeding)
Los archivos de sembrado de datos en formato JSON se encuentran en el directorio `/scripts`. Se diseñó un esquema dinámico donde los documentos varían su estructura para adaptarse a la realidad del negocio automotriz (ej. algunos vehículos contienen propiedades anidadas exclusivas como `modificaciones_audio`, `presion_turbo_max_bar` o `sistema_combustible_alternativo`).

## 3. Pruebas de Consultas de Lectura (Read)

**1. Coincidencia Exacta**
* **Problema de Negocio:** Filtrar vehículos de una marca específica para segmentar campañas de repuestos oficiales.
* **MQL:** `db.vehiculos.find({ marca: "Volkswagen" });`
* **Evidencia:** ![Consulta 1](docs/captura_read_1.png)

**2. Operadores de Comparación ($gt)**
* **Problema de Negocio:** Identificar intervenciones de alto ticket (costo mayor a $200,000) para el análisis de facturación.
* **MQL:** `db.intervenciones.find({ costo_total: { $gt: 200000 } });`
* **Evidencia:** ![Consulta 2](docs/captura_read_2.png)

**3. Notación de Punto (Dot Notation)**
* **Problema de Negocio:** Buscar vehículos que tengan un mapa de inyección Nivel Stage 2 para ofrecerles mejoras de hardware compatibles.
* **MQL:** `db.vehiculos.find({ "estado_actual.nivel_stage": 2 });`
* **Evidencia:** ![Consulta 3](docs/captura_read_3.png)

**4. Proyección Específica**
* **Problema de Negocio:** Mostrar un listado limpio de los autos ingresados en el tablero de recepción, ocultando los metadatos internos (`_id`).
* **MQL:** `db.vehiculos.find({}, { _id: 0, dominio: 1, marca: 1, modelo: 1 });`
* **Evidencia:** ![Consulta 4](docs/captura_read_4.png)

**5. Filtrado en Arreglos ($elemMatch)**
* **Problema de Negocio:** Auditar el historial de intervenciones mecánicas buscando exclusivamente los trabajos de flasheo de ECU.
* **MQL:** `db.intervenciones.find({ modificaciones: { $elemMatch: { componente: "ECU", accion: "Flasheo" } } });`
* **Evidencia:** ![Consulta 5](docs/captura_read_5.png)

## 4. Implementación de Actualizaciones Atómicas (Update & Delete)

**1. Modificación de campo simple y adición de nueva propiedad ($set)**
* **Problema de Negocio:** Actualizar el estado de un auto a Stage 1 y agregar un flag dinámico para que el sistema recuerde su próxima revisión.
* **MQL:** `db.vehiculos.updateOne({ dominio: "KVM123" }, { $set: { "estado_actual.nivel_stage": 1, "requiere_revision_km": true } });`
* **Evidencia:** ![Update 1](docs/captura_update_1.png)

**2. Incremento de contador numérico ($inc)**
* **Problema de Negocio:** Sumar 15 HP a la potencia estimada del vehículo en la base de datos tras verificar la mejora en el dinamómetro.
* **MQL:** `db.vehiculos.updateOne({ dominio: "AD456EF" }, { $inc: { "estado_actual.potencia_estimada_hp": 15 } });`
* **Evidencia:** ![Update 2](docs/captura_update_2.png)

**3. Eliminación Segura Estricta (deleteMany)**
* **Problema de Negocio:** Limpiar la base de datos eliminando registros de intervenciones que fueron canceladas por el cliente antes de ingresar al taller.
* **MQL:** `db.intervenciones.deleteMany({ costo_total: 0, tipo_trabajo: "Cancelado" });`
* **Evidencia:** ![Delete 1](docs/captura_delete_1.png)