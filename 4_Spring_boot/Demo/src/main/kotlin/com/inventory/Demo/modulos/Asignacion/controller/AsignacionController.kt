package com.inventory.Demo.modulos.Asignacion.controller

import com.inventory.Demo.modulos.Asignacion.model.Asignacion
import com.inventory.Demo.modulos.Asignacion.service.AsignacionService
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import com.inventory.Demo.modulos.Empleado.service.EmpleadoService
import com.inventory.Demo.modulos.Accesorio.service.AccesorioService
import com.inventory.Demo.modulos.Asignacion.dto.AsignacionRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import com.inventory.Demo.modulos.Asignacion.dto.AsignacionResponseDTO

@RestController
@RequestMapping("/api/asignaciones")
class AsignacionController(
    private val asignacionService: AsignacionService,
    private val dispositivoService: DispositivoService,
    private val empleadoService: EmpleadoService,
    private val accesorioService: AccesorioService
) {


    @GetMapping
    fun getAll(): List<Asignacion> = asignacionService.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Asignacion> =
        asignacionService.findById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    fun create(@RequestBody dto: AsignacionRequest): ResponseEntity<Asignacion> {
        val saved = asignacionService.create(dto)
        return ResponseEntity.ok(saved)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody dto: AsignacionRequest): ResponseEntity<Asignacion> {
        return try {
            val actualizado = asignacionService.update(id, dto)
            if (actualizado != null) ResponseEntity.ok(actualizado)
            else ResponseEntity.badRequest().build()
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(null)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(null)
        }
    }

    @Operation(summary = "Finalizar una asignación", description = "Finaliza una asignación y actualiza el estado del dispositivo según corresponda.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Asignación finalizada correctamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Asignacion::class))]),
            ApiResponse(responseCode = "400", description = "Solicitud inválida o asignación ya finalizada",
                content = [Content()]),
            ApiResponse(responseCode = "404", description = "Asignación no encontrada",
                content = [Content()])
        ]
    )
    @PutMapping("/{id}/finalizar")
    fun finalizarAsignacion(
        @Parameter(description = "ID de la asignación a finalizar")
        @PathVariable id: Long,
        @Parameter(description = "Motivo de la finalización")
        @RequestParam(required = false) motivo: String?
    ): ResponseEntity<Asignacion> {
        return try {
            val finalizada = asignacionService.finalizarAsignacion(id, motivo)
            if (finalizada != null) ResponseEntity.ok(finalizada)
            else ResponseEntity.notFound().build()
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(null)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(null)
        }
    }

    @Operation(summary = "Cambiar estado de asignación a INACTIVA", description = "Cambia el estado de una asignación a INACTIVA y actualiza el estado del dispositivo.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Asignación desactivada correctamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Asignacion::class))]),
            ApiResponse(responseCode = "400", description = "Solicitud inválida o asignación ya finalizada",
                content = [Content()]),
            ApiResponse(responseCode = "404", description = "Asignación no encontrada",
                content = [Content()])
        ]
    )
    @PutMapping("/{id}/desactivar")
    fun desactivarAsignacion(
        @Parameter(description = "ID de la asignación a desactivar")
        @PathVariable id: Long,
        @Parameter(description = "Motivo de la desactivación")
        @RequestParam(required = false) motivo: String?
    ): ResponseEntity<Asignacion> {
        return try {
            val desactivada = asignacionService.desactivarAsignacion(id, motivo)
            if (desactivada != null) ResponseEntity.ok(desactivada)
            else ResponseEntity.notFound().build()
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(null)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(null)
        }
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        asignacionService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // NUEVOS ENDPOINTS PARA CONSULTAR HISTORIAL

    @Operation(summary = "Obtener historial de asignaciones de un dispositivo", 
               description = "Retorna todas las asignaciones (activas, finalizadas e inactivas) de un dispositivo específico.")
    @GetMapping("/dispositivo/{dispositivoId}/historial")
    fun getHistorialByDispositivoId(
        @Parameter(description = "ID del dispositivo")
        @PathVariable dispositivoId: Long
    ): ResponseEntity<List<AsignacionResponseDTO>> {
        val historial = asignacionService.findHistorialByDispositivoId(dispositivoId)
        val historialDTO = historial.map { asignacion ->
            // Determinar si es una reasignación (no es la primera asignación)
            val esReasignacion = historial.indexOf(asignacion) > 0
            AsignacionResponseDTO.fromAsignacion(asignacion, esReasignacion)
        }
        return ResponseEntity.ok(historialDTO)
    }

    @Operation(summary = "Obtener asignación activa de un dispositivo", 
               description = "Retorna la asignación activa actual de un dispositivo, si existe.")
    @GetMapping("/dispositivo/{dispositivoId}/activa")
    fun getAsignacionActivaByDispositivoId(
        @Parameter(description = "ID del dispositivo")
        @PathVariable dispositivoId: Long
    ): ResponseEntity<AsignacionResponseDTO?> {
        val asignacionActiva = asignacionService.findAsignacionActivaByDispositivoId(dispositivoId)
        val asignacionDTO = asignacionActiva?.let { 
            AsignacionResponseDTO.fromAsignacion(it, false)
        }
        return ResponseEntity.ok(asignacionDTO)
    }

    @Operation(summary = "Verificar si un dispositivo está disponible", 
               description = "Retorna true si el dispositivo está disponible para asignación.")
    @GetMapping("/dispositivo/{dispositivoId}/disponible")
    fun isDispositivoDisponible(
        @Parameter(description = "ID del dispositivo")
        @PathVariable dispositivoId: Long
    ): ResponseEntity<Boolean> {
        val disponible = asignacionService.isDispositivoDisponible(dispositivoId)
        return ResponseEntity.ok(disponible)
    }

    @Operation(summary = "Obtener historial de asignaciones de un empleado", 
               description = "Retorna todas las asignaciones (activas, finalizadas e inactivas) de un empleado específico.")
    @GetMapping("/empleado/{empleadoId}/historial")
    fun getHistorialByEmpleadoId(
        @Parameter(description = "ID del empleado")
        @PathVariable empleadoId: Long
    ): ResponseEntity<List<Asignacion>> {
        val historial = asignacionService.findHistorialByEmpleadoId(empleadoId)
        return ResponseEntity.ok(historial)
    }

    @Operation(summary = "Obtener asignaciones activas de un empleado", 
               description = "Retorna las asignaciones activas de un empleado específico.")
    @GetMapping("/empleado/{empleadoId}/activas")
    fun getAsignacionesActivasByEmpleadoId(
        @Parameter(description = "ID del empleado")
        @PathVariable empleadoId: Long
    ): ResponseEntity<List<Asignacion>> {
        val asignacionesActivas = asignacionService.findAsignacionesActivasByEmpleadoId(empleadoId)
        return ResponseEntity.ok(asignacionesActivas)
    }

    @Operation(summary = "Obtener asignaciones finalizadas de un dispositivo", 
               description = "Retorna las asignaciones finalizadas de un dispositivo específico.")
    @GetMapping("/dispositivo/{dispositivoId}/finalizadas")
    fun getAsignacionesFinalizadasByDispositivoId(
        @Parameter(description = "ID del dispositivo")
        @PathVariable dispositivoId: Long
    ): ResponseEntity<List<Asignacion>> {
        val asignacionesFinalizadas = asignacionService.findAsignacionesFinalizadasByDispositivoId(dispositivoId)
        return ResponseEntity.ok(asignacionesFinalizadas)
    }

    @Operation(summary = "Obtener asignaciones por estado", 
               description = "Retorna las asignaciones filtradas por estado (ACTIVA, FINALIZADA, INACTIVA).")
    @GetMapping("/estado/{estado}")
    fun getAsignacionesByEstado(
        @Parameter(description = "Estado de las asignaciones")
        @PathVariable estado: String
    ): ResponseEntity<List<Asignacion>> {
        val asignaciones = when (estado.uppercase()) {
            "ACTIVA" -> asignacionService.findActivas()
            "FINALIZADA" -> asignacionService.findFinalizadas()
            "INACTIVA" -> asignacionService.findInactivas()
            else -> return ResponseEntity.badRequest().build()
        }
        return ResponseEntity.ok(asignaciones)
    }

    @Operation(summary = "Buscar asignaciones por dispositivoId", description = "Retorna todas las asignaciones asociadas a un dispositivo específico.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Asignaciones encontradas",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Asignacion::class))]),
            ApiResponse(responseCode = "404", description = "No se encontraron asignaciones para el dispositivo",
                content = [Content()])
        ]
    )
    @GetMapping("/dispositivo/{dispositivoId}")
    fun getAsignacionesByDispositivoId(
        @Parameter(description = "ID del dispositivo")
        @PathVariable dispositivoId: Long
    ): ResponseEntity<List<Asignacion>> {
        val asignaciones = asignacionService.findByDispositivoId(dispositivoId)
        return if (asignaciones.isNotEmpty()) ResponseEntity.ok(asignaciones)
        else ResponseEntity.notFound().build()
    }
} 