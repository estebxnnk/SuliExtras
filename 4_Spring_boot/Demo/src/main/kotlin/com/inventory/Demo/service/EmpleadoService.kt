package com.inventory.Demo.service

import com.inventory.Demo.model.Empleado
import com.inventory.Demo.repository.EmpleadoRepository
import org.springframework.stereotype.Service

@Service
class EmpleadoService(private val empleadoRepository: EmpleadoRepository) {
    fun findAll(): List<Empleado> = empleadoRepository.findAll()
    fun findById(id: Long): Empleado? = empleadoRepository.findById(id).orElse(null)
    fun save(empleado: Empleado): Empleado = empleadoRepository.save(empleado)
    fun update(id: Long, empleado: Empleado): Empleado? {
        return if (empleadoRepository.existsById(id)) {
            empleadoRepository.save(empleado.copy(empleadoId = id))
        } else null
    }
    fun delete(id: Long) = empleadoRepository.deleteById(id)
    fun findBySedeId(sedeId: Long): List<Empleado> = empleadoRepository.findBySedeSedeId(sedeId)
} 