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
            accesorios = null // Se asignan después
        )
        val saved = asignacionRepository.save(asignacion)
        // Asignar accesorios a la nueva asignación
        dto.accesorios?.forEach { accesorioId ->
            val accesorio = accesorioService.findById(accesorioId)
            if (accesorio != null) {
                accesorio.asignacion = saved
                accesorioService.save(accesorio)
            }
        }
        saved
    } catch (e: Exception) {
        throw RuntimeException("Error al crear la asignación: ${e.message}", e)
    }

    fun update(id: Long, dto: AsignacionRequest): Asignacion? {
        return try {
            val existente = findById(id) ?: return null
            if (existente.dispositivo.dispositivoId != dto.dispositivoId ||
                existente.empleado.id != dto.empleadoId) {
                throw IllegalArgumentException("No se permite cambiar el dispositivo o el empleado de la asignación.")
            }
            // Desasociar accesorios actuales
            existente.accesorios?.forEach { accesorio ->
                accesorio.asignacion = null
                accesorioService.save(accesorio)
            }
            // Asociar nuevos accesorios
            dto.accesorios?.forEach { accesorioId ->
                val accesorio = accesorioService.findById(accesorioId)
                if (accesorio != null) {
                    accesorio.asignacion = existente
                    accesorioService.save(accesorio)
                }
            }
            val actualizado = existente.copy(
                fechaAsignacion = dto.fechaAsignacion,
                comentario = dto.comentario,
                observaciones = dto.observaciones
            )
            asignacionRepository.save(actualizado)
        } catch (e: Exception) {
            throw RuntimeException("Error al actualizar la asignación con id $id: ${e.message}", e)
        }
    }

    fun delete(id: Long) = try {
        asignacionRepository.deleteById(id)
    } catch (e: Exception) {
        throw RuntimeException("Error al eliminar la asignación con id $id: ${e.message}", e)
    }
} 