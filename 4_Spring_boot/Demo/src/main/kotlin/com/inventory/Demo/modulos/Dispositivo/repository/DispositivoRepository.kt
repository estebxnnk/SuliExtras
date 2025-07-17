package com.inventory.Demo.modulos.Dispositivo.repository

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import org.springframework.stereotype.Repository
 
@Repository
interface DispositivoRepository : JpaRepository<Dispositivo, Long> {
    fun findBySerial(serial: String): Dispositivo?

    @Modifying
    @Query("UPDATE Dispositivo d SET d.estado = :estado WHERE d.dispositivoId = :id")
    fun actualizarEstado(@Param("id") id: Long, @Param("estado") estado: EstadoDispositivo)
} 