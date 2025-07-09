package com.inventory.Demo.service

import com.inventory.Demo.model.Sede
import com.inventory.Demo.repository.SedeRepository
import org.springframework.stereotype.Service

@Service
class SedeService(private val sedeRepository: SedeRepository) {
    fun findAll(): List<Sede> = sedeRepository.findAll()
    fun findById(id: Long): Sede? = sedeRepository.findById(id).orElse(null)
    fun save(sede: Sede): Sede = sedeRepository.save(sede)
    fun update(id: Long, sede: Sede): Sede? {
        return if (sedeRepository.existsById(id)) {
            sedeRepository.save(sede.copy(sedeId = id))
        } else null
    }
    fun delete(id: Long) = sedeRepository.deleteById(id)
} 