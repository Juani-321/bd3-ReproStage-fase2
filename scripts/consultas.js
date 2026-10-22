// Conectar a la base de datos
use('ReproStage');

// 1. Buscar todos los vehículos de una marca específica (ej: Volkswagen)
print("--- Vehículos Volkswagen ---");
const vw = db.vehiculos.find({ marca: "Volkswagen" }).toArray();
printjson(vw);

// 2. Filtrar intervenciones por tipo de servicio (ej: Stage 1)
print("--- Intervenciones Stage 1 ---");
const stage1 = db.intervenciones.find({ tipo_servicio: "Stage 1" }).toArray();
printjson(stage1);

// 3. Pipeline de Agregación: Obtener el promedio de RPM y Presión de Turbo por vehículo en base a la telemetría
print("--- Promedios de Telemetría por Vehículo ---");
const promedios = db.telemetria.aggregate([
  {
    $group: {
      _id: "$vehiculo_patente",
      rpm_promedio: { $avg: "$parametros.rpm" },
      presion_turbo_promedio: { $avg: "$parametros.presion_turbo" },
      lecturas_totales: { $sum: 1 }
    }
  }
]).toArray();
printjson(promedios);