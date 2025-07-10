package com.inventory.Demo.repository

import com.inventory.Demo.model.Area
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AreaRepository : JpaRepository<Area, Long> 