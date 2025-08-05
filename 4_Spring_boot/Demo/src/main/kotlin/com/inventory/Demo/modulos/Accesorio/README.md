# Módulo Accesorio - Refactorización

## Cambios Realizados

### 1. Modelo Accesorio
- **Antes**: Clase independiente con propiedades duplicadas
- **Después**: Hereda de `Dispositivo` usando herencia JOINED
- **Beneficios**: 
  - Reutilización de código
  - Consistencia en el modelo de datos
  - Herencia de todas las propiedades de Dispositivo

### 2. Nuevos DTOs
- **AccesorioRequest**: Para peticiones de creación/actualización
- **AccesorioResponseDTO**: Para respuestas con información completa
- **Beneficios**: Separación clara entre modelo de dominio y API

### 3. Repositorio Actualizado
- Extiende de `JpaRepository<Accesorio, Long>`
- Métodos específicos para búsquedas por:
  - Tipo de accesorio
  - Estado (disponible, asignado, etc.)
  - Sede
  - Categoría
  - Combos vs individuales

### 4. Servicio Refactorizado
- Manejo de DTOs para entrada y salida
- Validación de relaciones (Categoría, Sede)
- Manejo de combos de accesorios
- Métodos de búsqueda especializados

### 5. Controlador Mejorado
- Endpoints RESTful completos
- Uso de DTOs para entrada/salida
- Endpoints adicionales para filtros específicos

## Endpoints Disponibles

### CRUD Básico
- `POST /api/accesorios` - Crear accesorio
- `GET /api/accesorios/{id}` - Obtener por ID
- `GET /api/accesorios` - Obtener todos
- `PUT /api/accesorios/{id}` - Actualizar
- `DELETE /api/accesorios/{id}` - Eliminar

### Filtros Específicos
- `GET /api/accesorios/simples` - Solo accesorios individuales
- `GET /api/accesorios/combos` - Solo combos
- `GET /api/accesorios/tipo/{tipo}` - Por tipo de accesorio
- `GET /api/accesorios/estado/{estado}` - Por estado
- `GET /api/accesorios/disponibles` - Solo disponibles
- `GET /api/accesorios/sede/{sedeId}` - Por sede
- `GET /api/accesorios/categoria/{categoriaId}` - Por categoría

## Estructura de Datos

### AccesorioRequest
```json
{
  "item": "string",
  "serial": "string",
  "modelo": "string",
  "marca": "string",
  "categoriaId": 1,
  "sedeId": 1,
  "estado": "DISPONIBLE",
  "clasificacion": "string",
  "fechaAdquisicion": "2024-01-01",
  "costo": 100.0,
  "funcional": true,
  "codigoActivo": "string",
  "tipo": "string",
  "observaciones": "string",
  "tipoAccesorio": "Cargador",
  "esCombo": false,
  "accesoriosComboIds": [1, 2, 3]
}
```

### AccesorioResponseDTO
```json
{
  "dispositivoId": 1,
  "item": "string",
  "serial": "string",
  "modelo": "string",
  "marca": "string",
  "categoria": "string",
  "sede": "string",
  "estado": "DISPONIBLE",
  "clasificacion": "string",
  "fechaAdquisicion": "2024-01-01",
  "costo": 100.0,
  "funcional": true,
  "codigoActivo": "string",
  "tipo": "string",
  "observaciones": "string",
  "tipoAccesorio": "Cargador",
  "esCombo": false,
  "accesoriosCombo": []
}
```

## Migración de Base de Datos

La refactorización requiere cambios en la base de datos:

1. La tabla `accesorios` ahora hereda de `dispositivos`
2. Se mantiene la columna `tipo_dispositivo` con valor "ACCESORIO"
3. Las propiedades duplicadas se eliminan de la tabla `accesorios`
4. Se mantienen solo las propiedades específicas: `tipo_accesorio`, `es_combo`

## Notas Importantes

- Los accesorios ahora son dispositivos especializados
- Se mantiene la funcionalidad de combos
- Compatibilidad con el sistema de asignaciones existente
- Reutilización de la lógica de dispositivos 