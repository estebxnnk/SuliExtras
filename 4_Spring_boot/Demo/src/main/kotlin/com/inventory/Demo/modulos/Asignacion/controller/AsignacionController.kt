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

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        asignacionService.delete(id)
        return ResponseEntity.noContent().build()
    }
} 