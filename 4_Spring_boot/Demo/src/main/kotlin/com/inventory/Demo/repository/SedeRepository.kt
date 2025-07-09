package com.inventory.Demo.repository

import com.inventory.Demo.model.Sede
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SedeRepository : JpaRepository<Sede, Long> 