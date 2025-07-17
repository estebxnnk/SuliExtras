package com.inventory.Demo.modulos.Asignacion.repository

import com.inventory.Demo.modulos.Asignacion.model.Asignacion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AsignacionRepository : JpaRepository<Asignacion, Long> {
    fun findByDispositivo_DispositivoIdAndEstado(dispositivoId: Long, estado: Asignacion.EstadoAsignacion): Asignacion?
    fun findByDispositivo_DispositivoId(dispositivoId: Long): List<Asignacion>
    fun findByEmpleado_IdAndEstado(empleadoId: Long, estado: Asignacion.EstadoAsignacion): List<Asignacion>
} 