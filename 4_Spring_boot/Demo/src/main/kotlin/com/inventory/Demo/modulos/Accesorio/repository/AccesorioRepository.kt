package com.inventory.Demo.modulos.Accesorio.repository

import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import org.springframework.transaction.annotation.Transactional

@Repository
interface AccesorioRepository : JpaRepository<Accesorio, Long> {
    
    /**
     * Busca accesorios por tipo de accesorio
     */
    fun findByTipoAccesorio(tipoAccesorio: String): List<Accesorio>
    
    /**
     * Busca accesorios que son combos
     */
    fun findByEsComboTrue(): List<Accesorio>
    
    /**
     * Busca accesorios que no son combos
     */
    fun findByEsComboFalse(): List<Accesorio>
    
    /**
     * Busca accesorios por estado
     */
    fun findByEstado(estado: EstadoDispositivo): List<Accesorio>
    
    /**
     * Busca accesorios por sede
     */
    fun findBySede_Id(sedeId: Long): List<Accesorio>
    
    /**
     * Busca accesorios por categoría
     */
    fun findByCategoria_CategoriaId(categoriaId: Long): List<Accesorio>
    
    /**
     * Busca accesorios disponibles (no asignados)
     */
    @Query("SELECT a FROM Accesorio a WHERE a.estado = 'DISPONIBLE'")
    fun findDisponibles(): List<Accesorio>
    
    /**
     * Actualiza el estado de un accesorio
     */
    @Modifying
    @Transactional
    @Query("UPDATE Accesorio a SET a.estado = :estado WHERE a.dispositivoId = :id")
    fun actualizarEstado(@Param("id") id: Long, @Param("estado") estado: EstadoDispositivo)
} 