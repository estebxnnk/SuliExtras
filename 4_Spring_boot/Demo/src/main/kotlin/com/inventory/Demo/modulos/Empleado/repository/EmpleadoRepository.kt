package com.inventory.Demo.modulos.Empleado.repository

import com.inventory.Demo.modulos.Empleado.model.Empleado
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EmpleadoRepository : JpaRepository<Empleado, Long> {
    fun findByArea_Id(areaId: Long): List<Empleado>
    fun findByDocumentoIdentidad(documento: String): Empleado?
} 