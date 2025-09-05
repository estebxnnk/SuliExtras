package com.inventory.Demo.modulos.Accesorio.dto

import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import java.time.LocalDate

data class AccesorioRequest(
    val item: String?,
    val serial: String?,
    val modelo: String?,
    val marca: String?,
    val categoriaId: Long?,
    val sedeId: Long?,
    val estado: EstadoDispositivo,
    val clasificacion: String,
    val fechaAdquisicion: LocalDate?,
    val costo: Double?,
    val funcional: Boolean?,
    val codigoActivo: String?,
    val tipo: String?,
    val observaciones: String?,
    val tipoAccesorio: String,
    val esCombo: Boolean = false,
    val accesoriosComboIds: List<Long> = emptyList()
) 