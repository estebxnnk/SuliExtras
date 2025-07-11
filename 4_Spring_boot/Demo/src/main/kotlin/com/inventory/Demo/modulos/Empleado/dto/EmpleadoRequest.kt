package com.inventory.Demo.modulos.Empleado.dto

data class EmpleadoRequest(
    val documentoIdentidad: String,
    val nombreCompleto: String,
    val cargo: String,
    val email: String?,
    val telefono: String?,
    val areaId: Long
) 