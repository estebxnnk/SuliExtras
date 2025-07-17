package com.inventory.Demo.modulos.Asignacion.dto

import java.time.LocalDate

// DTO para Categoria
data class CategoriaDTO(
    val categoriaId: Long,
    val nombre: String,
    val descripcion: String?
)

// DTO para Accesorio
data class AccesorioDTO(
    val id: Long?,
    val tipo: String,
    val marca: String?,
    val serial: String,
    val modelo: String?,
    val estado: String
)

// DTO para Sede (sin lista de dispositivos)
data class SedeDTO(
    val id: Long?,
    val nombre: String,
    val ubicacion: String,
    val ciudad: String
)

// DTO para Area (sin lista de empleados)
data class AreaDTO(
    val id: Long?,
    val nombre: String,
    val clase: String?,
    val proceso: String,
    val canal: String?,
    val subCanal: String?,
    val sede: SedeDTO
)

// DTO para Empleado (con Area)
data class EmpleadoDTO(
    val id: Long?,
    val documentoIdentidad: String,
    val nombreCompleto: String,
    val cargo: String,
    val email: String?,
    val telefono: String?,
    val lineaCorporativa: String?,
    val area: AreaDTO
)

// DTO para Dispositivo (con Sede, Categoria y Accesorios)
data class DispositivoDTO(
    val dispositivoId: Long,
    val item: String,
    val serial: String,
    val modelo: String,
    val marca: String,
    val categoria: CategoriaDTO?,
    val sede: SedeDTO?,
    val estado: String,
    val clasificacion: String,
    val fechaAdquisicion: LocalDate?,
    val costo: Double?,
    val codigoActivo: String,
    val tipo: String,
    val observaciones: String?,
    val accesorios: List<AccesorioDTO>
)

// DTO para Asignacion (con Dispositivo y Empleado completos)
data class AsignacionResponseDTO(
    val asignacionId: Long,
    val dispositivo: DispositivoDTO,
    val empleado: EmpleadoDTO,
    val fechaAsignacion: LocalDate,
    val fechaFinalizacion: LocalDate?,
    val motivoFinalizacion: String?,
    val estado: String,
    val fechaDevolucion: LocalDate?,
    val comentario: String?,
    val observaciones: String?
) 