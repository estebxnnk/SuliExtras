package com.inventory.Demo.controller

import com.inventory.Demo.model.Empleado
import com.inventory.Demo.service.EmpleadoService
import com.inventory.Demo.service.SedeService
import com.inventory.Demo.dto.EmpleadoRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/empleados")
class EmpleadoController(
    private val empleadoService: EmpleadoService,
    private val sedeService: SedeService
) {

    @GetMapping
    fun getAll(): List<Empleado> = empleadoService.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Empleado> =
        empleadoService.findById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/por-sede/{sedeId}")
    fun getBySede(@PathVariable sedeId: Long): List<Empleado> = empleadoService.findBySedeId(sedeId)

    @PostMapping
    fun create(@RequestBody request: EmpleadoRequest): ResponseEntity<Empleado> {
        val sede = sedeService.findById(request.sedeId)
            ?: return ResponseEntity.badRequest().build()
        val empleado = Empleado(
            nombre = request.nombre,
            email = request.email,
            departamento = request.departamento,
            sede = sede
        )
        return ResponseEntity.ok(empleadoService.save(empleado))
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: EmpleadoRequest): ResponseEntity<Empleado> {
        val sede = sedeService.findById(request.sedeId)
            ?: return ResponseEntity.badRequest().build()
        val empleadoActual = empleadoService.findById(id)
            ?: return ResponseEntity.notFound().build()
        val empleadoActualizado = empleadoActual.copy(
            nombre = request.nombre,
            email = request.email,
            departamento = request.departamento,
            sede = sede
        )
        return ResponseEntity.ok(empleadoService.update(id, empleadoActualizado)!!)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (empleadoService.findById(id) != null) {
            empleadoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 