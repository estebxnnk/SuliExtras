package com.inventory.Demo.modulos.Dispositivo.controller.TiposDispositivos

import com.inventory.Demo.modulos.Dispositivo.InterfaceDispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Intercomunicador
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/intercomunicadores")
class IntercomunicadorController(
    private val dispositivoService: DispositivoService
) : InterfaceDispositivo<Intercomunicador, Long> {

    @GetMapping
    override fun getAll(): ResponseEntity<List<Intercomunicador>> = ResponseEntity.ok(dispositivoService.findAllByType(Intercomunicador::class.java))

    @GetMapping("/{id}")
    override fun getById(@PathVariable id: Long): ResponseEntity<Intercomunicador> =
        dispositivoService.findByIdAndType(id, Intercomunicador::class.java)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    override fun create(@RequestBody intercomunicador: Intercomunicador): ResponseEntity<Intercomunicador> =
        ResponseEntity.ok(dispositivoService.save(intercomunicador) as Intercomunicador)

    @PutMapping("/{id}")
    override fun update(@PathVariable id: Long, @RequestBody intercomunicador: Intercomunicador): ResponseEntity<Intercomunicador> {
        val actualizado = dispositivoService.update(id, intercomunicador) as? Intercomunicador
        return if (actualizado != null) ResponseEntity.ok(actualizado)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    override fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (dispositivoService.findByIdAndType(id, Intercomunicador::class.java) != null) {
            dispositivoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 