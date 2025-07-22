package com.inventory.Demo.modulos.Area.service

import com.inventory.Demo.modulos.Area.model.Area
import com.inventory.Demo.modulos.Area.repository.AreaRepository
import org.springframework.stereotype.Service
 
@Service
class AreaService(private val areaRepository: AreaRepository) {
    fun findById(id: Long): Area? = areaRepository.findById(id).orElse(null)
    fun findAll(): List<Area> = areaRepository.findAll()
    fun save(area: Area): Area = areaRepository.save(area)
    fun delete(id: Long) = areaRepository.deleteById(id)
    fun findByNombreAndSede(nombre: String, sede: com.inventory.Demo.modulos.Sede.model.Sede): Area? = areaRepository.findByNombreAndSede(nombre, sede)
} 