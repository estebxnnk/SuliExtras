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

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        asignacionService.delete(id)
        return ResponseEntity.noContent().build()
    }
} 