package com.inventory.Demo.modulos.Sede.controller

import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Sede.service.SedeService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/sedes")
class SedeController(private val sedeService: SedeService) {

    @GetMapping
    fun getAll(): List<Sede> = sedeService.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Sede> =
        sedeService.findById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    fun create(@RequestBody sede: Sede): Sede = sedeService.save(sede)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody sede: Sede): ResponseEntity<Sede> =
        sedeService.update(id, sede)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (sedeService.findById(id) != null) {
            sedeService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 