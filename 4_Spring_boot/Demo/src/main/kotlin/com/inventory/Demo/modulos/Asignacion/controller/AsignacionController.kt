package com.inventory.Demo.modulos.Asignacion.controller

import com.inventory.Demo.modulos.Asignacion.model.Asignacion
import com.inventory.Demo.modulos.Asignacion.service.AsignacionService
import com.inventory.Demo.modulos.Asignacion.dto.AsignacionRequest
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import com.inventory.Demo.modulos.Empleado.service.EmpleadoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/asignaciones")
class AsignacionController(
    private val asignacionService: AsignacionService,
    private val dispositivoService: DispositivoService,
    private val empleadoService: EmpleadoService
) {
    @GetMapping
    fun getAll(): List<Asignacion> = asignacionService.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Asignacion> =
        asignacionService.findById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    fun create(@RequestBody request: AsignacionRequest): ResponseEntity<Asignacion> {
        val dispositivo = dispositivoService.findById(request.dispositivoId)
            ?: return ResponseEntity.badRequest().build()
        val empleado = empleadoService.findById(request.empleadoId)
            ?: return ResponseEntity.badRequest().build()
        val asignacion = Asignacion(
            dispositivo = dispositivo,
            empleado = empleado,
            fechaAsignacion = request.fechaAsignacion,
            fechaFinalizacion = request.fechaFinalizacion,
            motivoFinalizacion = request.motivoFinalizacion,
            fechaDevolucion = request.fechaDevolucion,
            comentario = request.comentario,
            observaciones = request.observaciones
        )
        return ResponseEntity.ok(asignacionService.save(asignacion))
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: AsignacionRequest): ResponseEntity<Asignacion> {
        val dispositivo = dispositivoService.findById(request.dispositivoId)
            ?: return ResponseEntity.badRequest().build()
        val empleado = empleadoService.findById(request.empleadoId)
            ?: return ResponseEntity.badRequest().build()
        val asignacionActual = asignacionService.findById(id)
            ?: return ResponseEntity.notFound().build()
        val asignacionActualizada = asignacionActual.copy(
            dispositivo = dispositivo,
            empleado = empleado,
            fechaAsignacion = request.fechaAsignacion,
            fechaFinalizacion = request.fechaFinalizacion,
            motivoFinalizacion = request.motivoFinalizacion,
            fechaDevolucion = request.fechaDevolucion,
            comentario = request.comentario,
            observaciones = request.observaciones
        )
        return ResponseEntity.ok(asignacionService.save(asignacionActualizada))
    }

    @PostMapping("/reasignar")
    fun reasignarDispositivo(@RequestBody request: AsignacionRequest): ResponseEntity<Asignacion> {
        val dispositivo = dispositivoService.findById(request.dispositivoId)
            ?: return ResponseEntity.badRequest().build()
        val empleado = empleadoService.findById(request.empleadoId)
            ?: return ResponseEntity.badRequest().build()
        val nuevaAsignacion = Asignacion(
            dispositivo = dispositivo,
            empleado = empleado,
            fechaAsignacion = request.fechaAsignacion,
            fechaFinalizacion = request.fechaFinalizacion,
            motivoFinalizacion = request.motivoFinalizacion,
            fechaDevolucion = request.fechaDevolucion,
            comentario = request.comentario,
            observaciones = request.observaciones
        )
        return ResponseEntity.ok(asignacionService.reasignarDispositivo(request.dispositivoId, nuevaAsignacion))
    }

    @DeleteMapping("/eliminar-y-actualizar/{id}")
    fun eliminarAsignacionYActualizarDispositivo(@PathVariable id: Long): ResponseEntity<Void> {
        if (asignacionService.findById(id) != null) {
            asignacionService.eliminarAsignacionYActualizarDispositivo(id)
            return ResponseEntity.noContent().build()
        } else {
            return ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (asignacionService.findById(id) != null) {
            asignacionService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 