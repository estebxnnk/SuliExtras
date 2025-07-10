package com.inventory.Demo.modulos.Area.service

import com.inventory.Demo.modulos.Area.model.Area
import com.inventory.Demo.modulos.Area.repository.AreaRepository
import org.springframework.stereotype.Service
 
@Service
class AreaService(private val areaRepository: AreaRepository) {
    fun findById(id: Long): Area? = areaRepository.findById(id).orElse(null)
} 