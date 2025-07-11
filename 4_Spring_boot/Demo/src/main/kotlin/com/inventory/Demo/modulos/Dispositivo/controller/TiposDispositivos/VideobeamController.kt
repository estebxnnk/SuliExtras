package com.inventory.Demo.modulos.Dispositivo.controller.TiposDispositivos

import com.inventory.Demo.modulos.Dispositivo.InterfaceDispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Videobeam
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/videobeams")
class VideobeamController(
    private val dispositivoService: DispositivoService
) : InterfaceDispositivo<Videobeam, Long> {

    @GetMapping
    override fun getAll(): ResponseEntity<List<Videobeam>> = ResponseEntity.ok(dispositivoService.findAllByType(Videobeam::class.java))

    @GetMapping("/{id}")
    override fun getById(@PathVariable id: Long): ResponseEntity<Videobeam> =
        dispositivoService.findByIdAndType(id, Videobeam::class.java)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    override fun create(@RequestBody videobeam: Videobeam): ResponseEntity<Videobeam> =
        ResponseEntity.ok(dispositivoService.save(videobeam) as Videobeam)

    @PutMapping("/{id}")
    override fun update(@PathVariable id: Long, @RequestBody videobeam: Videobeam): ResponseEntity<Videobeam> {
        val actualizado = dispositivoService.update(id, videobeam) as? Videobeam
        return if (actualizado != null) ResponseEntity.ok(actualizado)
        else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    override fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        return if (dispositivoService.findByIdAndType(id, Videobeam::class.java) != null) {
            dispositivoService.delete(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 