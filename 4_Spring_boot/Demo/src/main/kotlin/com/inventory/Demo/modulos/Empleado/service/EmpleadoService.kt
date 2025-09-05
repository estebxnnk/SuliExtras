package com.inventory.Demo.modulos.Empleado.service

import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Empleado.repository.EmpleadoRepository
import org.springframework.stereotype.Service

@Service
class EmpleadoService(private val empleadoRepository: EmpleadoRepository) {
    fun findAll(): List<Empleado> = empleadoRepository.findAll()
    fun findById(id: Long): Empleado? = empleadoRepository.findById(id).orElse(null)
    fun save(empleado: Empleado): Empleado = empleadoRepository.save(empleado)
    fun delete(id: Long) = empleadoRepository.deleteById(id)
    fun findByAreaId(areaId: Long): List<Empleado> = empleadoRepository.findByArea_Id(areaId)
    fun findByDocumento(documento: String): Empleado? = empleadoRepository.findByDocumentoIdentidad(documento)
    fun findByEmail(email: String): Empleado? = empleadoRepository.findByEmail(email)
    // Si necesitas buscar por área, implementa aquí el método correspondiente
} 