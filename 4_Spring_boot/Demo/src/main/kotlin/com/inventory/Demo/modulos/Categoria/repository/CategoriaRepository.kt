package com.inventory.Demo.modulos.Categoria.repository

import com.inventory.Demo.modulos.Categoria.model.Categoria
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoriaRepository : JpaRepository<Categoria, Long> {
    fun findByNombre(nombre: String): Categoria?
} 