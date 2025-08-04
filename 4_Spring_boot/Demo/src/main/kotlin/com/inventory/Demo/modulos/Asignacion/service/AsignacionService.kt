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
            
            // Validar que el dispositivo no esté asignado a otra asignación activa
            val asignacionActiva = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(
                dto.dispositivoId,
                Asignacion.EstadoAsignacion.ACTIVA
            )
            if (asignacionActiva != null) {
                throw IllegalArgumentException("El dispositivo ya está asignado a otra asignación activa.")
            }
            
            // Validar que los accesorios existen
            val accesorios = dto.accesorios?.mapNotNull { accesorioId ->
                val accesorio = accesorioRepository.findById(accesorioId).orElse(null)
                if (accesorio == null) {
                    throw IllegalArgumentException("Accesorio con id $accesorioId no encontrado.")
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
            
            // Validar y actualizar el estado del dispositivo
            try {
                dispositivoService.validarYActualizarEstadoDispositivo(dispositivo.dispositivoId)
            } catch (e: Exception) {
                println("Error al validar estado del dispositivo después de crear asignación: ${e.message}")
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
            
            // Validar que los accesorios existen
            val nuevosAccesorios = dto.accesorios?.mapNotNull { accesorioId ->
                val accesorio = accesorioRepository.findById(accesorioId).orElse(null)
                if (accesorio == null) {
                    throw IllegalArgumentException("Accesorio con id $accesorioId no encontrado.")
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
            
            // Validar y actualizar el estado del dispositivo
            try {
                dispositivoService.validarYActualizarEstadoDispositivo(existente.dispositivo.dispositivoId)
            } catch (e: Exception) {
                println("Error al validar estado del dispositivo después de actualizar asignación: ${e.message}")
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
            
            // Actualizar estado del dispositivo
            val asignacionActivaDispositivo = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(
                asignacion.dispositivo.dispositivoId,
                Asignacion.EstadoAsignacion.ACTIVA
            )
            val nuevoEstadoDispositivo = if (asignacionActivaDispositivo != null && asignacionActivaDispositivo.asignacionId != asignacion.asignacionId) {
                com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.ASIGNADO
            } else {
                com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE
            }
            
            // Actualizar el estado del dispositivo usando el método público del servicio
            dispositivoService.actualizarEstado(
                asignacion.dispositivo.dispositivoId,
                nuevoEstadoDispositivo
            )
            
            val asignacionFinalizada = asignacion.copy(
                estado = Asignacion.EstadoAsignacion.FINALIZADA,
                fechaFinalizacion = fechaFinalizacion,
                motivoFinalizacion = motivo
            )
            val saved = asignacionRepository.save(asignacionFinalizada)
            
            // Validar y actualizar el estado del dispositivo después de finalizar
            try {
                dispositivoService.validarYActualizarEstadoDispositivo(asignacion.dispositivo.dispositivoId)
            } catch (e: Exception) {
                println("Error al validar estado del dispositivo después de finalizar asignación: ${e.message}")
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
            
            val asignacionDesactivada = asignacion.copy(
                estado = Asignacion.EstadoAsignacion.INACTIVA,
                motivoFinalizacion = motivo
            )
            val saved = asignacionRepository.save(asignacionDesactivada)
            
            // Validar y actualizar el estado del dispositivo después de desactivar
            try {
                dispositivoService.validarYActualizarEstadoDispositivo(asignacion.dispositivo.dispositivoId)
            } catch (e: Exception) {
                println("Error al validar estado del dispositivo después de desactivar asignación: ${e.message}")
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
} 