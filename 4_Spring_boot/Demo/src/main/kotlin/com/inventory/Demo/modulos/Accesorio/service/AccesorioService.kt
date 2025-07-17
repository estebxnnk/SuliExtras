package com.inventory.Demo.modulos.Accesorio.service

import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import com.inventory.Demo.modulos.Accesorio.repository.AccesorioRepository
import org.springframework.stereotype.Service

@Service
class AccesorioService(
    private val accesorioRepository: AccesorioRepository
) {
    fun findById(id: Long): Accesorio? = accesorioRepository.findById(id).orElse(null)
    fun save(accesorio: Accesorio): Accesorio = accesorioRepository.save(accesorio)
} 