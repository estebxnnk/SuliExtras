package com.inventory.Demo.modulos.Accesorio.dto

import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import java.time.LocalDate

data class AccesorioResponseDTO(
    val dispositivoId: Long,
    val item: String?,
    val serial: String?,
    val modelo: String?,
    val marca: String?,
    val categoria: String?,
    val sede: String?,
    val estado: EstadoDispositivo,
    val clasificacion: String,
    val fechaAdquisicion: LocalDate?,
    val costo: Double?,
    val funcional: Boolean?,
    val codigoActivo: String?,
    val tipo: String?,
    val observaciones: String?,
    val tipoAccesorio: String,
    val esCombo: Boolean,
    val accesoriosCombo: List<AccesorioResponseDTO> = emptyList()
) 