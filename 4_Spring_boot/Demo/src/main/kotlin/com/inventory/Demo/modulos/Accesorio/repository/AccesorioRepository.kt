package com.inventory.Demo.modulos.Accesorio.repository

import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AccesorioRepository : JpaRepository<Accesorio, Long> {
    fun findByAsignacion_Estado(estado: com.inventory.Demo.modulos.Asignacion.model.Asignacion.EstadoAsignacion): List<Accesorio>
    fun findByIdAndAsignacion_Estado(id: Long, estado: com.inventory.Demo.modulos.Asignacion.model.Asignacion.EstadoAsignacion): Accesorio?
} 