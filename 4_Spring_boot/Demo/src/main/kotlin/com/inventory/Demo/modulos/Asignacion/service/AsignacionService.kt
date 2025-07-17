package com.inventory.Demo.modulos.Asignacion.service

import com.inventory.Demo.modulos.Asignacion.model.Asignacion
import com.inventory.Demo.modulos.Asignacion.repository.AsignacionRepository
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import com.inventory.Demo.modulos.Asignacion.dto.AsignacionRequest
import com.inventory.Demo.modulos.Empleado.service.EmpleadoService
import com.inventory.Demo.modulos.Accesorio.service.AccesorioService
import org.springframework.stereotype.Service

@Service
class AsignacionService(
    private val asignacionRepository: AsignacionRepository,
    private val dispositivoService: DispositivoService,
    private val empleadoService: EmpleadoService,
    private val accesorioService: AccesorioService
) {
    fun findAll(): List<Asignacion> = try {
        asignacionRepository.findAll()
    } catch (e: Exception) {
        throw RuntimeException("Error al obtener todas las asignaciones: ${e.message}", e)
    }
    fun findById(id: Long): Asignacion? = try {
        asignacionRepository.findById(id).orElse(null)
    } catch (e: Exception) {
        throw RuntimeException("Error al buscar la asignación con id $id: ${e.message}", e)
    }

    fun create(dto: AsignacionRequest): Asignacion = try {
        val dispositivo = dispositivoService.findById(dto.dispositivoId)
            ?: throw IllegalArgumentException("Dispositivo no encontrado")
        val empleado = empleadoService.findById(dto.empleadoId)
            ?: throw IllegalArgumentException("Empleado no encontrado")
        // Validación: un empleado solo puede tener un computador activo y viceversa
        val asignacionActivaDispositivo = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(dispositivo.dispositivoId, Asignacion.EstadoAsignacion.ACTIVA)
        if (asignacionActivaDispositivo != null) {
            throw IllegalArgumentException("El dispositivo ya está asignado a otro empleado.")
        }
        val empleadoId = empleado.id ?: throw IllegalArgumentException("El empleado no tiene ID")
        val asignacionesActivasEmpleado = asignacionRepository.findByEmpleado_IdAndEstado(empleadoId, Asignacion.EstadoAsignacion.ACTIVA)
        if (asignacionesActivasEmpleado.any { it.dispositivo.dispositivoId == dispositivo.dispositivoId }) {
            throw IllegalArgumentException("El empleado ya tiene un computador asignado.")
        }
        // Validación: accesorios no pueden estar asignados a otra asignación activa
        dto.accesorios?.forEach { accesorioId ->
            val accesorio = accesorioService.findById(accesorioId)
            if (accesorio?.asignacion?.estado == Asignacion.EstadoAsignacion.ACTIVA) {
                throw IllegalArgumentException("El accesorio con id $accesorioId ya está asignado a otra asignación activa.")
            }
        }
        // Crear la asignación con accesorios si se envían
        val accesorios = dto.accesorios?.mapNotNull { accesorioService.findById(it) }
        val asignacion = Asignacion(
            dispositivo = dispositivo,
            empleado = empleado,
            fechaAsignacion = dto.fechaAsignacion,
            fechaFinalizacion = null,
            motivoFinalizacion = null,
            estado = Asignacion.EstadoAsignacion.ACTIVA,
            fechaDevolucion = null,
            comentario = dto.comentario,
            observaciones = dto.observaciones,
            accesorios = accesorios
        )
        val saved = asignacionRepository.save(asignacion)
        // Asociar la asignación a los accesorios (si hay)
        accesorios?.forEach { accesorio ->
            accesorio.asignacion = saved
            accesorioService.save(accesorio)
        }
        saved
    } catch (e: Exception) {
        throw RuntimeException("Error al crear la asignación: ${e.message}", e)
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
            // Desasociar accesorios actuales
            existente.accesorios?.forEach { accesorio ->
                accesorio.asignacion = null
                accesorioService.save(accesorio)
            }
            // Validación: accesorios no pueden estar asignados a otra asignación activa
            dto.accesorios?.forEach { accesorioId ->
                val accesorio = accesorioService.findById(accesorioId)
                if (accesorio?.asignacion?.estado == Asignacion.EstadoAsignacion.ACTIVA && accesorio.asignacion?.asignacionId != existente.asignacionId) {
                    throw IllegalArgumentException("El accesorio con id $accesorioId ya está asignado a otra asignación activa.")
                }
            }
            // Asociar nuevos accesorios
            val nuevosAccesorios = dto.accesorios?.mapNotNull { accesorioService.findById(it) }
            nuevosAccesorios?.forEach { accesorio ->
                accesorio.asignacion = existente
                accesorioService.save(accesorio)
            }
            val actualizado = existente.copy(
                fechaAsignacion = dto.fechaAsignacion,
                comentario = dto.comentario,
                observaciones = dto.observaciones,
                accesorios = nuevosAccesorios
            )
            asignacionRepository.save(actualizado)
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
            asignacionRepository.save(asignacionFinalizada)
        } catch (e: Exception) {
            throw RuntimeException("Error al finalizar la asignación con id $id: ${e.message}", e)
        }
    }

    fun delete(id: Long) = try {
        asignacionRepository.deleteById(id)
    } catch (e: Exception) {
        throw RuntimeException("Error al eliminar la asignación con id $id: ${e.message}", e)
    }
} 