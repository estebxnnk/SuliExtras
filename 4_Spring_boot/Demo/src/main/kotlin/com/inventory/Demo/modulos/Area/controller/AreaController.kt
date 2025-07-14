package com.inventory.Demo.modulos.Area.controller

import com.inventory.Demo.modulos.Area.model.Area
import com.inventory.Demo.modulos.Area.service.AreaService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/areas")
class AreaController(private val areaService: AreaService) {

    @GetMapping
    fun getAll(): List<Area> = areaService.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Area> =
        areaService.findById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    fun create(@RequestBody area: Area): ResponseEntity<Area> =
        ResponseEntity.ok(areaService.save(area))

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody area: Area): ResponseEntity<Area> {
        val actual = areaService.findById(id) ?: return ResponseEntity.notFound().build()
        val actualizada = Area(
            id = actual.id,
            nombre = area.nombre,
            subarea = area.subarea,
            tipoArea = area.tipoArea
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