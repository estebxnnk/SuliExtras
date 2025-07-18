package com.inventory.Demo.modulos.Accesorio.controller

import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import com.inventory.Demo.modulos.Accesorio.service.AccesorioService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/accesorios")
class AccesorioController(private val accesorioService: AccesorioService) {

    /**
     * Crea un accesorio individual o combo.
     * Si es combo, debe tener esCombo=true y accesoriosCombo con los accesorios que lo componen.
     */
    @PostMapping
    fun crearAccesorio(@RequestBody accesorio: Accesorio): ResponseEntity<Accesorio> {
        val creado = accesorioService.save(accesorio)
        return ResponseEntity.ok(creado)
    }

    /**
     * Obtiene un accesorio por su ID.
     */
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Long): ResponseEntity<Accesorio> {
        val accesorio = accesorioService.findById(id)
        return accesorio?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    }

    /**
     * Obtiene todos los accesorios simples (no combos).
     */
    @GetMapping("/simples")
    fun obtenerSimples(): ResponseEntity<List<Accesorio>> =
        ResponseEntity.ok(accesorioService.findAllSimples())

    /**
     * Obtiene todos los combos de accesorios.
     */
    @GetMapping("/combos")
    fun obtenerCombos(): ResponseEntity<List<Accesorio>> =
        ResponseEntity.ok(accesorioService.findAllCombos())

    /**
     * Actualiza un accesorio existente por su ID.
     */
    @PutMapping("/{id}")
    fun actualizarAccesorio(@PathVariable id: Long, @RequestBody accesorio: Accesorio): ResponseEntity<Accesorio> {
        val actualizado = accesorioService.update(id, accesorio)
        return actualizado?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    }

    /**
     * Elimina un accesorio por su ID.
     */
    @DeleteMapping("/{id}")
    fun eliminarAccesorio(@PathVariable id: Long): ResponseEntity<Void> {
        return if (accesorioService.delete(id)) ResponseEntity.noContent().build() else ResponseEntity.notFound().build()
    }
} 