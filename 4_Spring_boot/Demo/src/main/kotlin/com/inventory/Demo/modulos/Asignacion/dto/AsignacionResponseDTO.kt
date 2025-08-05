package com.inventory.Demo.modulos.Asignacion.dto

import com.inventory.Demo.modulos.Asignacion.model.Asignacion
import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Area.model.Area
import java.time.LocalDate

data class AsignacionResponseDTO(
    val asignacionId: Long,
    val dispositivo: DispositivoInfo,
    val empleado: EmpleadoInfo,
    val sede: SedeInfo,
    val area: AreaInfo,
    val fechaAsignacion: LocalDate,
    val fechaFinalizacion: LocalDate?,
    val motivoFinalizacion: String?,
    val estado: String,
    val comentario: String?,
    val observaciones: String?,
    val accesorios: List<AccesorioInfo>?,
    val esReasignacion: Boolean = false
) {
    data class DispositivoInfo(
        val dispositivoId: Long,
        val item: String?,
        val serial: String?,
        val modelo: String?,
        val marca: String?,
        val estado: String,
        val tipo: String?
    )
    
    data class EmpleadoInfo(
        val id: Long?,
        val documentoIdentidad: String,
        val nombreCompleto: String,
        val cargo: String,
        val email: String?
    )
    
    data class SedeInfo(
        val id: Long?,
        val nombre: String,
        val ubicacion: String,
        val ciudad: String
    )
    
    data class AreaInfo(
        val id: Long?,
        val nombre: String,
        val proceso: String,
        val canal: String?
    )
    
    data class AccesorioInfo(
        val dispositivoId: Long,
        val item: String?,
        val serial: String?,
        val modelo: String?,
        val marca: String?,
        val tipoAccesorio: String,
        val estado: String
    )
    
    companion object {
        fun fromAsignacion(asignacion: Asignacion, esReasignacion: Boolean = false): AsignacionResponseDTO {
            return AsignacionResponseDTO(
                asignacionId = asignacion.asignacionId,
                dispositivo = DispositivoInfo(
                    dispositivoId = asignacion.dispositivo.dispositivoId,
                    item = asignacion.dispositivo.item,
                    serial = asignacion.dispositivo.serial,
                    modelo = asignacion.dispositivo.modelo,
                    marca = asignacion.dispositivo.marca,
                    estado = asignacion.dispositivo.estado.name,
                    tipo = asignacion.dispositivo.tipo
                ),
                empleado = EmpleadoInfo(
                    id = asignacion.empleado.id,
                    documentoIdentidad = asignacion.empleado.documentoIdentidad,
                    nombreCompleto = asignacion.empleado.nombreCompleto,
                    cargo = asignacion.empleado.cargo,
                    email = asignacion.empleado.email
                ),
                sede = SedeInfo(
                    id = asignacion.sede.id,
                    nombre = asignacion.sede.nombre,
                    ubicacion = asignacion.sede.ubicacion,
                    ciudad = asignacion.sede.ciudad
                ),
                area = AreaInfo(
                    id = asignacion.area.id,
                    nombre = asignacion.area.nombre,
                    proceso = asignacion.area.proceso,
                    canal = asignacion.area.canal
                ),
                fechaAsignacion = asignacion.fechaAsignacion,
                fechaFinalizacion = asignacion.fechaFinalizacion,
                motivoFinalizacion = asignacion.motivoFinalizacion,
                estado = asignacion.estado.name,
                comentario = asignacion.comentario,
                observaciones = asignacion.observaciones,
                accesorios = asignacion.accesorios?.map { accesorio ->
                    AccesorioInfo(
                        dispositivoId = accesorio.dispositivoId,
                        item = accesorio.item,
                        serial = accesorio.serial,
                        modelo = accesorio.modelo,
                        marca = accesorio.marca,
                        tipoAccesorio = accesorio.tipoAccesorio,
                        estado = accesorio.estado.name
                    )
                },
                esReasignacion = esReasignacion
            )
        }
    }
} 