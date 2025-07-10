package com.inventory.Demo.modulos.Dispositivo.controller

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/dispositivos")
class DispositivoController(
    private val dispositivoService: DispositivoService
) {
    @GetMapping
    fun getAll(): List<Dispositivo> = dispositivoService.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Dispositivo> =
        dispositivoService.findById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody dispositivo: Dispositivo): ResponseEntity<Dispositivo> {
        val actualizado = dispositivoService.update(id, dispositivo)
        return if (actualizado != null) ResponseEntity.ok(actualizado)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (dispositivoService.findById(id) != null) {
            dispositivoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 