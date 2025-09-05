package com.inventory.Demo.modulos.Dispositivo.controller.TiposDispositivos

import com.inventory.Demo.modulos.Dispositivo.InterfaceDispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Impresora
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/impresoras")
class ImpresoraController(
    private val dispositivoService: DispositivoService
) : InterfaceDispositivo<Impresora, Long> {

    @GetMapping
    override fun getAll(): ResponseEntity<List<Impresora>> = ResponseEntity.ok(dispositivoService.findAllByType(Impresora::class.java))

    @GetMapping("/{id}")
    override fun getById(@PathVariable id: Long): ResponseEntity<Impresora> =
        dispositivoService.findByIdAndType(id, Impresora::class.java)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    override fun create(@RequestBody impresora: Impresora): ResponseEntity<Impresora> =
        ResponseEntity.ok(dispositivoService.save(impresora) as Impresora)

    @PutMapping("/{id}")
    override fun update(@PathVariable id: Long, @RequestBody impresora: Impresora): ResponseEntity<Impresora> {
        val actualizado = dispositivoService.update(id, impresora) as? Impresora
        return if (actualizado != null) ResponseEntity.ok(actualizado)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    override fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (dispositivoService.findByIdAndType(id, Impresora::class.java) != null) {
            dispositivoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 