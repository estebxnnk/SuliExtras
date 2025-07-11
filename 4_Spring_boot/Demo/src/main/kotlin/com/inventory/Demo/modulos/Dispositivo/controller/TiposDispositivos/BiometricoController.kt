package com.inventory.Demo.modulos.Dispositivo.controller.TiposDispositivos

import com.inventory.Demo.modulos.Dispositivo.InterfaceDispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Biometrico
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/biometricos")
class BiometricoController(
    private val dispositivoService: DispositivoService
) : InterfaceDispositivo<Biometrico, Long> {

    @GetMapping
    override fun getAll(): ResponseEntity<List<Biometrico>> = ResponseEntity.ok(dispositivoService.findAllByType(Biometrico::class.java))

    @GetMapping("/{id}")
    override fun getById(@PathVariable id: Long): ResponseEntity<Biometrico> =
        dispositivoService.findByIdAndType(id, Biometrico::class.java)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    override fun create(@RequestBody biometrico: Biometrico): ResponseEntity<Biometrico> =
        ResponseEntity.ok(dispositivoService.save(biometrico) as Biometrico)

    @PutMapping("/{id}")
    override fun update(@PathVariable id: Long, @RequestBody biometrico: Biometrico): ResponseEntity<Biometrico> {
        val actualizado = dispositivoService.update(id, biometrico) as? Biometrico
        return if (actualizado != null) ResponseEntity.ok(actualizado)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    override fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (dispositivoService.findByIdAndType(id, Biometrico::class.java) != null) {
            dispositivoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 