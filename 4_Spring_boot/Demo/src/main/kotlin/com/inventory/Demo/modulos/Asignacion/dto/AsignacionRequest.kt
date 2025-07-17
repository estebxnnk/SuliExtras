package com.inventory.Demo.modulos.Asignacion.dto

import java.time.LocalDate

// DTO para crear/editar asignaciones
// Solo contiene los IDs de las relaciones y campos editables

data class AsignacionRequest(
    val dispositivoId: Long,
    val empleadoId: Long,
    val fechaAsignacion: LocalDate,
    val comentario: String?,
    val observaciones: String?,
    val accesorios: List<Long>? = null
) 