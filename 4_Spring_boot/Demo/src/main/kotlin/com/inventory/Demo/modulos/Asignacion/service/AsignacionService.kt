package com.inventory.Demo.modulos.Asignacion.service

import com.inventory.Demo.modulos.Asignacion.model.Asignacion
import com.inventory.Demo.modulos.Asignacion.repository.AsignacionRepository
import com.inventory.Demo.modulos.Asignacion.dto.AsignacionRequest
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import com.inventory.Demo.modulos.Empleado.service.EmpleadoService
import com.inventory.Demo.modulos.Sede.service.SedeService
import com.inventory.Demo.modulos.Area.service.AreaService
import com.inventory.Demo.modulos.Accesorio.service.AccesorioService
import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import com.inventory.Demo.modulos.Accesorio.repository.AccesorioRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
@Transactional
class AsignacionService(
    private val asignacionRepository: AsignacionRepository,
    private val dispositivoService: DispositivoService,
    private val empleadoService: EmpleadoService,
    private val sedeService: SedeService,
    private val areaService: AreaService,
    private val accesorioService: AccesorioService,
    private val accesorioRepository: AccesorioRepository
) {
    fun create(dto: AsignacionRequest): Asignacion {
        return try {
            // Validar que el dispositivo existe
            val dispositivo = dispositivoService.findById(dto.dispositivoId)
                ?: throw IllegalArgumentException("Dispositivo con id ${dto.dispositivoId} no encontrado.")
            
            // Validar que el empleado existe
            val empleado = empleadoService.findById(dto.empleadoId)
                ?: throw IllegalArgumentException("Empleado con id ${dto.empleadoId} no encontrado.")
            
            // Validar que la sede existe
            val sede = sedeService.findById(dto.sedeId)
                ?: throw IllegalArgumentException("Sede con id ${dto.sedeId} no encontrada.")
            
            // Validar que el área existe
            val area = areaService.findById(dto.areaId)
                ?: throw IllegalArgumentException("Área con id ${dto.areaId} no encontrada.")
            
            // Validar que el dispositivo no esté asignado a otra asignación ACTIVA
            // PERMITIR reasignaciones si la asignación anterior está FINALIZADA o INACTIVA
            val asignacionActiva = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(
                dto.dispositivoId,
                Asignacion.EstadoAsignacion.ACTIVA
            )
            if (asignacionActiva != null) {
                throw IllegalArgumentException("El dispositivo ya está asignado a otra asignación activa. Debe finalizar la asignación actual antes de crear una nueva.")
            }
            
            // Validar que los accesorios existen, están disponibles y no están asignados activamente
            val accesorios = dto.accesorios?.mapNotNull { accesorioId ->
                val accesorio = accesorioRepository.findById(accesorioId).orElse(null)
                if (accesorio == null) {
                    throw IllegalArgumentException("Accesorio con id $accesorioId no encontrado.")
                }
                
                // Verificar que el accesorio esté disponible
                if (accesorio.estado != com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE) {
                    throw IllegalArgumentException("El accesorio con id $accesorioId no está disponible. Estado actual: ${accesorio.estado}")
                }
                
                // Verificar que el accesorio no esté en una asignación activa
                val asignacionActivaAccesorio = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(
                    accesorio.dispositivoId,
                    Asignacion.EstadoAsignacion.ACTIVA
                )
                if (asignacionActivaAccesorio != null) {
                    throw IllegalArgumentException("El accesorio con id $accesorioId ya está asignado a otra asignación activa.")
                }
                
                accesorio
            }
            
            val asignacion = Asignacion(
                dispositivo = dispositivo,
                empleado = empleado,
                sede = sede,
                area = area,
                fechaAsignacion = dto.fechaAsignacion,
                fechaFinalizacion = null,
                comentario = dto.comentario,
                observaciones = dto.observaciones,
                accesorios = accesorios
            )
            val saved = asignacionRepository.save(asignacion)
            
            // Actualizar estado del dispositivo a ASIGNADO
            try {
                dispositivoService.actualizarEstado(dispositivo.dispositivoId, com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.ASIGNADO)
            } catch (e: Exception) {
                println("Error al actualizar estado del dispositivo después de crear asignación: ${e.message}")
            }
            
            // Actualizar estado de los accesorios a ASIGNADO
            try {
                accesorios?.forEach { accesorio ->
                    accesorioService.actualizarEstado(accesorio.dispositivoId, com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.ASIGNADO)
                }
            } catch (e: Exception) {
                println("Error al actualizar estado de los accesorios después de crear asignación: ${e.message}")
            }
            
            saved
        } catch (e: Exception) {
            throw RuntimeException("Error al crear la asignación: ${e.message}", e)
        }
    }

    fun update(id: Long, dto: AsignacionRequest): Asignacion? {
        return try {
            val existente = findById(id) ?: return null
            if (existente.estado == Asignacion.EstadoAsignacion.FINALIZADA) {
                throw IllegalArgumentException("No se puede editar una asignación finalizada.")
            }
            if (existente.dispositivo.dispositivoId != dto.dispositivoId ||
                existente.empleado.id != dto.empleadoId) {
                throw IllegalArgumentException("No se permite cambiar el dispositivo o el empleado de la asignación.")
            }
            
            // Validar que los accesorios existen y están disponibles
            val nuevosAccesorios = dto.accesorios?.mapNotNull { accesorioId ->
                val accesorio = accesorioRepository.findById(accesorioId).orElse(null)
                if (accesorio == null) {
                    throw IllegalArgumentException("Accesorio con id $accesorioId no encontrado.")
                }
                
                // Verificar que el accesorio esté disponible (excepto si ya está en la asignación actual)
                val accesorioYaEnAsignacion = existente.accesorios?.any { it.dispositivoId == accesorio.dispositivoId } == true
                if (!accesorioYaEnAsignacion && accesorio.estado != com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE) {
                    throw IllegalArgumentException("El accesorio con id $accesorioId no está disponible. Estado actual: ${accesorio.estado}")
                }
                
                accesorio
            }
            
            val actualizado = existente.copy(
                fechaAsignacion = dto.fechaAsignacion,
                comentario = dto.comentario,
                observaciones = dto.observaciones,
                accesorios = nuevosAccesorios
            )
            val saved = asignacionRepository.save(actualizado)
            
            // Actualizar estado del dispositivo a ASIGNADO
            try {
                dispositivoService.actualizarEstado(existente.dispositivo.dispositivoId, com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.ASIGNADO)
            } catch (e: Exception) {
                println("Error al actualizar estado del dispositivo después de actualizar asignación: ${e.message}")
            }
            
            // Actualizar estado de los nuevos accesorios a ASIGNADO
            try {
                nuevosAccesorios?.forEach { accesorio ->
                    accesorioService.actualizarEstado(accesorio.dispositivoId, com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.ASIGNADO)
                }
            } catch (e: Exception) {
                println("Error al actualizar estado de los accesorios después de actualizar asignación: ${e.message}")
            }
            
            saved
        } catch (e: Exception) {
            throw RuntimeException("Error al actualizar la asignación con id $id: ${e.message}", e)
        }
    }

    fun finalizarAsignacion(id: Long, motivo: String?): Asignacion? {
        return try {
            val asignacion = findById(id) ?: return null
            if (asignacion.estado == Asignacion.EstadoAsignacion.FINALIZADA) {
                throw IllegalArgumentException("La asignación ya está finalizada.")
            }
            val fechaFinalizacion = java.time.LocalDate.now()
            
            // FINALIZAR LA ASIGNACIÓN PRIMERO
            val asignacionFinalizada = asignacion.copy(
                estado = Asignacion.EstadoAsignacion.FINALIZADA,
                fechaFinalizacion = fechaFinalizacion,
                motivoFinalizacion = motivo
            )
            val saved = asignacionRepository.save(asignacionFinalizada)
            
            // DESPUÉS DE FINALIZAR, VERIFICAR SI EL DISPOSITIVO TIENE OTRAS ASIGNACIONES ACTIVAS
            val otrasAsignacionesActivas = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(
                asignacion.dispositivo.dispositivoId,
                Asignacion.EstadoAsignacion.ACTIVA
            )
            
            // Si no hay otras asignaciones activas, el dispositivo queda DISPONIBLE
            if (otrasAsignacionesActivas == null) {
                try {
                    dispositivoService.actualizarEstado(
                        asignacion.dispositivo.dispositivoId,
                        com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE
                    )
                } catch (e: Exception) {
                    println("Error al actualizar estado del dispositivo después de finalizar asignación: ${e.message}")
                }
            }
            
            // ACTUALIZAR ESTADO DE LOS ACCESORIOS
            try {
                asignacion.accesorios?.forEach { accesorio ->
                    // Verificar si el accesorio tiene otras asignaciones activas
                    val otrasAsignacionesAccesorio = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(
                        accesorio.dispositivoId,
                        Asignacion.EstadoAsignacion.ACTIVA
                    )
                    
                    // Si no hay otras asignaciones activas para el accesorio, queda DISPONIBLE
                    if (otrasAsignacionesAccesorio == null) {
                        accesorioService.actualizarEstado(
                            accesorio.dispositivoId,
                            com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE
                        )
                    }
                }
            } catch (e: Exception) {
                println("Error al actualizar estado de los accesorios después de finalizar asignación: ${e.message}")
            }
            
            saved
        } catch (e: Exception) {
            throw RuntimeException("Error al finalizar la asignación con id $id: ${e.message}", e)
        }
    }

    fun desactivarAsignacion(id: Long, motivo: String?): Asignacion? {
        return try {
            val asignacion = findById(id) ?: return null
            if (asignacion.estado == Asignacion.EstadoAsignacion.FINALIZADA) {
                throw IllegalArgumentException("La asignación ya está finalizada.")
            }
            if (asignacion.estado == Asignacion.EstadoAsignacion.INACTIVA) {
                throw IllegalArgumentException("La asignación ya está inactiva.")
            }
            
            // DESACTIVAR LA ASIGNACIÓN PRIMERO
            val asignacionDesactivada = asignacion.copy(
                estado = Asignacion.EstadoAsignacion.INACTIVA,
                motivoFinalizacion = motivo
            )
            val saved = asignacionRepository.save(asignacionDesactivada)
            
            // DESPUÉS DE DESACTIVAR, VERIFICAR SI EL DISPOSITIVO TIENE OTRAS ASIGNACIONES ACTIVAS
            val otrasAsignacionesActivas = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(
                asignacion.dispositivo.dispositivoId,
                Asignacion.EstadoAsignacion.ACTIVA
            )
            
            // Si no hay otras asignaciones activas, el dispositivo queda DISPONIBLE
            if (otrasAsignacionesActivas == null) {
                try {
                    dispositivoService.actualizarEstado(
                        asignacion.dispositivo.dispositivoId,
                        com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE
                    )
                } catch (e: Exception) {
                    println("Error al actualizar estado del dispositivo después de desactivar asignación: ${e.message}")
                }
            }
            
            // ACTUALIZAR ESTADO DE LOS ACCESORIOS
            try {
                asignacion.accesorios?.forEach { accesorio ->
                    // Verificar si el accesorio tiene otras asignaciones activas
                    val otrasAsignacionesAccesorio = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(
                        accesorio.dispositivoId,
                        Asignacion.EstadoAsignacion.ACTIVA
                    )
                    
                    // Si no hay otras asignaciones activas para el accesorio, queda DISPONIBLE
                    if (otrasAsignacionesAccesorio == null) {
                        accesorioService.actualizarEstado(
                            accesorio.dispositivoId,
                            com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE
                        )
                    }
                }
            } catch (e: Exception) {
                println("Error al actualizar estado de los accesorios después de desactivar asignación: ${e.message}")
            }
            
            saved
        } catch (e: Exception) {
            throw RuntimeException("Error al desactivar la asignación con id $id: ${e.message}", e)
        }
    }

    fun delete(id: Long) = try {
        asignacionRepository.deleteById(id)
    } catch (e: Exception) {
        throw RuntimeException("Error al eliminar la asignación con id $id: ${e.message}", e)
    }

    fun findById(id: Long): Asignacion? = asignacionRepository.findById(id).orElse(null)

    fun findAll(): List<Asignacion> = asignacionRepository.findAll()

    fun findByDispositivoId(dispositivoId: Long): List<Asignacion> = asignacionRepository.findByDispositivo_DispositivoId(dispositivoId)

    fun findByEmpleadoIdAndEstado(empleadoId: Long, estado: Asignacion.EstadoAsignacion): List<Asignacion> = 
        asignacionRepository.findByEmpleado_IdAndEstado(empleadoId, estado)

    fun findByDispositivoIdAndEstado(dispositivoId: Long, estado: Asignacion.EstadoAsignacion): Asignacion? = 
        asignacionRepository.findByDispositivo_DispositivoIdAndEstado(dispositivoId, estado)

    fun findActivas(): List<Asignacion> = findAll().filter { it.estado == Asignacion.EstadoAsignacion.ACTIVA }

    fun findFinalizadas(): List<Asignacion> = findAll().filter { it.estado == Asignacion.EstadoAsignacion.FINALIZADA }

    fun findInactivas(): List<Asignacion> = findAll().filter { it.estado == Asignacion.EstadoAsignacion.INACTIVA }

    // NUEVOS MÉTODOS PARA CONSULTAR HISTORIAL
    
    /**
     * Obtiene el historial completo de asignaciones de un dispositivo
     */
    fun findHistorialByDispositivoId(dispositivoId: Long): List<Asignacion> {
        return asignacionRepository.findByDispositivo_DispositivoId(dispositivoId)
            .sortedByDescending { it.fechaAsignacion }
    }
    
    /**
     * Obtiene la asignación activa actual de un dispositivo
     */
    fun findAsignacionActivaByDispositivoId(dispositivoId: Long): Asignacion? {
        return asignacionRepository.findByDispositivo_DispositivoIdAndEstado(
            dispositivoId,
            Asignacion.EstadoAsignacion.ACTIVA
        )
    }
    
    /**
     * Verifica si un dispositivo está disponible para asignación
     */
    fun isDispositivoDisponible(dispositivoId: Long): Boolean {
        val asignacionActiva = findAsignacionActivaByDispositivoId(dispositivoId)
        return asignacionActiva == null
    }
    
    /**
     * Obtiene todas las asignaciones de un empleado (activas, finalizadas e inactivas)
     */
    fun findHistorialByEmpleadoId(empleadoId: Long): List<Asignacion> {
        return findAll().filter { it.empleado.id == empleadoId }
            .sortedByDescending { it.fechaAsignacion }
    }
    
    /**
     * Obtiene las asignaciones activas de un empleado
     */
    fun findAsignacionesActivasByEmpleadoId(empleadoId: Long): List<Asignacion> {
        return findByEmpleadoIdAndEstado(empleadoId, Asignacion.EstadoAsignacion.ACTIVA)
    }
    
    /**
     * Obtiene el historial de asignaciones finalizadas de un dispositivo
     */
    fun findAsignacionesFinalizadasByDispositivoId(dispositivoId: Long): List<Asignacion> {
        return asignacionRepository.findByDispositivo_DispositivoId(dispositivoId)
            .filter { it.estado == Asignacion.EstadoAsignacion.FINALIZADA }
            .sortedByDescending { it.fechaFinalizacion }
    }
} 