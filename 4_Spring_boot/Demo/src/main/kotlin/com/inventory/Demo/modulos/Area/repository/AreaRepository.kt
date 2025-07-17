package com.inventory.Demo.modulos.Area.repository

import com.inventory.Demo.modulos.Area.model.Area
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
 
@Repository
interface AreaRepository : JpaRepository<Area, Long> 