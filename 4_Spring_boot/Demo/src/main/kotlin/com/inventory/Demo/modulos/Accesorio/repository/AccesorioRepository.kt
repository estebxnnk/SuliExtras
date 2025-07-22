package com.inventory.Demo.modulos.Accesorio.repository

import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AccesorioRepository : JpaRepository<Accesorio, Long> {
    // Métodos eliminados porque la propiedad 'asignacion' ya no existe en Accesorio
} 