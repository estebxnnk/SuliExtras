package com.inventory.Demo.modulos.Sede.repository

import com.inventory.Demo.modulos.Sede.model.Sede
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SedeRepository : JpaRepository<Sede, Long> 