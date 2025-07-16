package com.inventory.Demo.modulos.Dispositivo.repository

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
 
@Repository
interface DispositivoRepository : JpaRepository<Dispositivo, Long> {
    fun findBySerial(serial: String): Dispositivo?
} 