package com.inventory.Demo.modulos.Accesorio.controller

import com.inventory.Demo.modulos.Accesorio.dto.AccesorioRequest
import com.inventory.Demo.modulos.Accesorio.dto.AccesorioResponseDTO
import com.inventory.Demo.modulos.Accesorio.service.AccesorioService
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/accesorios")
class AccesorioController(private val accesorioService: AccesorioService) {

    /**
     * Crea un nuevo accesorio
     */
    @PostMapping
    fun crearAccesorio(@RequestBody accesorioRequest: AccesorioRequest): ResponseEntity<AccesorioResponseDTO> {
        val creado = accesorioService.create(accesorioRequest)
        return ResponseEntity.ok(creado)
    }

    /**
     * Obtiene un accesorio por su ID
     */
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Long): ResponseEntity<AccesorioResponseDTO> {
        val accesorio = accesorioService.findById(id)
        return accesorio?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    }

    /**
     * Obtiene todos los accesorios
     */
    @GetMapping
    fun obtenerTodos(): ResponseEntity<List<AccesorioResponseDTO>> =
        ResponseEntity.ok(accesorioService.findAll())

    /**
     * Obtiene todos los accesorios simples (no combos)
     */
    @GetMapping("/simples")
    fun obtenerSimples(): ResponseEntity<List<AccesorioResponseDTO>> =
        ResponseEntity.ok(accesorioService.findAllSimples())

    /**
     * Obtiene todos los combos de accesorios
     */
    @GetMapping("/combos")
    fun obtenerCombos(): ResponseEntity<List<AccesorioResponseDTO>> =
        ResponseEntity.ok(accesorioService.findAllCombos())

    /**
     * Obtiene accesorios por tipo
     */
    @GetMapping("/tipo/{tipoAccesorio}")
    fun obtenerPorTipo(@PathVariable tipoAccesorio: String): ResponseEntity<List<AccesorioResponseDTO>> =
        ResponseEntity.ok(accesorioService.findByTipoAccesorio(tipoAccesorio))

    /**
     * Obtiene accesorios por estado
     */
    @GetMapping("/estado/{estado}")
    fun obtenerPorEstado(@PathVariable estado: EstadoDispositivo): ResponseEntity<List<AccesorioResponseDTO>> =
        ResponseEntity.ok(accesorioService.findByEstado(estado))

    /**
     * Obtiene accesorios disponibles
     */
    @GetMapping("/disponibles")
    fun obtenerDisponibles(): ResponseEntity<List<AccesorioResponseDTO>> =
        ResponseEntity.ok(accesorioService.findDisponibles())

    /**
     * Obtiene accesorios por sede
     */
    @GetMapping("/sede/{sedeId}")
    fun obtenerPorSede(@PathVariable sedeId: Long): ResponseEntity<List<AccesorioResponseDTO>> =
        ResponseEntity.ok(accesorioService.findBySedeId(sedeId))

    /**
     * Obtiene accesorios por categoría
     */
    @GetMapping("/categoria/{categoriaId}")
    fun obtenerPorCategoria(@PathVariable categoriaId: Long): ResponseEntity<List<AccesorioResponseDTO>> =
        ResponseEntity.ok(accesorioService.findByCategoriaId(categoriaId))

    /**
     * Actualiza un accesorio existente
     */
    @PutMapping("/{id}")
    fun actualizarAccesorio(@PathVariable id: Long, @RequestBody accesorioRequest: AccesorioRequest): ResponseEntity<AccesorioResponseDTO> {
        val actualizado = accesorioService.update(id, accesorioRequest)
        return actualizado?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    }

    /**
     * Elimina un accesorio por su ID
     */
    @DeleteMapping("/{id}")
    fun eliminarAccesorio(@PathVariable id: Long): ResponseEntity<Void> {
        return if (accesorioService.delete(id)) ResponseEntity.noContent().build() else ResponseEntity.notFound().build()
    }
} 