package com.inventory.Demo.modulos.Asignacion.dto

import java.time.LocalDate

// Puedes ajustar los campos según lo que recibas en el request
// Por ejemplo, ids de dispositivo y empleado, fechas, motivo, comentario, observaciones

data class AsignacionRequest(
    val dispositivoId: Long,
    val empleadoId: Long,
    val fechaAsignacion: LocalDate,
    val fechaFinalizacion: LocalDate? = null,
    val motivoFinalizacion: String? = null,
    val fechaDevolucion: LocalDate? = null,
    val comentario: String? = null,
    val observaciones: String? = null
) 