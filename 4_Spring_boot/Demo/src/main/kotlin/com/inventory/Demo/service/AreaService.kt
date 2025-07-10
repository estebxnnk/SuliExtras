package com.inventory.Demo.service

import com.inventory.Demo.model.Area
import com.inventory.Demo.repository.AreaRepository
import org.springframework.stereotype.Service

@Service
class AreaService(private val areaRepository: AreaRepository) {
    fun findById(id: Long): Area? = areaRepository.findById(id).orElse(null)
} 