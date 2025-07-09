package com.inventory.Demo.repository

import com.inventory.Demo.model.Empleado
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EmpleadoRepository : JpaRepository<Empleado, Long> {
    fun findBySedeSedeId(sedeId: Long): List<Empleado>
} 