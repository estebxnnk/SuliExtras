package com.inventory.Demo.modulos.Dispositivo.controller.TiposDispositivos

import com.inventory.Demo.modulos.Dispositivo.InterfaceDispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Celular
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/celulares")
class CelularController(
    private val dispositivoService: DispositivoService
) : InterfaceDispositivo<Celular, Long> {

    @GetMapping
    override fun getAll(): ResponseEntity<List<Celular>> = ResponseEntity.ok(dispositivoService.findAllByType(Celular::class.java))

    @GetMapping("/{id}")
    override fun getById(@PathVariable id: Long): ResponseEntity<Celular> =
        dispositivoService.findByIdAndType(id, Celular::class.java)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    override fun create(@RequestBody celular: Celular): ResponseEntity<Celular> =
        ResponseEntity.ok(dispositivoService.save(celular) as Celular)

    @PutMapping("/{id}")
    override fun update(@PathVariable id: Long, @RequestBody celular: Celular): ResponseEntity<Celular> {
        val actualizado = dispositivoService.update(id, celular) as? Celular
        return if (actualizado != null) ResponseEntity.ok(actualizado)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    override fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (dispositivoService.findByIdAndType(id, Celular::class.java) != null) {
            dispositivoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 