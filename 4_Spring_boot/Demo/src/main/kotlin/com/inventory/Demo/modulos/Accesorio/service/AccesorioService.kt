package com.inventory.Demo.modulos.Accesorio.service

import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import com.inventory.Demo.modulos.Accesorio.repository.AccesorioRepository
import com.inventory.Demo.modulos.Accesorio.dto.AccesorioRequest
import com.inventory.Demo.modulos.Accesorio.dto.AccesorioResponseDTO
import com.inventory.Demo.modulos.Categoria.model.Categoria
import com.inventory.Demo.modulos.Categoria.repository.CategoriaRepository
import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Sede.repository.SedeRepository
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class AccesorioService(
    private val accesorioRepository: AccesorioRepository,
    private val categoriaRepository: CategoriaRepository,
    private val sedeRepository: SedeRepository
) {
    
    /**
     * Crea un nuevo accesorio
     */
    fun create(accesorioRequest: AccesorioRequest): AccesorioResponseDTO {
        val categoria = accesorioRequest.categoriaId?.let { categoriaRepository.findById(it).orElse(null) }
        val sede = accesorioRequest.sedeId?.let { sedeRepository.findById(it).orElse(null) }
        
        val accesorio = Accesorio(
            item = accesorioRequest.item,
            serial = accesorioRequest.serial,
            modelo = accesorioRequest.modelo,
            marca = accesorioRequest.marca,
            categoria = categoria,
            sede = sede,
            estado = accesorioRequest.estado,
            clasificacion = accesorioRequest.clasificacion,
            fechaAdquisicion = accesorioRequest.fechaAdquisicion,
            costo = accesorioRequest.costo,
            funcional = accesorioRequest.funcional,
            codigoActivo = accesorioRequest.codigoActivo,
            tipo = accesorioRequest.tipo,
            observaciones = accesorioRequest.observaciones,
            tipoAccesorio = accesorioRequest.tipoAccesorio,
            esCombo = accesorioRequest.esCombo
        )
        
        val saved = accesorioRepository.save(accesorio)
        return toResponseDTO(saved)
    }
    
    /**
     * Obtiene un accesorio por su ID
     */
    fun findById(id: Long): AccesorioResponseDTO? {
        return accesorioRepository.findById(id).map { toResponseDTO(it) }.orElse(null)
    }
    
    /**
     * Obtiene todos los accesorios
     */
    fun findAll(): List<AccesorioResponseDTO> {
        return accesorioRepository.findAll().map { toResponseDTO(it) }
    }
    
    /**
     * Obtiene todos los accesorios simples (no combos)
     */
    fun findAllSimples(): List<AccesorioResponseDTO> {
        return accesorioRepository.findByEsComboFalse().map { toResponseDTO(it) }
    }
    
    /**
     * Obtiene todos los combos de accesorios
     */
    fun findAllCombos(): List<AccesorioResponseDTO> {
        return accesorioRepository.findByEsComboTrue().map { toResponseDTO(it) }
    }
    
    /**
     * Obtiene accesorios por tipo
     */
    fun findByTipoAccesorio(tipoAccesorio: String): List<AccesorioResponseDTO> {
        return accesorioRepository.findByTipoAccesorio(tipoAccesorio).map { toResponseDTO(it) }
    }
    
    /**
     * Obtiene accesorios por estado
     */
    fun findByEstado(estado: EstadoDispositivo): List<AccesorioResponseDTO> {
        return accesorioRepository.findByEstado(estado).map { toResponseDTO(it) }
    }
    
    /**
     * Obtiene accesorios disponibles
     */
    fun findDisponibles(): List<AccesorioResponseDTO> {
        return accesorioRepository.findDisponibles().map { toResponseDTO(it) }
    }
    
    /**
     * Obtiene accesorios por sede
     */
    fun findBySedeId(sedeId: Long): List<AccesorioResponseDTO> {
        return accesorioRepository.findBySede_Id(sedeId).map { toResponseDTO(it) }
    }
    
    /**
     * Obtiene accesorios por categoría
     */
    fun findByCategoriaId(categoriaId: Long): List<AccesorioResponseDTO> {
        return accesorioRepository.findByCategoria_CategoriaId(categoriaId).map { toResponseDTO(it) }
    }
    
    /**
     * Actualiza un accesorio existente
     */
    fun update(id: Long, accesorioRequest: AccesorioRequest): AccesorioResponseDTO? {
        if (!accesorioRepository.existsById(id)) return null
        
        val categoria = accesorioRequest.categoriaId?.let { categoriaRepository.findById(it).orElse(null) }
        val sede = accesorioRequest.sedeId?.let { sedeRepository.findById(it).orElse(null) }
        
        val updated = Accesorio(
            dispositivoId = id,
            item = accesorioRequest.item,
            serial = accesorioRequest.serial,
            modelo = accesorioRequest.modelo,
            marca = accesorioRequest.marca,
            categoria = categoria,
            sede = sede,
            estado = accesorioRequest.estado,
            clasificacion = accesorioRequest.clasificacion,
            fechaAdquisicion = accesorioRequest.fechaAdquisicion,
            costo = accesorioRequest.costo,
            funcional = accesorioRequest.funcional,
            codigoActivo = accesorioRequest.codigoActivo,
            tipo = accesorioRequest.tipo,
            observaciones = accesorioRequest.observaciones,
            tipoAccesorio = accesorioRequest.tipoAccesorio,
            esCombo = accesorioRequest.esCombo
        )
        
        val saved = accesorioRepository.save(updated)
        return toResponseDTO(saved)
    }
    
    /**
     * Elimina un accesorio por su ID
     */
    fun delete(id: Long): Boolean {
        return if (accesorioRepository.existsById(id)) {
            accesorioRepository.deleteById(id)
            true
        } else {
            false
        }
    }
    
    /**
     * Convierte un Accesorio a AccesorioResponseDTO
     */
    private fun toResponseDTO(accesorio: Accesorio): AccesorioResponseDTO {
        return AccesorioResponseDTO(
            dispositivoId = accesorio.dispositivoId,
            item = accesorio.item,
            serial = accesorio.serial,
            modelo = accesorio.modelo,
            marca = accesorio.marca,
            categoria = accesorio.categoria?.nombre,
            sede = accesorio.sede?.nombre,
            estado = accesorio.estado,
            clasificacion = accesorio.clasificacion,
            fechaAdquisicion = accesorio.fechaAdquisicion,
            costo = accesorio.costo,
            funcional = accesorio.funcional,
            codigoActivo = accesorio.codigoActivo,
            tipo = accesorio.tipo,
            observaciones = accesorio.observaciones,
            tipoAccesorio = accesorio.tipoAccesorio,
            esCombo = accesorio.esCombo,
            accesoriosCombo = emptyList() // Por ahora sin combos
        )
    }
} 