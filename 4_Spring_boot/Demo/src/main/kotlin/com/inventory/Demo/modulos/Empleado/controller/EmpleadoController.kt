package com.inventory.Demo.modulos.Empleado.controller

import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Empleado.service.EmpleadoService
import com.inventory.Demo.modulos.Empleado.dto.EmpleadoRequest
import com.inventory.Demo.modulos.Area.service.AreaService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/empleados")
class EmpleadoController(
    private val empleadoService: EmpleadoService,
    private val areaService: AreaService
) {

    @GetMapping
    fun getAll(): List<Empleado> = empleadoService.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Empleado> =
        empleadoService.findById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/area/{areaId}")
    fun getByArea(@PathVariable areaId: Long): List<Empleado> = empleadoService.findByAreaId(areaId)

    @PostMapping
    fun create(@RequestBody request: EmpleadoRequest): ResponseEntity<Empleado> {
        val area = areaService.findById(request.areaId)
            ?: return ResponseEntity.badRequest().build()
        val empleado = Empleado(
            documentoIdentidad = request.documentoIdentidad,
            nombreCompleto = request.nombreCompleto,
            cargo = request.cargo,
            email = request.email,
            telefono = request.telefono,
            lineaCorporativa = request.lineaCorporativa,
            area = area
        )
        return ResponseEntity.ok(empleadoService.save(empleado))
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: EmpleadoRequest): ResponseEntity<Empleado> {
        val area = areaService.findById(request.areaId)
            ?: return ResponseEntity.badRequest().build()
        val empleadoActual = empleadoService.findById(id)
            ?: return ResponseEntity.notFound().build()
        val empleadoActualizado = Empleado(
            id = empleadoActual.id,
            documentoIdentidad = request.documentoIdentidad,
            nombreCompleto = request.nombreCompleto,
            cargo = request.cargo,
            email = request.email,
            telefono = request.telefono,
            lineaCorporativa = request.lineaCorporativa,
            area = area
        )
        return ResponseEntity.ok(empleadoService.save(empleadoActualizado))
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