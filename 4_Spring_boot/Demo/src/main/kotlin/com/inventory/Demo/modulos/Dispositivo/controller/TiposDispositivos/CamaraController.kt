package com.inventory.Demo.modulos.Dispositivo.controller.TiposDispositivos

import com.inventory.Demo.modulos.Dispositivo.InterfaceDispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Camara
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/camaras")
class CamaraController(
    private val dispositivoService: DispositivoService
) : InterfaceDispositivo<Camara, Long> {

    @GetMapping
    override fun getAll(): ResponseEntity<List<Camara>> = ResponseEntity.ok(dispositivoService.findAllByType(Camara::class.java))

    @GetMapping("/{id}")
    override fun getById(@PathVariable id: Long): ResponseEntity<Camara> =
        dispositivoService.findByIdAndType(id, Camara::class.java)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    override fun create(@RequestBody camara: Camara): ResponseEntity<Camara> =
        ResponseEntity.ok(dispositivoService.save(camara) as Camara)

    @PutMapping("/{id}")
    override fun update(@PathVariable id: Long, @RequestBody camara: Camara): ResponseEntity<Camara> {
        val actualizado = dispositivoService.update(id, camara) as? Camara
        return if (actualizado != null) ResponseEntity.ok(actualizado)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    override fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (dispositivoService.findByIdAndType(id, Camara::class.java) != null) {
            dispositivoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 