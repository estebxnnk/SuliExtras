package com.inventory.Demo.modulos.Sede.service

import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Sede.repository.SedeRepository
import org.springframework.stereotype.Service

@Service
class SedeService(private val sedeRepository: SedeRepository) {
    fun findAll(): List<Sede> = sedeRepository.findAll()
    fun findById(id: Long): Sede? = sedeRepository.findById(id).orElse(null)
    fun save(sede: Sede): Sede = sedeRepository.save(sede)
    fun update(id: Long, sede: Sede): Sede? {
        return if (sedeRepository.existsById(id)) {
            val sedeActual = sedeRepository.findById(id).orElse(null) ?: return null
            val sedeActualizada = Sede(
                id = id,
                nombre = sede.nombre,
                ubicacion = sede.ubicacion,
                ciudad = sede.ciudad,
                dispositivos = sede.dispositivos
            )
            sedeRepository.save(sedeActualizada)
        } else null
    }
    fun delete(id: Long) = sedeRepository.deleteById(id)
} 