package com.inventory.Demo.modulos.Dispositivo.controller.TiposDispositivos

import com.inventory.Demo.modulos.Dispositivo.InterfaceDispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Computador
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/computadores")
class ComputadorController(
    private val dispositivoService: DispositivoService
) : InterfaceDispositivo<Computador, Long> {

    @GetMapping
    override fun getAll(): ResponseEntity<List<Computador>> = ResponseEntity.ok(dispositivoService.findAllByType(Computador::class.java))

    @GetMapping("/{id}")
    override fun getById(@PathVariable id: Long): ResponseEntity<Computador> =
        dispositivoService.findByIdAndType(id, Computador::class.java)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    override fun create(@RequestBody computador: Computador): ResponseEntity<Computador> =
        ResponseEntity.ok(dispositivoService.save(computador) as Computador)

    @PutMapping("/{id}")
    override fun update(@PathVariable id: Long, @RequestBody computador: Computador): ResponseEntity<Computador> {
        val actualizado = dispositivoService.update(id, computador) as? Computador
        return if (actualizado != null) ResponseEntity.ok(actualizado)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    override fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (dispositivoService.findByIdAndType(id, Computador::class.java) != null) {
            dispositivoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 