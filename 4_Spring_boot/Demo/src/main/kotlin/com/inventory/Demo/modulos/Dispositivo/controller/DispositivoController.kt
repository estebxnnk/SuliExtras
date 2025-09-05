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

    /**
     * Valida y actualiza el estado de un dispositivo específico basado en sus asignaciones
     */
    @PostMapping("/{id}/validar-estado")
    fun validarEstadoDispositivo(@PathVariable id: Long): ResponseEntity<Map<String, String>> {
        return try {
            val nuevoEstado = dispositivoService.validarYActualizarEstadoDispositivo(id)
            val dispositivo = dispositivoService.findById(id)
            ResponseEntity.ok(mapOf(
                "dispositivoId" to id.toString(),
                "serial" to (dispositivo?.serial ?: ""),
                "estadoAnterior" to (dispositivo?.estado?.name ?: ""),
                "estadoNuevo" to nuevoEstado.name,
                "mensaje" to "Estado validado y actualizado correctamente"
            ))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf(
                "error" to (e.message ?: "Error desconocido"),
                "dispositivoId" to id.toString()
            ))
        }
    }

    /**
     * Valida y actualiza el estado de todos los dispositivos
     */
    @PostMapping("/validar-estados-todos")
    fun validarEstadosTodosDispositivos(): ResponseEntity<Map<String, String>> {
        return try {
            dispositivoService.validarYActualizarEstadosTodosDispositivos()
            ResponseEntity.ok(mapOf(
                "mensaje" to "Validación de estados completada para todos los dispositivos"
            ))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf(
                "error" to "Error durante la validación: ${e.message}"
            ))
        }
    }
} 