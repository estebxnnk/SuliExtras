package com.inventory.Demo.modulos.Accesorio.service

import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import com.inventory.Demo.modulos.Accesorio.repository.AccesorioRepository
import org.springframework.stereotype.Service

@Service
class AccesorioService(
    private val accesorioRepository: AccesorioRepository
) {
    /**
     * Guarda un accesorio individual o combo.
     * Si es combo, debe tener esCombo=true y accesoriosCombo con los accesorios que lo componen.
     */
    fun save(accesorio: Accesorio): Accesorio = accesorioRepository.save(accesorio)

    /**
     * Obtiene un accesorio por su ID.
     */
    fun findById(id: Long): Accesorio? = accesorioRepository.findById(id).orElse(null)

    /**
     * Obtiene todos los accesorios que NO son combos.
     */
    fun findAllSimples(): List<Accesorio> = accesorioRepository.findAll().filter { !it.esCombo }

    /**
     * Obtiene todos los combos de accesorios.
     */
    fun findAllCombos(): List<Accesorio> = accesorioRepository.findAll().filter { it.esCombo }

    /**
     * Actualiza un accesorio existente por su ID.
     * Si no existe, retorna null.
     */
    fun update(id: Long, accesorio: Accesorio): Accesorio? {
        return if (accesorioRepository.existsById(id)) {
            val actualizado = accesorio.copy(id = id)
            accesorioRepository.save(actualizado)
        } else {
            null
        }
    }

    /**
     * Elimina un accesorio por su ID.
     * Retorna true si se eliminó, false si no existía.
     */
    fun delete(id: Long): Boolean {
        return if (accesorioRepository.existsById(id)) {
            accesorioRepository.deleteById(id)
            true
        } else {
            false
        }
    }
} 