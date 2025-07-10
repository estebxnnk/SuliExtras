package com.inventory.Demo.modulos.Dispositivo.controller.TiposDispositivos

import com.inventory.Demo.modulos.Dispositivo.InterfaceDispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Pda
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/pdas")
class PdaController(
    private val dispositivoService: DispositivoService
) : InterfaceDispositivo<Pda, Long> {

    @GetMapping
    override fun getAll(): ResponseEntity<List<Pda>> = ResponseEntity.ok(dispositivoService.findAllByType(Pda::class.java))

    @GetMapping("/{id}")
    override fun getById(@PathVariable id: Long): ResponseEntity<Pda> =
        dispositivoService.findByIdAndType(id, Pda::class.java)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    override fun create(@RequestBody pda: Pda): ResponseEntity<Pda> =
        ResponseEntity.ok(dispositivoService.save(pda) as Pda)

    @PutMapping("/{id}")
    override fun update(@PathVariable id: Long, @RequestBody pda: Pda): ResponseEntity<Pda> {
        val actualizado = dispositivoService.update(id, pda) as? Pda
        return if (actualizado != null) ResponseEntity.ok(actualizado)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    override fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (dispositivoService.findByIdAndType(id, Pda::class.java) != null) {
            dispositivoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 