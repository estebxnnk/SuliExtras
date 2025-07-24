package com.inventory.Demo.importer

import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.MantenimientoEntry
import java.time.LocalDate
import java.time.format.DateTimeFormatter

fun String?.toBooleanSi(): Boolean {
    return this?.trim()?.equals("si", ignoreCase = true) == true
} 

fun String?.toBooleanFuncional(): Boolean {
    return this?.trim()?.equals("funcional", ignoreCase = true) == true
} 

fun String?.toMantenimientoList(): List<MantenimientoEntry> {
    val fechaStr = this?.trim()
    return if (!fechaStr.isNullOrBlank()) {
        val formatos = listOf(
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ISO_LOCAL_DATE
        )
        for (formato in formatos) {
            try {
                val fecha = LocalDate.parse(fechaStr, formato)
                return listOf(MantenimientoEntry(fecha = fecha, mantenimientoRealizado = true, observacion = null))
            } catch (_: Exception) {}
        }
        // Si ningún formato es válido, retorna vacío
        emptyList()
    } else {
        emptyList()
    }
} 