package com.inventory.Demo.modulos.Area.controller

import com.inventory.Demo.modulos.Area.model.Area
import com.inventory.Demo.modulos.Area.service.AreaService
import com.inventory.Demo.modulos.Sede.service.SedeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

// Agregar DTO para crear y actualizar áreas
data class AreaRequest(
    val nombre: String,
    val clase: String?,
    val proceso: String,
    val canal: String?,
    val subCanal: String?,
    val sedeId: Long
)

@RestController
@RequestMapping("/api/areas")
class AreaController(
    private val areaService: AreaService,
    @Autowired private val sedeService: SedeService
) {

    @GetMapping
    fun getAll(): List<Area> = areaService.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Area> =
        areaService.findById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    fun create(@RequestBody areaRequest: AreaRequest): ResponseEntity<Area> {
        val sede = sedeService.findById(areaRequest.sedeId)
            ?: return ResponseEntity.notFound().build()
        val area = Area(
            nombre = areaRequest.nombre,
            clase = areaRequest.clase,
            proceso = areaRequest.proceso,
            canal = areaRequest.canal,
            subCanal = areaRequest.subCanal,
            sede = sede
        )
        return ResponseEntity.ok(areaService.save(area))
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody areaRequest: AreaRequest): ResponseEntity<Area> {
        val actual = areaService.findById(id) ?: return ResponseEntity.notFound().build()
        val sede = sedeService.findById(areaRequest.sedeId)
            ?: return ResponseEntity.notFound().build()
        val actualizada = Area(
            id = actual.id,
            nombre = areaRequest.nombre,
            clase = areaRequest.clase,
            proceso = areaRequest.proceso,
            canal = areaRequest.canal,
            subCanal = areaRequest.subCanal,
            sede = sede
        )
        return ResponseEntity.ok(areaService.save(actualizada))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (areaService.findById(id) != null) {
            areaService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 