# Ejemplos de Uso - API Accesorios

## 1. Crear un Accesorio Simple

```bash
curl -X POST http://localhost:8080/api/accesorios \
  -H "Content-Type: application/json" \
  -d '{
    "item": "Cargador Laptop HP",
    "serial": "CHG001",
    "modelo": "HP-65W",
    "marca": "HP",
    "categoriaId": 1,
    "sedeId": 1,
    "estado": "DISPONIBLE",
    "clasificacion": "Accesorio",
    "fechaAdquisicion": "2024-01-15",
    "costo": 45.99,
    "funcional": true,
    "codigoActivo": "ACC001",
    "tipo": "Cargador",
    "observaciones": "Cargador original HP",
    "tipoAccesorio": "Cargador",
    "esCombo": false,
    "accesoriosComboIds": []
  }'
```

## 2. Crear un Combo de Accesorios

```bash
curl -X POST http://localhost:8080/api/accesorios \
  -H "Content-Type: application/json" \
  -d '{
    "item": "Kit Computador Completo",
    "serial": "KIT001",
    "modelo": "Kit-Office",
    "marca": "Varios",
    "categoriaId": 1,
    "sedeId": 1,
    "estado": "DISPONIBLE",
    "clasificacion": "Accesorio",
    "fechaAdquisicion": "2024-01-15",
    "costo": 150.00,
    "funcional": true,
    "codigoActivo": "KIT001",
    "tipo": "Kit",
    "observaciones": "Kit completo para oficina",
    "tipoAccesorio": "Kit",
    "esCombo": true,
    "accesoriosComboIds": [1, 2, 3, 4]
  }'
```

## 3. Obtener Todos los Accesorios

```bash
curl -X GET http://localhost:8080/api/accesorios
```

## 4. Obtener Accesorio por ID

```bash
curl -X GET http://localhost:8080/api/accesorios/1
```

## 5. Obtener Solo Accesorios Simples

```bash
curl -X GET http://localhost:8080/api/accesorios/simples
```

## 6. Obtener Solo Combos

```bash
curl -X GET http://localhost:8080/api/accesorios/combos
```

## 7. Buscar por Tipo de Accesorio

```bash
curl -X GET http://localhost:8080/api/accesorios/tipo/Cargador
```

## 8. Buscar por Estado

```bash
curl -X GET http://localhost:8080/api/accesorios/estado/DISPONIBLE
```

## 9. Obtener Accesorios Disponibles

```bash
curl -X GET http://localhost:8080/api/accesorios/disponibles
```

## 10. Buscar por Sede

```bash
curl -X GET http://localhost:8080/api/accesorios/sede/1
```

## 11. Buscar por Categoría

```bash
curl -X GET http://localhost:8080/api/accesorios/categoria/1
```

## 12. Actualizar un Accesorio

```bash
curl -X PUT http://localhost:8080/api/accesorios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "item": "Cargador Laptop HP Actualizado",
    "serial": "CHG001",
    "modelo": "HP-65W",
    "marca": "HP",
    "categoriaId": 1,
    "sedeId": 1,
    "estado": "ASIGNADO",
    "clasificacion": "Accesorio",
    "fechaAdquisicion": "2024-01-15",
    "costo": 45.99,
    "funcional": true,
    "codigoActivo": "ACC001",
    "tipo": "Cargador",
    "observaciones": "Cargador actualizado",
    "tipoAccesorio": "Cargador",
    "esCombo": false,
    "accesoriosComboIds": []
  }'
```

## 13. Eliminar un Accesorio

```bash
curl -X DELETE http://localhost:8080/api/accesorios/1
```

## Respuestas de Ejemplo

### Respuesta de Creación/Actualización
```json
{
  "dispositivoId": 1,
  "item": "Cargador Laptop HP",
  "serial": "CHG001",
  "modelo": "HP-65W",
  "marca": "HP",
  "categoria": "Accesorios",
  "sede": "Sede Principal",
  "estado": "DISPONIBLE",
  "clasificacion": "Accesorio",
  "fechaAdquisicion": "2024-01-15",
  "costo": 45.99,
  "funcional": true,
  "codigoActivo": "ACC001",
  "tipo": "Cargador",
  "observaciones": "Cargador original HP",
  "tipoAccesorio": "Cargador",
  "esCombo": false,
  "accesoriosCombo": []
}
```

### Respuesta de Lista
```json
[
  {
    "dispositivoId": 1,
    "item": "Cargador Laptop HP",
    "serial": "CHG001",
    "modelo": "HP-65W",
    "marca": "HP",
    "categoria": "Accesorios",
    "sede": "Sede Principal",
    "estado": "DISPONIBLE",
    "clasificacion": "Accesorio",
    "fechaAdquisicion": "2024-01-15",
    "costo": 45.99,
    "funcional": true,
    "codigoActivo": "ACC001",
    "tipo": "Cargador",
    "observaciones": "Cargador original HP",
    "tipoAccesorio": "Cargador",
    "esCombo": false,
    "accesoriosCombo": []
  }
]
```

## Estados Disponibles

- `DISPONIBLE`: Accesorio disponible para asignación
- `ASIGNADO`: Accesorio asignado a un empleado
- `MANTENIMIENTO`: Accesorio en mantenimiento
- `BAJA`: Accesorio dado de baja

## Tipos de Accesorio Comunes

- Cargador
- Mouse
- Teclado
- Audífonos
- Monitor
- Cable
- Kit
- Otros 